const express = require("express");
const cors = require("cors");
const path = require("path");
const postRouter = require("./routes/post");
const postsRouter = require("./routes/posts");
const userRouter = require("./routes/user");
const hashtagRouter = require("./routes/hashtag");
const db = require("./models");
const passportConfig = require("./passport");
const passport = require("passport");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
const hpp = require("hpp");
const helmet = require("helmet");

dotenv.config();

const app = express();
db.sequelize
    .sync()
    .then(() => {
        console.log("db 연결 성공");
    })
    .catch(console.error);

passportConfig();
app.set("trust proxy", 1);

if (process.env.NODE_ENV === "production") {
    app.use(morgan("combined")); // 프론트 서버에서 백엔드 서버로 보낸 요청 확인 가능
    app.use(hpp());
    app.use(helmet({ contentSecurityPolicy: false }));
    app.use(
        cors({
            origin: ["https://nodebird.site", "http://www.nodebird.site"],
            credentials: true,
        })
    );
} else {
    app.use(morgan("dev"));
    app.use(
        cors({
            origin: true,
            credentials: true,
        })
    );
}
// json 형태로 request body 받기 위함.
// form을 submit했을 때 넘어오는 데이터를 request body로 받기 위함.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
    session({
        saveUninitialized: false,
        resave: false,
        secret: process.env.COOKIE_SECRET,
        proxy: true,
        cookie: {
            httpOnly: true,
            secure: true,
            domain: process.env.NODE_ENV === "production" && ".nodebird.site",
        },
    })
);
app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.send("hello, express");
});

app.use("/post", postRouter);
app.use("/posts", postsRouter);
app.use("/user", userRouter);
app.use("/hashtag", hashtagRouter);

app.listen(3065, () => {
    console.log("서버 실행 중");
});
