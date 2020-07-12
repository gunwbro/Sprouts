const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
require('dotenv').config();

const pageRouter = require("./routes/page");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const userRouter = require("./routes/user");

const { sequelize } = require('./models');
const passportConfig = require('./passport');

const app = express();
sequelize.sync();
passportConfig(passport);

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.set("port", process.env.PORT || 8001);

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use('/img', express.static(path.join(__dirname, 'uploads')));

app.use(express.json()); // body-parser, JSON 형식의 데이터 전달 방식
app.use(express.urlencoded({ extended: false })); // 주소 형식으로 데이터를 보내는 방식,
// false면 노드의 querystring 모듈 사용하여 쿼리스트링 해석, true면 qs모듈 사용(npm 패키지)
app.use(cookieParser("process.env.COOKIE_SECRET"));
app.use(
  session({
    resave: false, // 요청이 들어왔을 때 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할지 여부
    saveUninitialized: false, // 세션에 저장할 내역이 없더라도 세션을 저장할지에 대한 설정
    secret: process.env.COOKIE_SECRET, // cookie-parser의 비밀 키와 같은 역할
    cookie: {
      httpOnly: true, // 클라이언트에서 쿠키 확인 못함
      secure: false, // https가 아닌 환경에서도 사용할 수 있게 함
    },
  })
);
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use("/", pageRouter);
app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/user", userRouter);

app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};
  res.status(err.status || 500);
  res.render("error");
});

app.listen(app.get("port"), () => {
  console.log(app.get("port"), "번 포트에서 대기 중");
});
