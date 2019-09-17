/**
 * Utility file to Upload, download and to list files to the bucket.  
 */
const { Storage } = require("@google-cloud/storage");
const fs = require("fs");
const dbUtils = require("./dbUtils");
var path = require("path");
const parentDir = path.resolve(__dirname, "..");
const storage = new Storage({
  projectId: process.env.FIREBASE_PROJECTID,
  keyFilename: "./config.json"
});

/**
 * 
 * @param {string} bucketName 
 * @param {string} fileID 
 * @param {function} cb 
 * 
 * This function first checks if there is a file information available in the local db 
 * for the given file's unique identifier. If it doesn't exist, then it returns a message 
 * to the call back function.
 * 
 * If a file information is available in the local db, then it fetche's the file information
 * from the bucket and stores the downloaded file in the default /downloads folder and
 * call's the cal;l back with the downloaded file's path.
 * 
 * Ideally this function can be leveraged to return the download URL of the file.
 */
async function downloadFile(bucketName, fileID, cb) {
  try {
    var fileName = dbUtils.getFileByUUID(fileID).name;
    if (fileName === undefined) {
      cb("File does not exist");
    } else {
      const options = {
        destination: parentDir + "/downloads/" + fileName
      };
      await storage
        .bucket(bucketName)
        .file(fileName)
        .download(options, () => {
          return cb(fileName);
        });
    }
  } catch (error) {
    console.log(error);
  }
}

/**
 * 
 * @param {string} bucketName 
 * @param {object} file 
 * @param {function} cb 
 * 
 * Helper function tp upload a file to the given bucket name.
 * Firebase storage requires a file's full path in order to upload the file.
 * 
 * Once a file is uploaded completely, it removes the temp file in the path and  
 * it calls the call back with the uploaded file's information from local db.
 */
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

/**
 * 
 * @param {string} bucketName 
 * @param {function} cb 
 * 
 * This async function first checks if there is any file information
 * in the local DB. If it does exist, then it returns the contents of the db.
 * 
 * Else it fetches the uploaded file list from the bucket and stores the file's metadata information 
 * into the local DB and then returns the content of the DB.
 */
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

function isFileNotFound(fileID) {
  return dbUtils.getFileByUUID(fileID) === undefined;
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
  } catch (err) {
    console.error(err);
  }
}
module.exports = {
  downloadFile,
  listFiles,
  getFileMetadata,
  uploadFile,
  isFileNotFound,
  removeTempFile
};
