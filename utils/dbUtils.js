const db = require("../db/db.json");
const fs = require("fs");
const uuid = require("uuidv4").default;
var path = require("path");
const parentDir = path.resolve(__dirname, "..");

function getFileNameById(id) {
  var filename = "";

  db.forEach(file => {
    if (file.id === id) {
      filename = file.name;
    }
  });

  return filename;
}

function getDB() {
  return db;
}

function getFileUUIDById(id) {
  var fileUUID = "";
  db.forEach(file => {
    if (file.id === id) {
      fileUUID = file.uuid;
    }
  });
  return fileUUID;
}

function getFileByUUID(uuid) {
  var fl = {};
  db.forEach(file => {
    if (file.uuid === uuid) {
      fl = file;
    }
  });
  return fl;
}

function initializeDBWithFile(files) {
  var fileList = [];
  files.forEach(file => {
    fileList.push(getFileMetadata(file));
    console.log(file.name, getFileMetadata(file));
  });
  fs.writeFile(
    parentDir + "/db/" + "db.json",
    JSON.stringify(fileList),
    err => {
      if (err) throw err;
    }
  );
}

function updateDB(file) {
  if (db) {
    db.push(getFileMetadata(file));
    writeToDBFile(db);
  } else {
    initDB(() => {
      db.push(getFileMetadata(file));
      writeToDBFile(db);
    });
  }
}

function writeToDBFile(db) {
  fs.writeFile(parentDir + "/db/" + "db.json", JSON.stringify(db), err => {
    if (err) throw err;
  });
}

function initDB(cb) {
  fs.writeFile(parentDir + "/db/" + "db.json", "[]", err => {
    if (err) throw err;
  });
  return cb(1);
}

function getFileMetadata(file) {
  var fileMetada = {
    id: file.id,
    name: file.name,
    size: file.size,
    uuid: uuid()
  };

  return fileMetada;
}

module.exports = {
  getFileNameById,
  getFileUUIDById,
  getFileByUUID,
  getDB,
  updateDB,
  initializeDBWithFile
};
