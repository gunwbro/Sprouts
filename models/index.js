const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config')[env]; // 뒤에붙은 [env] 는 무슨 의미 일까?
const db = {};

const sequelize = new Sequelize(
  config.database, config.username, config.password, config,
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = require('./user')(sequelize, Sequelize);
db.Post = require("./post")(sequelize, Sequelize);
db.Hashtag = require('./hashtag')(sequelize, Sequelize);
db.User.hasMany(db.Post); // User모델과 Post 모델은
db.Post.belongsTo(db.User); //   1:N 관계 이다.
db.Post.belongsToMany(db.Hashtag, { through: "PostHashtag" }); // Post 모델과 Hashtag 모델은
db.Hashtag.belongsToMany(db.Post, { through: "PostHashtag" }); // N:M (또는 다대다) 관계이다.
db.User.belongsToMany(db.User, {
  foreignKey: "followingId",
  as: 'Followers',
  through: "Follow",
});
db.User.belongsToMany(db.User, {
  foreignKey: "followerId",
  as: "Followings",
  through: "Follow",
});
module.exports = db;
