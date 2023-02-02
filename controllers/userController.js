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
        profileImg: req.body.profileImg,
      }).save((err) => {
        if (err) {
          return next(err);
        }
        return res.json(user);
      });
    });
  },
];
