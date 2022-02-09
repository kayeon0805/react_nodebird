const passport = require('passport');
const local = require('./local');
const { User } = require('../models');

module.exports = () => {
    // 아이디를 저장함.
    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    // 라우터 접근 전에 저장해둔 아이디로 사용자 정보를 검색해서 req.user에 담음.
    passport.deserializeUser(async  (id, done) => {
        try {
            const user = await User.findOne({ where: { id } });
            done(null, user); // req.user
        } catch (error) {
            console.error(error);
            done(error);
        }
    });
    local();
};