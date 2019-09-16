const express = require("express");
var filesRouter = require("./routes/files");
require("dotenv").config();
var app = express();
app.use("/file", filesRouter);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.post("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(process.env.PORT || 3000);
console.log(`app running on http://localhost:${process.env.PORT}`);
