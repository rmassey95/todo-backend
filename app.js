require("dotenv").config();
require("./passport-config");

const express = require("express");
const helmet = require("helmet");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const rateLimit = require("express-rate-limit");
const cors = require("cors");

const taskaidRouter = require("./routes/taskaidRouter");

mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGODB_URI);

const app = express();

app.use(
  cors({
    origin: process.env.DOMAIN_URL,
    methods: "GET,PUT,POST,DELETE",
    allowedHeaders: "Content-Type",
    credentials: true,
  })
);

app.set("trust proxy", 1);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

app.use(limiter);
app.use(helmet());

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    cookie: {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: 12 * 60 * 60 * 1000,
    },
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI }),
    saveUninitialized: false,
    resave: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Parse body data from request
app.use(express.json());

app.use("/taskaid", taskaidRouter);

app.listen(process.env.PORT, () => {
  console.log(`TaskAid app listening on ${process.env.PORT}`);
});
