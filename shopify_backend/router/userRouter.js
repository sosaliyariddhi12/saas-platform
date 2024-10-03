const express = require("express");
const { register, login } = require("../controller/userController");
const router = express.Router();
const secret =  process.env.SECRET || "fodhifoidh"

const validaction = (req, res, next) => {
  if (!req.body.email) {
    return res.status(400).json({
      code: 400,
      message: "Please enter email",
    });
  } else if (!req.body.password) {
    return res.status(400).json({
      code: 400,
      message: "Please enter password",
    });
  } else {
    next();
  }
};

const validaterToken = (req, res, next) => {
  const token = req.session.token;
  if (!token) {
    return res.status(400).json({
      code: 400,
      message: "Token Is Missing",
    });
  }
  jwt.verify(token, secret, (err, decode) => {
    if (err) {
      return res.status(400).json({
        code: 400,
        message: "Token Is Invalid",
      });
    }
    req.authUser = decode.data;
    next();
  });
};

router.post("/register", register);

router.post("/login", validaction, login);

module.exports = router;
