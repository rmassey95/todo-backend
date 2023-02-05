const { body } = require("express-validator");

module.exports = validateTask = [
  body("title")
    .trim()
    .isAlphanumeric("en-US", { ignore: " -" })
    .withMessage("Title can only contain letters and numbers")
    .isLength({ min: 3 })
    .withMessage("Title must be atleast 3 characters long"),
  body("dueDate").isDate().withMessage("Invalid date"),
  body("priority")
    .isIn(["low", "med", "high", "none"])
    .withMessage("Invalid priorty must be either low, med, high, or none"),
  body("label")
    .optional({ checkFalsy: true })
    .trim()
    .isAlphanumeric("en-US", { ignore: " -" })
    .withMessage("Label must only include letters and numbers"),
  body("desc")
    .optional({ checkFalsy: true })
    .trim()
    .isAlphanumeric("en-US", { ignore: " -" })
    .withMessage("Task description must only include letters and numbers")
    .isLength({ min: 3 })
    .withMessage("Task description must be atleast 3 characters long"),
];
