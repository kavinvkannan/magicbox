const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const dbUtils = require("./dbUtils");
var path = require("path");
const parentDir = path.resolve(__dirname, "..");
const storage = new Storage({
  projectId: process.env.FIREBASE_PROJECTID,
  keyFilename: "./config.json"
});

async function downloadFile(bucketName, fileID, cb) {
  var fileName = dbUtils.getFileByUUID(fileID).name;

  try {
    const options = {
      destination: parentDir + "/downloads/" + fileName
    };
    await storage
      .bucket(bucketName)
      .file(fileName)
      .download(options, () => {
        return cb(fileName);
      });
  } catch (error) {
    console.log(error);
  }
}

async function uploadFile(bucketName, file, cb) {
  try {
    await storage.bucket(bucketName).upload(file.path, () => {
      removeTempFile(file.path);
      dbUtils.updateDB(file);
      cb(dbUtils.getFileUUIDById(file.id));
      console.log(`${file.name} uploaded to ${bucketName}.`);
    });
  } catch (error) {
    console.log(error);
  }
}

async function listFiles(bucketName, cb) {
  if (dbUtils.getDB().length > 0) {
    listFilesFromDB(cb);
  } else {
    const [files] = await storage.bucket(bucketName).getFiles();

    console.log("Files:");
    files.forEach(file => {
      dbUtils.updateDB(getFileMetadata(file));
      console.log(file.name, getFileMetadata(file));
    });

    listFilesFromDB(cb);
  }
}

function listFilesFromDB(cb) {
  return cb(dbUtils.getDB());
}

function getFileMetadata(fileObj) {
  var fileMetadata = {};
  fileMetadata.name = fileObj.name;
  fileMetadata.size = fileObj.metadata.size;
  fileMetadata.id = fileObj.metadata.id;
  fileMetadata.uuid = dbUtils.getFileUUIDById(fileObj.metadata.id);
  return fileMetadata;
}

function removeTempFile(path) {
  try {
    fs.unlinkSync(path);
    console.log("temp file removed");
  } catch (err) {
    console.error(err);
  }
}
module.exports = {
  downloadFile,
  listFiles,
  getFileMetadata,
  uploadFile,
  removeTempFile
};
