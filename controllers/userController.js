const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("../models/user");

exports.handleSignUp = [
  body("username")
    .trim()
    .isAlphanumeric()
    .withMessage("Username can only include letters and numbers")
    .isLength({ min: 3 })
    .withMessage("Username must be atleast 3 characters long"),
  body("password")
    .isStrongPassword()
    .withMessage(
      "Not a strong enough password (required: 1 capital letter, 1 lowercase, 1 symbol, 1 number, and minimum of 8 characters)"
    ),
  body("confPassword")
    .exists()
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Passwords do not match"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true, errorMsgs: errors.array() });
    }

    bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
      if (err) {
        return next(err);
      }

      const user = new User({
        username: req.body.username,
        password: hashedPassword,
      }).save((err) => {
        if (err) {
          return next(err);
        }
        return res.status(200).json(user);
      });
    });
  },
];

exports.failedLogin = (req, res, next) => {
  res
    .status(400)
    .json({ loginSuccess: false, msg: "Username or password is invalid" });
};

exports.loginSuccess = (req, res, next) => {
  res.status(200).json({ loginSuccess: true, msg: "Login successful" });
};

exports.logout = (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).json({ logout: true, msg: "Successfully logged out" });
  });
};

exports.labels = (req, res, next) => {
  User.findById(req.user._id)
    .select({ taskLabels: 1, _id: 0 })
    .exec((err, taskLabels) => {
      if (err) {
        return next(err);
      }

      return res.status(200).json(taskLabels);
    });
};

exports.addLabel = (req, res, next) => {
  const taskLabels = req.user.taskLabels;
  taskLabels.push(req.params.label);

  User.findByIdAndUpdate(req.user._id, {
    taskLabels: taskLabels,
  }).exec((err, result) => {
    if (err) {
      return next(err);
    }
    return res.status(200).json(result);
  });
};

exports.updateLabels = (req, res, next) => {
  const taskLabels = req.user.taskLabels;

  const index = taskLabels.indexOf(req.params.label);
  taskLabels.splice(index, 1);

  User.findByIdAndUpdate(req.user._id, {
    taskLabels: taskLabels,
  }).exec((err, result) => {
    if (err) {
      return next(err);
    }
    return res.status(200).json(result);
  });
};

exports.updateProfileImg = (req, res, next) => {
  User.findByIdAndUpdate(req.user._id, {
    profileImg: req.body.profileImg,
  }).exec((err, result) => {
    if (err) {
      return next(err);
    }

    res.status(200).json(result);
  });
};
