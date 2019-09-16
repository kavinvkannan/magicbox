# magicbox
File uploader

Magicbox is a simple API microservice running on nodejs v10.13.0 and express.

# Project Dependencies
* VS code Editor - Recommended since you may use the Launch Program from the Debug mode to start the project.
* Docker
* npm 6.9.2 or above
* node version 10.13.0 or above.

# Node
This project is using that v10.13.0 LTS supported version of node

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

3. Copy config.json emailed to you to the project's root. 

4. Start the application

Using the VS code Debug mode, choose 'Launch Program'

or you may use 
```
npm start
```
# Unit Testing

 This project uses `mocha` and `chai` for unit testing.
 In order to run the unit test you may,
 * Use the VS Code Debug option, and you will find the mocha all configuration. Choose this option and press play.
   You should see the Passing/Failing tests in the debug console.
