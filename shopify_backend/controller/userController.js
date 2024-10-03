const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const register = require("../models/userModel");
const secret = process.env.SECRET || "fodhifoidh";

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    console.log("rteeee", req.body);

    const existingEmail = await register.findOne({ email })
    if (existingEmail) {
      return res.status(409).json({
        code:409,
        message:"Email is already registered",
        field:"email"
      })
    }

    const hashPassword = await bcrypt.hash(password, 10);
    const result = new register({
      name,
      email,
      phone,
      password: hashPassword,
    });

    const token = jwt.sign({ data: result }, secret, { expiresIn: "1h" });
    result.token = token;

    console.log("generate token", result.token);

    const savedResult = await result.save();
    console.log("savedResult",savedResult)

    req.session.token = token;
    console.log('back_token', req.session.token)

    if (!savedResult) {
      return res.status(400).json({
        code: 400,
        message: "User not registered!",
      });
    }
    return res.status(200).json({
      code: 200,
      message: "Register successfully!",
      data: savedResult,
      token:token
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const isExist = await register.findOne({
      email: email
    });

    console.log(isExist);
    if (!isExist) {
      return res.status(404).json({
        code: 404,
        message: "User not found",
      });
    }

    const isValid = await bcrypt.compare(password, isExist.password);
    if (!isValid) {
      return res.status(401).json({
        code: 401,
        message: "Incorrect password",
      });
    }

    return res.status(200).json({
      code: 200,
      message: "Login successfully",
      data: isExist
    });
  } catch (error) {
    return res.status(500).json({
      code: 500,
      message: "Internal server error",
    });
  }
};


