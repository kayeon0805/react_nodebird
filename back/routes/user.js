const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");
// db.User
const { User, Post, Image, Comment } = require("../models");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { Op } = require("sequelize");

const router = express.Router();

// 로그인한 유저 정보
router.get("/", async (req, res, next) => {
    try {
        if (req.user) {
            const fullUserWithoutPassword = await User.findOne({
                where: { id: req.user.id },
                attributes: {
                    exclude: ["password"],
                },
                include: [
                    {
                        model: Post,
                        attributes: ["id"],
                    },
                    {
                        model: User,
                        as: "Followings",
                        attributes: ["id"],
                    },
                    {
                        model: User,
                        as: "Followers",
                        attributes: ["id"],
                    },
                ],
            });
            return res.status(200).json(fullUserWithoutPassword);
        } else {
            res.status(200).json(null);
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 로그인
// 미들웨어 확장
router.post("/login", isNotLoggedIn, (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
        if (err) {
            console.error(err);
            return next(err);
        }
        if (info) {
            return res.status(401).send(info.reason);
        }
        // passport login
        return req.login(user, async (loginErr) => {
            if (loginErr) {
                console.error(loginErr);
                return next(loginErr);
            }
            const fullUserWithoutPassword = await User.findOne({
                where: { id: user.id },
                attributes: {
                    exclude: ["password"],
                },
                // ../models/user에 associate 부분 참고해서 가져오기
                include: [
                    {
                        model: Post,
                        attributes: ["id"],
                    },
                    {
                        model: User,
                        as: "Followings",
                        attributes: ["id"],
                    },
                    {
                        model: User,
                        as: "Followers",
                        attributes: ["id"],
                    },
                ],
            });
            // res.setHeader() => 이런 식으로 알아서 쿠키를 보내주고, 세션이랑 연결해줌.
            return res.status(200).json(fullUserWithoutPassword);
        });
    })(req, res, next);
});

// 회원가입
router.post("/", isNotLoggedIn, async (req, res, next) => {
    try {
        // 동일한 이메일을 가진 유저가 존재하는지 확인
        const exUser = await User.findOne({
            where: {
                email: req.body.email,
            },
        });
        if (exUser) {
            return res.status(403).send("이미 사용 중인 아이디입니다.");
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 12);
        await User.create({
            email: req.body.email,
            nickname: req.body.nickname,
            password: hashedPassword,
        });
        res.status(201).send("ok");
    } catch (error) {
        console.eroror(error);
        next(error);
    }
});

// 로그아웃
router.post("/logout", isLoggedIn, (req, res) => {
    req.logout();
    req.session.destroy();
    res.status(200).send("ok");
});

// 닉네임 변경
router.patch("/nickname", isLoggedIn, async (req, res, next) => {
    try {
        await User.update(
            {
                nickname: req.body.nickname,
            },
            {
                where: { id: req.user.id },
            }
        );
        res.status(200).json({ nickname: req.body.nickname });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 특정 사용자의 게시물
router.get("/:userId/posts", async (req, res, next) => {
    // GET /posts
    try {
        const where = { UserId: req.params.userId };
        // 초기 로딩이 아닐 때(게시물의 갯수가 0이 아닐 때)
        if (parseInt(req.query.lastId, 10)) {
            // 게시물이 디샌딩 순이므로 다음 게시물들을 불러올 때
            // lastId보다 작은 수부터 불러와야 함
            where.id = { [Op.lt]: parseInt(req.query.lastId, 10) }; // id가 lastId보다 작은
        }
        const posts = await Post.findAll({
            where,
            limit: 10,
            order: [
                ["createdAt", "DESC"],
                [Comment, "createdAt", "DESC"],
            ],
            include: [
                {
                    model: User,
                    attributes: ["id", "nickname"],
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
                {
                    model: User, // 좋아요 누른 사람
                    as: "Likers",
                    attributes: ["id"],
                },
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
            ],
        });
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 팔로우
router.patch("/:userId/follow", isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.params.userId } });
        if (!user) {
            return res.status(403).send("존재하지 않는 회원입니다.");
        }
        await user.addFollowers(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId) });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 언팔로우
router.delete("/:userId/follow", isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.params.userId } });
        if (!user) {
            return res.status(403).send("존재하지 않는 회원입니다.");
        }
        await user.removeFollowers(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId) });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 팔로워 삭제
router.delete("/follower/:userId", isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.params.userId } });
        if (!user) {
            return res.status(403).send("존재하지 않는 회원입니다.");
        }
        await user.removeFollowings(req.user.id);
        res.status(200).json({ UserId: parseInt(req.params.userId) });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 팔로워 불러오기
router.get("/followers", isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        const followers = await user.getFollowers({
            limit: parseInt(req.query.limit, 10),
        });
        res.status(200).json(followers);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 팔로잉 불러오기
router.get("/followings", isLoggedIn, async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { id: req.user.id } });
        const followings = await user.getFollowings({
            limit: parseInt(req.query.limit, 10),
        });
        res.status(200).json(followings);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 특정 유저 정보
router.get("/:userId", async (req, res, next) => {
    try {
        const fullUserWithoutPassword = await User.findOne({
            where: { id: req.params.userId },
            attributes: {
                exclude: ["password"],
            },
            include: [
                {
                    model: Post,
                    attributes: ["id"],
                },
                {
                    model: User,
                    as: "Followings",
                    attributes: ["id"],
                },
                {
                    model: User,
                    as: "Followers",
                    attributes: ["id"],
                },
            ],
        });
        if (fullUserWithoutPassword) {
            // 타인의 정보이므로 개인정보 보호
            const data = fullUserWithoutPassword.toJSON();
            data.Posts = data.Posts.length;
            data.Followers = data.Followers.length;
            data.Followings = data.Followings.length;
            return res.status(200).json(data);
        } else {
            res.status(404).json("존재하지 않는 사용자입니다.");
        }
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
