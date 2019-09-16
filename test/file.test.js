"use strict";

const fs = require("fs");
const dbUtils = require("../utils/dbUtils");

var app = require("../app"),
  chai = require("chai"),
  request = require("supertest"),
  expect = chai.expect;
chai.use(require("chai-fs"));

describe("File API Integration Tests", function() {
  describe("#POST / file / upload", function() {
    it("should upload to bucket and return the uuid of the file", function(done) {
      request(app)
        .post("/file/upload")
        .attach(
          "file",
          fs.readFileSync(__dirname + "/MagicDoc.png"),
          "MagicDoc.png"
        )
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an("Object");
          expect(res.body.uuid).to.be.equal(
            dbUtils.getFileByName("MagicDoc.png").uuid
          );
          done();
        });
    });
  });

  describe("#GET / file / download", function() {
    it("should return an error message when a file is not found for a given id", function(done) {
      request(app)
        .get(`/file/download/101`)
        .end(function(err, res) {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.be.an("Object");
          expect(res.text).to.be.equal("No files found with that id.");
          done();
        });
    });
    it("should return a succesful response when a file is found matching the id", function(done) {
      const getUUID  =  dbUtils.getDB()[0].uuid;
      request(app)
        .get(`/file/download/${getUUID}`)
        .buffer()
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });
  });

  describe("#GET / file / list", function() {
    it("should list files in DB", function(done) {
      request(app)
        .get("/file/list")
        .end(function(err, res) {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.be.an("Array");
          done();
        });
    });
  });
});
