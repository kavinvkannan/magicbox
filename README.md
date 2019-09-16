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

4. Make sure the `db/db.json` has an empty array inside it.

5. Start the application using the VS code Debug mode, choose 'Launch Program'

or you may use run 
```
npm start
```

The server is configured to run on port 3000. In the browser, type http://localhost:3000 and you will see an index.html file served.

This is just a helper page to upload and list files easily.

You may also test the api with following routes,

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

# Design / Architectural / Technical decisions and reasonings

 The project was designed with following considerations,

 1. Has to be simple yet consistent.
 2. Use minimal libraries that are required to conduct core business logic. (resource heavy libraries like lodash and underscore are excluded for this reason)
 3. Has to be unit testable. 
 4. Follows NodeJs bulletproof architecture best practices.
 5. Has essential error handlings.
 6. Code readability.

 The main app.js is a minimialistic starting point which serves a simple helper html file when requested on base URL. Instead of having all the routes written in this single file, it is managed as routes, eg: /file/upload, /file/download under files.js. This gives a clean view and understanding on what the main file does. This also promotes single reason change pricnciple and facilitates unit testing better.

A local "db" is created which maitains each file's information. Ideally in a realtime environment, this could be leveraged to an actual db or to a cloud storage. One other reason to maintain a "db" locally was for faster fetching of file information. 

Firebase Storage was considered as the cloud storage for this project. The reason for this choice are as follows, 
 1. Firebase cli is a great tool that makes project hosting, storage, and admin easier.
 2. Firbase console is simple and elegant for administration and vnavigation.
 3. A default bucket storage is free.
 4. Good for smaller applications.

Once you are given view permissions, you should be abloe to view all the uploaded files here: https://console.firebase.google.com/u/2/project/magicdocs-a8309/storage/magicdocs-a8309.appspot.com/files



