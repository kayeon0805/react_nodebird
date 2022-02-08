module.exports = (sequelize, DataTypes) => {
    const Comment = sequelize.define('Comment', { // MySql에서는 users 테이블 생성
        // id가 기본적으로 들어있다.
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    }, {
        // 한글 + 이모티콘 저장
        charset: 'utf8mb4',
        collate:  'utf8mb4_general_ci'
    });
    Comment.associate = (db) => {
        db.Comment.belongsTo(db.User);
        db.Comment.belongsTo(db.Post);
    };
    return Comment;
};