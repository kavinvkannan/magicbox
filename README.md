# magicbox
File uploader

Magicbox is a simple API microservice running on nodejs v10.13.0 and express.

# Project Dependencies
* VS code Editor - Recommended since you may use the Launch Program from the Debug mode to start the project.
* Docker
* npm 6.9.2 or above
* node version 10.13.0 or above.

# Node
This project is using v10.13.0 LTS supported version of node

# Development

To run this application on your local environment do the following: 

1. Clone the repository and navigate to project root

```
$ git clone git@github.com:Candore/magicbox.git && cd magicbox
```

2. Install depenencies

```
$ npm install
```

3. Copy `config.json` emailed to you to the project's root. 

4. Copy the environment variables emailed to you to `.env` file in the root directory.

5. Make sure the `db/db.json` has an empty array inside it.

6. Start the application using the VS code Debug mode, choose 'Launch Program'

or you may run 
```
npm start
```

The server is configured to run on port 3000. In the browser, type http://localhost:3000 and you will see an index.html file served.

This is just a helper page to upload and list files easily.

You may also test the api with following endpoints,

### Upload: Returns a uuid upon a successful upload.
```
POST /file/upload 
(attach a file with this request)
```

### Download: Returns the file which was downloaded to the /downloads directory
```
GET /file/download/<file_uuid>
```
### List: Returns a list of all files that exisits in the bucket.
```
GET /file/list 
```
*Note: If you run unit tests before getting file list, then you may also find the file information of the ones that was added from unit testing.

# Unit Testing

 This project uses `mocha` and `chai` for unit testing.
 In order to run the unit test you may,
 * Use the VS Code Debug option, and you will find the Mocha All configuration. Choose this option and press play.
   You should see the Passing/Failing tests in the debug console.
   
   Once the unit test is completed, in the Debug Console window, you should be seeing an output like this,

![mocha output](https://github.com/Candore/magicbox/blob/master/test/Unittest.png)

# Design / Architectural / Technical decisions and reasonings

 The project was designed with following considerations,

 1. Has to be simple yet consistent.
 2. Use minimal libraries that are required to conduct core business logic. (resource heavy libraries like lodash and underscore are excluded for this reason)
 3. Has to be unit testable. 
 4. Follows NodeJs bulletproof architecture best practices.
 5. Has essential error handlings.
 6. Code readability.

 The main app.js is a minimalistic starting point which serves a simple helper html file when requested on base URL. Instead of having all the endpoints written in this single file, it is managed as routes, eg: /file/upload, /file/download under files.js. This gives a clean view and understanding on what the main file does. This also promotes single reason change principle and facilitates unit testing better.

A local "db" is created which maintains each uploaded file's information. Ideally in a realtime environment, this could be leveraged to an actual db or to a cloud storage. One other reason to maintain a "db" locally was for faster fetching of file information. 

Firebase Storage was considered as the cloud storage for this project. The reason for this choice are as follows, 
 1. Firebase cli is a great tool that makes project hosting, storage, and admin easier.
 2. Firbase console is simple and elegant for administration.
 3. A default bucket storage is free.
 4. Good for smaller and single instance applications.

Calling the download endpoint directly downloads the file to the `/downlods` folder in the server and returns the response with the path of this file. This may not be the ideal solution for a server side memory management, but this was done for simpler experience upon running the app locally. In an realtime scenario, the server should return the download URL for the file, and let the client application decide where to store the download file.

Once you are given view permissions, you should be able to view all the uploaded files here: https://console.firebase.google.com/u/2/project/magicdocs-a8309/storage/magicdocs-a8309.appspot.com/files

# Deployed Server
The microservice app has been deployed to firebase functions and it can be accessed through this URL: https://us-central1-magicbox-4d2d7.cloudfunctions.net/app

 1. Upload endpoint: POST  https://us-central1-magicbox-4d2d7.cloudfunctions.net/app/upload
 2. Download endpoint: GET  https://us-central1-magicbox-4d2d7.cloudfunctions.net/app/download/<file_uuid>
 3. List endpoint: GET https://us-central1-magicbox-4d2d7.cloudfunctions.net/app/list

Note: 
The original filename is not retained on this deployed version of the application, making download of the file not possible at this moment. This is because the npm package "formidable-serverless" used in the deployed app replaces the original filename upon form parsing.
However this is achievable with a little more tinkering where both original filename and the replaced filename can be stored to the db and retried upon requesting a download from the bucket.
