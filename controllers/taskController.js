const { validationResult } = require("express-validator");
const Task = require("../models/task");
const validateTask = require("../middleware/validateTask");

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

exports.deleteTask = (req, res, next) => {
  Task.findByIdAndRemove(req.params.taskId, (err, deletedTask) => {
    if (err) {
      return next(err);
    }

    return res.status(200).json(deletedTask);
  });
};

exports.getAllTasks = (req, res, next) => {
  Task.find({ user: req.user._id }).exec((err, tasks) => {
    if (err) {
      return next(err);
    }

    res.status(200).json(tasks);
  });
};

exports.getSingleTask = (req, res, next) => {
  Task.findById(req.params.taskId).exec((err, task) => {
    if (err) {
      return next(err);
    }

    return res.status(200).json(task);
  });
};

exports.getTasksByDate = (req, res, next) => {
  Task.find({ dueDate: req.params.date }).exec((err, tasks) => {
    if (err) {
      return next(err);
    }

    return res.status(200).json(tasks);
  });
};

exports.getTasksByLabel = (req, res, next) => {
  Task.find({ label: req.params.label }).exec((err, tasks) => {
    if (err) {
      return next(err);
    }

    return res.status(200).json(tasks);
  });
};

exports.getTasksByPrio = (req, res, next) => {
  Task.find({ priority: req.params.priority }).exec((err, tasks) => {
    if (err) {
      return next(err);
    }

    return res.status(200).json(tasks);
  });
};

exports.getTasksByProject = (req, res, next) => {
  Task.find({ proj: req.params.project }).exec((err, tasks) => {
    if (err) {
      return next(err);
    }

    return res.status(200).json(tasks);
  });
};
