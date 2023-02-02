const { body, validationResult } = require("express-validator");
const Task = require("../models/task");
const validateTask = require("../public/scripts/validateTask");

exports.createTask = [
  validateTask,
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

exports.updateTask = [
  validateTask,
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ error: true, errorMsgs: errors.array() });
    }

    const updatedTask = new Task({
      title: req.body.title,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      label: req.body.label,
      proj: req.body.proj,
      desc: req.body.desc,
      completed: false,
      recurring: req.body.recurring,
      user: req.user._id,
      _id: req.params.taskId,
    });

    Task.findByIdAndUpdate(req.params.taskId, updatedTask, (err, result) => {
      if (err) {
        return next(err);
      }

      return res.status(200).json(updatedTask);
    });
  },
];
