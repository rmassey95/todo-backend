const express = require("express");
const passport = require("passport");
const userController = require("../controllers/userController");
const taskController = require("../controllers/userController");

const router = express.Router();

router.get("/", (req, res) => {
  res.send("homepage");
});

// User routes
router.get("/login/failed", userController.failedLogin);

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "login/failed" }),
  userController.login
);

router.post("/signup", userController.handleSignUp);

router.post("/logout", userController.logout);

// Task router
router.get("/tasks", (req, res) => {
  res.send("task homepage");
});

router.get("/task/:taskId", (req, res) => {
  res.send("get single task");
});

router.get("/tasks/by-date/:date", (req, res) => {
  res.send("tasks sort by date");
});

router.get("/tasks/by-label/:label", (req, res) => {
  res.send("tasks sort by label");
});

router.get("/tasks/by-priority/:priority", (req, res) => {
  res.send("tasks sort by priority");
});

router.get("/tasks/by-project/:project", (req, res) => {
  res.send("tasks sort by project");
});

router.post("/task/create", (req, res) => {
  res.send("post task");
});

router.put("/task/update/:taskId", (req, res) => {
  res.send("update task");
});

router.delete("/task/delete/:taskId", (req, res) => {
  res.send("delete task");
});

module.exports = router;
