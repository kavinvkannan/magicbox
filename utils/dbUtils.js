/**
 * Utility file to read and write to local db.
 * 
 * A local db is needed to save the file information along with generation of a unique_id for each file.
 * This way a remote call is avoided to fetch the list of files each time.
 * 
 * The local db is a simulation of how the records will be stored in a remote db, or in remote storage.
 * Having a local db/cache helps to serve the information faster than a remote one.
 */
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

function getFileByName(name) {

  var fl = {}
  db.forEach(file => {
    if (file.name === name) {
      fl = file
    }
  });

  return fl;
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
  getFileByName,
  getDB,
  updateDB
};
