require("dotenv").config();
require("./passport-config");

const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");

const taskaidRouter = require("./routes/taskaidRouter");

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI);

const app = express();

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());
// Parse body data from request
app.use(express.json());

app.use((req, res, next) => {
  // allow CORS for React App
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  // allow header to be set in React App
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use("/taskaid", taskaidRouter);

app.listen(process.env.PORT, () => {
  console.log(`TaskAid app listening on ${process.env.PORT}`);
});
