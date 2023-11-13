const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

module.exports = async (req, res, next) => {
  const { Authorization } = req.header;
  console.log(Authorization);
  return;
};
