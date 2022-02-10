const express = require('express');
const multer = require('multer');
const path = require('path'); // node에서 제공
const fs = require('fs'); // 파일시스템 조작
const { Post, Comment, Image, User } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

try {
    fs.accessSync('uploads');
} catch (error) {
    console.log('uploads 폴더가 없으므로 생성합니다.');
    fs.mkdirSync('uploads');
} 

const upload = multer({
    // 파일을 디스크에 저장하기 위함.
    storage: multer.diskStorage({
        // 어느 폴더안에 업로드 한 파일을 저장할 지를 결정
        destination(req, file, done) {
            done(null, 'uploads');
        },
        // 폴더안에 저장되는 파일 명을 결정하는데 사용
        filename(req, file, done) { // 안녕.png
            const ext = path.extname(file.originalname); // 확장자 추출(.png)
            const basename = path.basename(file.originalname, ext); // 안녕
            done(null, basename + '_' + new Date().getTime() + ext); // 안녕213121341.png
        },
    }),
    // 크기 제한을 지정
    limits: { fileSize: 20 * 1024 * 1024 }, // 20MB
});

// upload.none() => 오직 텍스트 필드만 허용
router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
    try {
        const post = await Post.create({
            content: req.body.content,
            UserId: req.user.id,
        });
        if (req.body.image) {
            if (Array.isArray(req.body.image)) { // 이미지를 여러 개 올리면 // image: [안녕.png, 하이.png]
                // 한 번에 여러 개의 이미지 주소를 DB에 저장
                const images = await Promise.all(req.body.image.map((image) => Image.create({ src: image })));
                await post.addImages(images);
            } else { // 하나만 올리면 image: 안녕.png
                const image = await Image.create({ src: req.body.image });
                await post.addImages(image);
            }
        }
        const fullPost = await Post.findOne({
            where: { id: post.id },
            include: [{
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User, // 댓글 작성자
                    attributes: ['id', 'nickname'],
                }],
            }, {
                model: User, // 게시글 작성자
                attributes: ['id', 'nickname'],
            }, {
                model: User, // 좋아요 누른 사람
                as: 'Likers',
                attributes: ['id'],
            }]
        });
        res.status(201).json(fullPost);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// .array(fieldname) => fieldname 인자에 명시된 이름의 파일 전부를 배열 형태로 전달 받음
router.post('/images', isLoggedIn, upload.array('image'), async (req, res, next) => {
    // req.files 는 `image` 라는 파일정보를 배열로 가지고 있음.
    console.log(req.files);
    res.json(req.files.map((v) => v.filename));
});

router.post('/:postId/comment', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId }
        });
        if (!post) {
            return res.status(403).send('존재하지 않는 게시글입니다.');
        }
        const comment = await Comment.create({
            content: req.body.content,
            PostId: parseInt(req.params.postId),
            UserId: req.user.id,
        });
        const fullComment = await Comment.findOne({
            where: { id: comment.id },
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
            }]
        })
        res.status(201).json(fullComment);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.patch('/:postId/like', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
        });
        if (!post) {
            return res.status(403).send(' 게시글이 존재하지 않습니다.');
        }
        // 시퀄라이즈 관계메소드
        await post.addLikers(req.user.id);
        return res.status(200).json({ postId: post.id, UserId: req.user.id });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:postId/like', isLoggedIn, async (req, res, next) => {
    try {
        const post = await Post.findOne({
            where: { id: req.params.postId },
        });
        if (!post) {
            return res.status(403).send(' 게시글이 존재하지 않습니다.');
        }
        await post.removeLikers(req.user.id);
        return res.status(200).json({ postId: post.id, UserId: req.user.id });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.delete('/:postId', isLoggedIn, async (req, res, next) => {
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


module.exports = router;