var express = require("express");
var router = express.Router();
var fileUtils = require("../utils/fileUtils");
const formidable = require("formidable");
var path = require("path");
const parentDir = path.resolve(__dirname, "..");

require("dotenv").config();
const BUCKET_NAME = process.env.BUCKET_NAME;

router.post("/upload", function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req);

  form.on("fileBegin", function(name, file) {
    file.path = parentDir + "/uploads/" + file.name;
  });

  form.on("file", function(name, file) {
    fileUtils.uploadFile(BUCKET_NAME, file, fileUUID => {
      res.send({ uuid: fileUUID });
    });
  });
});

router.get("/download/:fileId", function(req, res) {
  var fileID = req.params.fileId || "f1422c52-2e11-48cd-8e82-0ccddeee4083";

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
