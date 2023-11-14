require("dotenv").config();
const express = require("express");
const app = express();
const usersRouter = require("./routes/users.js");
const productRouter = require("./routes/products.js");

const port = process.env.PORT;

//mongoose connect
const connect = require("./mongodb");
connect();

//Sequelize connect
const { sequelize } = require("./models");
// 다른 require문은 일단 생략
const ConnectDB = async () => {
  try {
    await sequelize
      .authenticate()
      .then(() => console.log("데이터베이스 연결 성공!"));
    await sequelize.sync().then(() => console.log("동기화 완료!"));
  } catch (error) {
    console.error("DB 연결 및 동기화 실패", error);
  }
};
// DB와 연결 및 동기화
ConnectDB();

app.use(express.json());

// 웹사이트 디자인(프론트 구현)
// app.use(express.urlencoded({ extended: false }));
// app.use(express.static("assets"));

app.use("/api", [usersRouter, productRouter]);

app.get("/", (req, res) => {
  res.send("hello");
});

app.listen(port, () => {
  console.log(port, "번호로 연결되었습니다.");
});
