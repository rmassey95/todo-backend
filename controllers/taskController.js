const { body, validationResult } = require("express-validator");
const Task = require("../models/task");

exports.createTask = [
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
  body("proj")
    .optional({ checkFalsy: true })
    .trim()
    .isAlphanumeric("en-US", { ignore: " -" })
    .withMessage("Project must only include letters and numbers"),
  body("desc")
    .optional({ checkFalsy: true })
    .trim()
    .isAlphanumeric("en-US", { ignore: " -" })
    .withMessage("Task description must only include letters and numbers")
    .isLength({ min: 3 })
    .withMessage("Task description must be atleast 3 characters long"),
  body("recurring")
    .isBoolean()
    .withMessage("Recurring must either be true or false"),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true, errorMsgs: errors.array() });
    }

    const task = new Task({
      title: req.body.title,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      label: req.body.label,
      proj: req.body.proj,
      desc: req.body.desc,
      completed: false,
      recurring: req.body.recurring,
      user: req.user._id,
    });

    task.save((err) => {
      if (err) {
        return next(err);
      }

      return res.status(200).json(task);
    });
  },
];
