const express = require("express");
const router = express.Router();

const { Op } = require("sequelize");
const { Users } = require("../models");
const jwt = require("jsonwebtoken");

router.post("/users", async (req, res) => {
  const { email, nickname, password, confirmPassword } = req.body;
  let regEmail = /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/;
  let pwRef = /^[a-zA-z0-9]{6,12}$/;

  if (password !== confirmPassword) {
    res.status(400).send({
      errorMessage: "패스워드가 일치하지 않습니다.",
    });
    return false;
  }

  const existsUsers = await Users.findAll({
    where: {
      [Op.or]: [{ email }, { nickname }],
    },
  });

  if (!existsUsers.length) {
    if (regEmail.test(email)) {
      if (pwRef.test(password)) {
        await Users.create({ email, nickname, password });
        res.status(201).send({ result: `${email}, ${nickname}` });
      } else {
        res
          .status(400)
          .send({ errorMessage: "비밀번호는 6자리 이상 입력해주세요." });
      }
    } else {
      res.status(400).send({ errorMessage: "이메일 형식을 확인해주세요" });
      return;
    }
  } else {
    res
      .status(400)
      .send({ errorMessage: "이메일 또는 닉네임이 이미 사용중입니다." });
    return;
  }
});

router.post("/auth", async (req, res) => {
  const { email, password } = req.body;

  const user = await Users.findOne({
    where: {
      email,
    },
  });

  if (!user || password !== user.password) {
    res
      .status(400)
      .send({ errorMessage: "이메일 또는 패스워드를 확인해주세요!" });
    return;
  }

  res.send({
    token: jwt.sign({ userId: user.userId }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "12h",
    }),
  });
});

const authMiddleware = require("../middlewares/auth-middleware.js");
router.get("/users/me", authMiddleware, async (req, res) => {});

module.exports = router;