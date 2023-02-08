require("dotenv").config();
require("./passport-config");

const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const rateLimit = require("express-rate-limit");

const taskaidRouter = require("./routes/taskaidRouter");

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI);

const app = express();
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(
  session({
    name: "Session_name",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    cookie: {
      sameSite: false,
      secure: true,
      httpOnly: true,
      domain: "https://gorgeous-piroshki-03aec7.netlify.app",
      expires: 24 * 60 * 60 * 1000,
    },
  })
);

app.use(limiter);
app.use(helmet());

app.use((req, res, next) => {
  // allow CORS for React App
  res.setHeader("Access-Control-Allow-Origin", process.env.DOMAIN_URL);
  // allow crendentials to be sent
  res.setHeader("Access-Control-Allow-Credentials", true);
  // allow header to be set in React App
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  // allowed headers in requests
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
  next();
});

app.use(passport.initialize());
app.use(passport.session());
// Parse body data from request
app.use(express.json());

app.use("/taskaid", taskaidRouter);

app.listen(process.env.PORT, () => {
  console.log(`TaskAid app listening on ${process.env.PORT}`);
});
