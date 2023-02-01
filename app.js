require("dotenv").config();

const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Homepage");
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on ${process.env.PORT}`);
});
