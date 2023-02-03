const express = require("express");
const passport = require("passport");
const userController = require("../controllers/userController");
const taskController = require("../controllers/taskController");
const validateUser = require("../middleware/validateUser");

const router = express.Router();

const userAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res
      .status(401)
      .json({ userAuthenticated: false, msg: "User not authenticated" });
  }
};

// User routes
router.get("/login/failed", userController.failedLogin);

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "login/failed" }),
  userController.loginSuccess
);

router.post("/signup", userController.handleSignUp);

router.post("/logout", userController.logout);

// Task router
router.get("/tasks", userAuthenticated, taskController.getAllTasks);

router.get("/task/:taskId", taskController.getSingleTask);

// date format is "YYYY-MM-DD"
router.get("/tasks/by-date/:date", taskController.getTasksByDate);

router.get("/tasks/by-label/:label", taskController.getTasksByLabel);

router.get("/tasks/by-priority/:priority", taskController.getTasksByPrio);

router.post("/task/create", taskController.createTask);

router.put("/task/update/:taskId", taskController.updateTask);

router.delete("/task/delete/:taskId", validateUser, taskController.deleteTask);

module.exports = router;
