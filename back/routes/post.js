const express = require("express");
const multer = require("multer");
const path = require("path"); // node에서 제공
const { Post, Comment, Image, User, Hashtag } = require("../models");
const { isLoggedIn } = require("./middlewares");
const { Op } = require("sequelize");
const multerS3 = require("multer-s3");
const AWS = require("aws-sdk");

const router = express.Router();

AWS.config.update({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: "ap-northeast-2",
});
const upload = multer({
    storage: multerS3({
        s3: new AWS.S3(),
        bucket: "react-nodebird-aws-s3",
        key(req, file, cb) {
            cb(
                null,
                `original/${Date.now()}_${path.basename(file.originalname)}`
            );
        },
    }),
    // 크기 제한을 지정
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// 게시글 추가
// upload.none() => 오직 텍스트 필드만 허용
router.post("/", isLoggedIn, upload.none(), async (req, res, next) => {
    try {
        // ['#노드','#노드','#노드'] => 중복 방지
        const hashtags = Array.from(
            new Set(req.body.content.match(/#[^\s#]+/g))
        );
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });
        if (hashtags) {
            // 없을 때는 등록, 있으면 가져옴.
            const result = await Promise.all(
                hashtags.map((tag) =>
                    Hashtag.findOrCreate({
                        where: { name: tag.slice(1).toLowerCase() },
                    })
                )
            );
            // => result: [[노드,true], [리액트, true]]
            await post.addHashtags(result.map((v) => v[0]));
        }
        if (req.body.image) {
            if (Array.isArray(req.body.image)) {
                // 이미지를 여러 개 올리면 // image: [안녕.png, 하이.png]
                // 한 번에 여러 개의 이미지 주소를 DB에 저장
                const images = await Promise.all(
                    req.body.image.map((image) => Image.create({ src: image }))
                );
                await post.addImages(images);
            } else {
                // 하나만 올리면 image: 안녕.png
                const image = await Image.create({ src: req.body.image });
                await post.addImages(image);
            }
        }
        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [
                {
                    model: Image,
                },
                {
                    model: Comment,
                    include: [
                        {
                            model: User, // 댓글 작성자
                            attributes: ["id", "nickname"],
                        },
                    ],
                },
                {
                    model: User, // 게시글 작성자
                    attributes: ["id", "nickname"],
                },
                {
                    model: User, // 좋아요 누른 사람
                    as: "Likers",
                    attributes: ["id"],
                },
            ],
        });
        res.status(201).json(fullPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// .array(fieldname) => fieldname 인자에 명시된 이름의 파일 전부를 배열 형태로 전달 받음
router.post(
    "/images",
    isLoggedIn,
    upload.array("image"),
    async (req, res, next) => {
        // req.files 는 `image` 라는 파일정보를 배열로 가지고 있음.
        res.json(
            req.files.map((v) => v.location.replace(/\/original\//, "/thumb/"))
        );
    }
);

// 댓글 추가
router.post("/:postId/comment", isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
        });
        if (!post) {
            return res.status(403).send("존재하지 않는 게시글입니다.");
        }
        const comment = await Comment.create({
            content: req.body.content,
            PostId: parseInt(req.params.postId),
            UserId: req.user.id,
        });
        const fullComment = await Comment.findOne({
            where: { id: comment.id },
            include: [
                {
                    model: User,
                    attributes: ["id", "nickname"],
                },
            ],
        });
        return res.status(201).json(fullComment);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 게시글 수정
router.post("/modify", isLoggedIn, upload.none(), async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.body.postId },
        });
        if (!post) {
            return res.status(404).send("존재하지 않는 게시글입니다.");
        }

        // 수정 전 해시태그 지우기
        const exHashtags = Array.from(new Set(post.content.match(/#[^\s#]+/g)));
        if (exHashtags) {
            const exResult = await Promise.all(
                exHashtags.map((tag) =>
                    Hashtag.findOne({
                        where: { name: tag.slice(1).toLowerCase() },
                    })
                )
            );
            await post.removeHashtags(exResult.map((v) => v[0]));
        }
        // 해시태그 추가하기
        const hashtags = Array.from(
            new Set(req.body.content.match(/#[^\s#]+/g))
        );
        if (hashtags) {
            // 없을 때는 등록, 있으면 가져옴.
            const result = await Promise.all(
                hashtags.map((tag) =>
                    Hashtag.findOrCreate({
                        where: { name: tag.slice(1).toLowerCase() },
                    })
                )
            );
            // => result: [[노드,true], [리액트, true]]
            await post.addHashtags(result.map((v) => v[0]));
        }
        await Post.update(
            {
                content: req.body.content,
            },
            {
                where: { id: req.body.postId },
            }
        );
        if (req.body.image) {
            if (Array.isArray(req.body.image)) {
                // 이미지를 여러 개 올리면 // image: [안녕.png, 하이.png]
                // 한 번에 여러 개의 이미지 주소를 DB에 저장
                const images = await Promise.all(
                    req.body.image.map((image) => Image.create({ src: image }))
                );
                await post.setImages(images);
            } else {
                // 하나만 올리면 image: 안녕.png
                const image = await Image.create({ src: req.body.image });
                await post.setImages(image);
            }
        }
        const fullPost = await Post.findOne({
            where: { id: req.body.postId },
            include: [
                {
                    model: Post,
                    as: "Retweet",
                    inclde: [
                        {
                            model: User,
                            attributes: ["id", "nickname"],
                        },
                        {
                            model: Image,
                        },
                    ],
                },
                {
                    model: User,
                    attributes: ["id", "nickname"],
                },
                {
                    model: Comment,
                    include: [
                        {
                            model: User,
                            attributes: ["id", "nickname"],
                        },
                    ],
                },
                {
                    model: Image,
                },
                {
                    model: User,
                    as: "Likers",
                    attributes: ["id", "nickname"],
                },
                {
                    model: Post,
                    as: "Retweet",
                    inclde: [
                        {
                            model: User,
                            attributes: ["id", "nickname"],
                        },
                        {
                            model: Image,
                        },
                    ],
                },
            ],
        });
        res.status(200).json(fullPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 특정 게시물 블러오기
router.get("/:postId", async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
        });
        if (!post) {
            return res.status(404).send("존재하지 않는 게시글입니다.");
        }
        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [
                {
                    model: Post,
                    as: "Retweet",
                    inclde: [
                        {
                            model: User,
                            attributes: ["id", "nickname"],
                        },
                        {
                            model: Image,
                        },
                    ],
                },
                {
                    model: User,
                    attributes: ["id", "nickname"],
                },
                {
                    model: User,
                    as: "Likers",
                    attributes: ["id", "nickname"],
                },
                {
                    model: Image,
                },
                {
                    model: Comment,
                    inclde: [
                        {
                            model: User,
                            attributes: ["id", "nickname"],
                        },
                    ],
                },
            ],
        });
        res.status(200).json(fullPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 리트윗
router.post("/:postId/retweet", isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
            inclde: [
                {
                    model: Post,
                    as: "Retweet",
                },
            ],
        });
        if (!post) {
            return res.status(403).send("존재하지 않는 게시글입니다.");
        }
        // 본인 게시물을 리트윗하거나,
        // 남이 본인 게시물을 리트윗한 글을 본인이 리트윗할 경우
        if (
            req.user.id === post.UserId ||
            (post.Retweet && post.Retweet.UserId === req.user.id)
        ) {
            return res.status(403).send("자신의 글은 리트윗할 수 없습니다.");
        }
        const retweetTargetId = post.RetweetId || post.id;
        const exPost = await Post.findOne({
            where: {
                UserId: req.user.id,
                RetweetId: retweetTargetId,
            },
        });
        // 이미 리트윗한 글을 다시 리트윗할 때
        if (exPost) {
            return res.status(403).send("이미 리트윗했습니다.");
        }
        const retweet = await Post.create({
            UserId: req.user.id,
            RetweetId: retweetTargetId,
            content: "retweet",
        });
        const retweetWithPrevPost = await Post.findOne({
            where: { id: retweet.id },
            include: [
                {
                    model: Post,
                    as: "Retweet",
                    include: [
                        {
                            model: User,
                            attributes: ["id", "nickname"],
                        },
                        {
                            model: Image,
                        },
                    ],
                },
                {
                    model: User,
                    attributes: ["id", "nickname"],
                },
                {
                    model: User, // 좋아요 누른 사람
                    as: "Likers",
                    attributes: ["id"],
                },
                {
                    model: Image,
                },
                {
                    model: Comment,
                    include: [
                        {
                            model: User,
                            attributes: ["id", "nickname"],
                        },
                    ],
                },
            ],
        });
        res.status(201).json(retweetWithPrevPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 좋아요
router.patch("/:postId/like", isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
        });
        if (!post) {
            return res.status(403).send(" 게시글이 존재하지 않습니다.");
        }
        // 시퀄라이즈 관계메소드
        await post.addLikers(req.user.id);
        return res.status(200).json({ postId: post.id, UserId: req.user.id });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 좋아요 취소
router.delete("/:postId/like", isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
        });
        if (!post) {
            return res.status(403).send(" 게시글이 존재하지 않습니다.");
        }
        await post.removeLikers(req.user.id);
        return res.status(200).json({ postId: post.id, UserId: req.user.id });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 게시글 삭제
router.delete("/:postId", isLoggedIn, async (req, res, next) => {
    try {
        await Post.destroy({
            where: { id: parseInt(req.params.postId) },
            UserId: req.user.id,
        });
        res.status(200).json({ PostId: parseInt(req.params.postId) });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 검색
router.post("/search", async (req, res, next) => {
    try {
        const searchPost = await Post.findAll({
            where: {
                content: {
                    [Op.like]: "%" + req.body.search + "%",
                },
            },
            include: [
                {
                    model: User,
                    attributes: ["id", "nickname"],
                },
                {
                    model: Comment,
                    include: [
                        {
                            model: User,
                            attributes: ["id", "nickname"],
                        },
                    ],
                },
                {
                    model: Image,
                },
                {
                    model: Hashtag,
                },
                {
                    model: User,
                    as: "Likers",
                    attributes: ["id", "nickname"],
                },
            ],
        });
        res.status(200).json(searchPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 이미지 존재 여부
router.post("/:postId/image", isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
        });
        if (!post) {
            return res.status(403).send(" 게시글이 존재하지 않습니다.");
        }
        const image = await Image.findOne({
            where: { src: req.body.image, postId: post.id },
        });
        if (!image) {
            return res.status(200).send(false);
        }
        return res.status(200).send(true);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 이미지 삭제
router.post("/image", isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.body.postId },
        });
        if (!post) {
            return res.status(403).send(" 게시글이 존재하지 않습니다.");
        }
        const image = await Image.findOne({
            where: { src: req.body.image, postId: req.body.postId },
        });
        await post.removeImages(image);
        res.status(200).json(image.src);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
