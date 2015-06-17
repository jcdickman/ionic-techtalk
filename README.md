# ionic-techtalk

Example app for Ionic, Angular, BreezeJs, and Node/Express API

## Quick Start Node/Express API Project Setup

Install Node.js

Install grunt-cli globally

```sh
$ sudo npm -g install grunt-cli
```

The API lives in the aptly named "api" folder. Cd into the api folder

```sh
$ cd api
```

Within /api folder, run npm install (may need sudo depending on the permissions of the htdocs)
```sh
$ npm install
```

If you plan on using the ngdocs to generate app documentation, within /api folder, run grunt build to build the docs (don't need to do this everytime, only when there are code/comment changes)
```sh
$ grunt build
```

To start the API servcer, within /api folder run npm start

```sh
$ npm start
```

The local node services should now be running at localhost:3000

The API uses Sequelize ORM, which expects to have a mysql database running on localhost.

The default credentials are as follows.
You can of course modify them to match your specific mysql setup, within config/config.json.

```sh
{
  "development": {
    "username": "ionic",
    "password": "ionic",
    "database": "ionic",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "define": {
      "timestamps": false
    }
  },
  "production": {
    "username": "ionic",
    "password": "ionic",
    "database": "ionic",
    "host": "127.0.0.1",
    "dialect": "mysql",
    "define": {
      "timestamps": false
    }
  }
}
```

To seed the database with data, or to update the schema and reseed when your model changes, with the API running navigate to the dbSeed route:

```sh
http://localhost:3000/dbSeed
```

If you grunt built the documentation:

The node consumer API docs should now be accessible via {path to project root}/apidocs/index.html
The node jsdocs should now be accessible via {path to project root}/jsdocs/index.html

## Quick Start Ionic App

First, install ionic and cordova

```sh
$ npm install -g cordova ionic
```

Next, from project root cd in to /ionic folder, then use the ionic CLI to create a blank ionic project called "ionicTechTalk"

```sh
$ cd ionic
$ ionic start ionicTechTalk blank
```

The Angular/Ionic source code resides in the webapp folder.
From there, you should be able to install all dependencies, then build the web application into the ionicTechTalk/www folder.
The build.config.js & Gruntfile.js are setup to do this already based on the the app name being 'ionicTechTalk'.

```sh
$ cd ..
$ cd webapp
$ npm install
$ bower install
$ grunt build
```

These commands install all development dependencies, all application dependencies, then builds and deploys the app into the ionic/cordova www folder.
To setup the app to run on android and ios, do the following:

```sh
$ cd ..
$ cd ionic/ionicTechTalk
$ ionic add platform ios
$ ionic add platform android
```

To build the ionic app for a certain platform, run the following command for that platform

```sh
$ ionic build ios
```

To test the app in a web browser for debugging purposes

```sh
$ ionic serve
```

To emulate the app for a certain platform

```sh
$ ionic emulate ios
````

To test from natively from a mobile device:

For iOS, run the Xcode project in ionicTechtalk/plaforms/ios/ionicTechTalk.xcode

For android, simply type:
```sh
ionic run android
```