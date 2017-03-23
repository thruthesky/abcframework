# Angular Builder for Cordova

`abc` cli will give you a great convenient  build Angular app into Cordova Android, iOS and browser app.



# TODO

* Code refactoring for abc cli - Use Typescript.
* Cordova browser platform support
* Bundling Process
    * Since app platform are completely different from web platform, there is no reason to follow/use Angular CLI.
    * But what's the problem with it anyway?
    * for cordova run/build
        * watch source file change
        * compile with Angular CLI
        * Inject cordova js
        * Inject live reload code
        * patch base href
        * Run cordova run/build OR live reload

* Add Bootstrap, Font Awesome, Enhancer
* Add angular-backend npm module.


# Updating existing ABC project.

* Install new ABC project.
* Just copy src folder of OLD project into new project.



# Installation

````
$ npm install -g abcframework
````
For Linux/Mac users may need root permisson.

# Update

````
$ npm update -g abcframework
````
For Linux/Mac users may need root permisson.



# How to use ABC Framework

## Create a new project

````
$ abc new folder-name
````

## Serving it to browser

````
$ abc serve
````

## Addung platforms

````
$ abc platform add ios
$ abc platform add android
````

## Run app into platforms

````
$ abc run ios
$ abc run android
````









# Developers

## Setting Test Environment


### Installation

````
npm install -g gulp-cli
npm install typescript gulp gulp-typescript gulp-sourcemaps



Feel free to fork and pull request.

````
$ cd ~/work
$ git clone https://github.com/thruthesky/abcframework
$ cd abcframework
$ npm install

$ cd ~/work
$ node ~/work/abcframework/bin/abc.js new abc-test
$ cd abc-test
$ node ~/node/abcframework/bin/abc.js serve
````

* you can edit abcframework/bin/abc.js and test
* after build, commit and push

