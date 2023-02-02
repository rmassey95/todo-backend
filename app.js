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
app.use(express.json());

app.use("/taskaid", taskaidRouter);

app.listen(process.env.PORT, () => {
  console.log(`TaskAid app listening on ${process.env.PORT}`);
});
