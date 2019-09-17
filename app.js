/**
 * Main file that is invoked upon calling `npm start`
 * This can be also instantiated by calling `node app.js`
 * 
 * This fils starts an express Node.js server running on the PORT provided in the .env 
 * If a PORT is not provided, then it launches the server on the default port 3000.
 * 
 * The express app handles the root request to localhost:3000 and returns the response with a static index.html
 * The index.html is a simple tool that helps to upolad a file and to list all uploaded file's information.
 * 
 * All other requests to endpoints with `/file` path will be forwards to /routes/file.js file.
 */
const express = require("express");
var filesRouter = require("./routes/files");
require("dotenv").config();
var app = express();
app.use("/file", filesRouter);

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.listen(process.env.PORT || 3000);
console.log(`app running on http://localhost:${process.env.PORT}`);
module.exports = app;