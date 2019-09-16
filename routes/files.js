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
      if (file.size === 0) {
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
    return res.status(400).send("No files found with that id.");
  }

  var fileID = req.params.fileId;

  fileUtils.downloadFile(BUCKET_NAME, fileID, function cb(resp) {
    res.sendFile(parentDir + "/downloads/" + resp);
  });
});

router.get("/list", function(req, res) {
  // fileUtils.listFilesFromDB(function cb(resp) {
  //   res.send(resp);
  // });
  fileUtils.listFiles(BUCKET_NAME, function cb(resp) {
    res.send(resp);
  });
});

module.exports = router;
