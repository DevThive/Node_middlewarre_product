require("dotenv").config();
const mongoose = require("mongoose");

const connect = () => {
  mongoose
    .connect(process.env.MONGODB_IP)
    .then(() => console.log("MongoDB 연결 성공"))
    .catch((err) => console.log(err));
};

mongoose.connection.on("error", (err) => {
  console.error("몽고디비 연결 에러", err);
});

module.exports = connect;
