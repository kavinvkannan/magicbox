var express = require("express");
var router = express.Router();
var fileUtils = require("../utils/fileUtils");
const formidable = require("formidable");
var path = require("path");
const parentDir = path.resolve(__dirname, "..");

require("dotenv").config();
const BUCKET_NAME = process.env.BUCKET_NAME;

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

router.get("/list", function(req, res) {
  fileUtils.listFiles(BUCKET_NAME, function cb(resp) {
    res.send(resp);
  });
});

module.exports = router;
