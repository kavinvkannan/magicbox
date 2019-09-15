const express = require("express");
const formidable = require("formidable");
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
require("dotenv").config();
const storage = new Storage({
  projectId: process.env.FIREBASE_PROJECTID,
  keyFilename: "./config.json"
});

const BUCKET_NAME = process.env.BUCKET_NAME;

var app = express();

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/download", function(req, res) {
  listFiles(BUCKET_NAME, function cb(resp) {
    res.send(resp);
  });
});

app.post("/", function(req, res) {
  var form = new formidable.IncomingForm();
  form.parse(req);

  form.on("fileBegin", function(name, file) {
    file.path = __dirname + "/uploads/" + file.name;
  });

  form.on("file", function(name, file) {
    uploadFile(BUCKET_NAME, file);
  });

  res.sendFile(__dirname + "/index.html");
});

function removeTempFile(path) {
  try {
    fs.unlinkSync(path);
    console.log("temp file removed");
  } catch (err) {
    console.error(err);
  }
}

async function listFiles(bucketName, cb) {
  const [files] = await storage.bucket(bucketName).getFiles();
  var fileList = [];

  console.log("Files:");
  files.forEach(file => {
    fileList.push(getImageMetadata(file));
    console.log(file.name, getImageMetadata(file));
  });

  return cb(fileList);
}

function getImageMetadata(fileObj) {
  var fileMetadata = {};
  fileMetadata.name = fileObj.name;
  fileMetadata.size = fileObj.metadata.size;
  fileMetadata.id = fileObj.metadata.id;
  return fileMetadata;
}

async function uploadFile(bucketName, file) {
  try {
    await storage.bucket(bucketName).upload(file.path, () => {
      removeTempFile(file.path);
      console.log(`${file.name} uploaded to ${bucketName}.`);
    });
    console.log("Uploaded " + file.name);
  } catch (error) {
    console.log(error);
  }
}

app.listen(process.env.PORT || 3000);
console.log(`app running on http://localhost:${process.env.PORT}`);
