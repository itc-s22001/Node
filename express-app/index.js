const express = require("express");

/**
 * Expressアプリケーション本体
 * @type {Express}
 */
const app = express();

app.get("/", (req, res) => {
  res.send("Welcome to Express!");
});

app.listen(3000, () => {
    console.log("Start server port:3000");
});