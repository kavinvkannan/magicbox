/**
 * Receives the request that matches the path '/file' and
 * it forwards the request to /upload ;  /download/:fileId ; and /list endpoints.
 */
var express = require("express");
var router = express.Router();
var fileUtils = require("../utils/fileUtils");
const formidable = require("formidable");
var path = require("path");
const parentDir = path.resolve(__dirname, "..");

require("dotenv").config();
const BUCKET_NAME = process.env.BUCKET_NAME;

/**
 * POST function that receives the Buffer 
 * file binary from the incoming request.
 * 
 * 'formindable' is an npm package library that helps in
 * reading of incoming form data.
 * 
 * This library emits events on varios stages of file processing.
 * And those events are handled here to either return an error resonse or 
 * to move forward with file upload to the bucket witht the help of
 * fileUtil.
 */
router.post("/upload", function(req, res) {
  try {
    var form = new formidable.IncomingForm();
    form.parse(req);

    form.on("fileBegin", function(name, file) {
      if (file.name === "") {
        return res.status(400).send("Unable to Upload file");
      } else {
        file.path = parentDir + "/uploads/" + file.name;
      }
    });

    form.on("error", function(err) {
      return res.status(400).send("Unable to Upload file");
    });

    form.on("file", function(name, file) {
      fileUtils.uploadFile(BUCKET_NAME, file, fileUUID => {
        res.send({ uuid: fileUUID });
      });
    });
  } catch (error) {
    return res.status(400).send("Unable to Upload file");
    console.log(error);
  }
});

/**
 * GET endpoint that looks for a file's unique identifier.
 * 
 * It returs a 404 if a file/record is not found in the local db.
 * If a record matches, then it downloads the file from the remote bucket and 
 * forwards the file back to the response.
 */
router.get("/download/:fileId", function(req, res) {
  if (!req.params.fileId || fileUtils.isFileNotFound(req.params.fileId)) {
    return res.status(404).send("No files found with that id.");
  }

  var fileID = req.params.fileId;

  try {
    fileUtils.downloadFile(BUCKET_NAME, fileID, function cb(resp) {
      if (resp === "File does not exist") {
        return res.status(404).send("No files found with that id.");
      } else {
        res.sendFile(parentDir + "/downloads/" + resp);
      }
    });
  } catch (error) {
    return res.status(404).send("No files found with that id.");
  }
});

/**
 * GET endpoint that sends all the file information in db to the response.
 */
router.get("/list", function(req, res) {
  fileUtils.listFiles(BUCKET_NAME, function cb(resp) {
    res.send(resp);
  });
});

module.exports = router;
