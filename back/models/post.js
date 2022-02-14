const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class Post extends Model {
    static init(sequelize) {
        return super.init(
            {
                // id가 기본적으로 들어있다.
                content: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
            },
            {
                modelName: "Post",
                tableName: "posts",
                // 한글 + 이모티콘 저장
                charset: "utf8mb4",
                collate: "utf8mb4_general_ci",
                sequelize,
            }
        );
    }

    static associate(db) {
        db.Post.belongsTo(db.User); // post.addUser, post.getUser, post.setUser
        db.Post.hasMany(db.Comment); // post.addComments
        db.Post.hasMany(db.Image); // post.addImages
        db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); // post.addHashtags
        db.Post.belongsToMany(db.User, { through: "Like", as: "Likers" }); // post.addLikers, post.removeLikers
        db.Post.belongsTo(db.Post, { as: "Retweet" }); // post.addReteet
    }
};
