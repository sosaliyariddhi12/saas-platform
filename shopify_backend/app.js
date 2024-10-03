const mongoose = require("mongoose");
const express = require("express");
const session = require("express-session");
const cookieParser = require('cookie-parser')
const cors = require("cors");
const userRouter = require("./router/userRouter");
const { getOrder } = require("./controller/orderController");
require("dotenv").config();
const secret = process.env.SESSION_SECRET || "your-secret-key"
const app = express();
app.use(cookieParser())
app.use(cors());
app.use(express.json());


const port = process.env.PORT || 8000;

app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie:{
      maxAge:60000 * 60,
    },
  })
);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.error("Connection error:", err));

app.use("/user", userRouter);
app.use('/api', getOrder)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
