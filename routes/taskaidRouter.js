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
  (req, res, next) => {
    console.log("FIRST REQ:");
    console.log(req.sessionID);
    console.log(req.session);
    next();
  },
  passport.authenticate("local", { failureRedirect: "login/failed" }),
  userController.loginSuccess
);

router.get("/login/status", userAuthenticated, (req, res) => {
  res.status(200).json(req.user);
});

router.post("/signup", userController.handleSignUp);

router.post("/logout", userController.logout);

router.get("/user/labels", userAuthenticated, userController.labels);

router.put(
  "/user/remove-label/:label",
  userAuthenticated,
  userController.updateLabels
);

router.put(
  "/user/profile-img/update",
  userAuthenticated,
  userController.updateProfileImg
);

router.post(
  "/user/add-label/:label",
  userAuthenticated,
  userController.addLabel
);

// Task router
router.get("/tasks", userAuthenticated, taskController.getAllTasks);

router.get("/task/:taskId", userAuthenticated, taskController.getSingleTask);

// date format is "YYYY-MM-DD"
router.get(
  "/tasks/by-date/:date",
  userAuthenticated,
  taskController.getTasksByDate
);

router.get(
  "/tasks/by-label/:label",
  userAuthenticated,
  taskController.getTasksByLabel
);

router.get(
  "/tasks/by-priority/:priority",
  userAuthenticated,
  taskController.getTasksByPrio
);

router.post("/task/create", userAuthenticated, taskController.createTask);

router.put(
  "/task/update/:taskId",
  userAuthenticated,
  validateUser,
  taskController.updateTask
);

router.delete(
  "/task/delete/:taskId",
  userAuthenticated,
  validateUser,
  taskController.deleteTask
);

module.exports = router;
