const Task = require("../models/task");

module.exports = validateUser = (req, res, next) => {
  Task.findById(req.params.taskId).exec((err, task) => {
    if (err) {
      return next(err);
    }

    if (task.user == req.user._id) {
      return next();
    }

    return res.status(401).json({ taskOwner: false });
  });
};
