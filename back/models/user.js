const DataTypes = require("sequelize");
const { Model } = DataTypes;

module.exports = class User extends Model {
    static init(sequelize) {
        return super.init(
            {
                // id가 기본적으로 들어있다.
                email: {
                    type: DataTypes.STRING(30),
                    allowNull: false,
                    unique: true,
                },
                nickname: {
                    type: DataTypes.STRING(30),
                    allowNull: false,
                },
                password: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
            },
            {
                modelName: "User",
                tableName: "users",
                // 한글 저장
                charset: "utf8",
                collate: "utf8_general_ci",
                sequelize,
            }
        );
    }

    static associate(db) {
        db.User.hasMany(db.Post);
        db.User.hasMany(db.Comment);
        db.User.belongsToMany(db.Post, { through: "Like", as: "Liked" });
        db.User.belongsToMany(db.User, {
            through: "Follow",
            as: "Followers",
            foreignKey: "FollowingId",
        });
        db.User.belongsToMany(db.User, {
            through: "Follow",
            as: "Followings",
            foreignKey: "FollowerId",
        });
    }
};
