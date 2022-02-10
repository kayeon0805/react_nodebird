const express = require('express');
const { Op } = require('sequelize');
const { Post, Image, User, Comment } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => { // GET /posts
    try {
        const where = {};
        // 초기 로딩이 아닐 때(게시물의 갯수가 0이 아닐 때)
        if (parseInt(req.query.lastId, 10)) {
            // 게시물이 디샌딩 순이므로 다음 게시물들을 불러올 때
            // lastId보다 작은 수부터 불러와야 함
        where.id = { [Op.lt]: parseInt(req.query.lastId, 10)} // id가 lastId보다 작은
        }
        const posts = await Post.findAll({
            where,
            limit: 10,
            order: [
                ['createdAt', 'DESC'],
                [Comment, 'createdAt', 'DESC'],
            ],
            include: [{
                model: User,
                attributes: ['id', 'nickname'],
            }, {
                model: Image,
            }, {
                model: Comment,
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }],
            }, {
                model: User, // 좋아요 누른 사람
                as: 'Likers',
                attributes: ['id'],
            }, {
                model: Post,
                as: 'Retweet',
                include: [{
                    model: User,
                    attributes: ['id', 'nickname'],
                }, {
                    model: Image,
                }]
            }],
        });
        console.log(posts);
        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;