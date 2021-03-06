const express = require("express");
const { isLoggedIn, isNotLoggedIn } = require("./middlewares");
const { Post, User } = require("../models");

const router = express.Router();

router.get("/profile", isLoggedIn, (req, res) => {
  res.render("profile", { title: "내 정보 - Sprouts", user: req.user });
});

router.get("/join", isNotLoggedIn, (req, res) => {
  res.render("join", {
    title: "회원가입 - Sprouts",
    user: req.user,
    joinError: req.flash("joinError"),
  });
});

router.get("/", async (req, res, next) => {
  const po = await Post.findOne({ where : { id: 1 }});
  Post.findAll({
    include: {
      model: User,
      attributes: ['id', 'nick'],
    },
    order: [['createdAt', 'DESC']],
  })
  .then((posts) => {
    res.render("main", {
      title: "Sprouts",
      twits: posts,
      user: req.user,
      loginError: req.flash("loginError"),
    });
  })
  .catch((error) => {
    console.error(error)
    next(error);
  })
});

module.exports = router;