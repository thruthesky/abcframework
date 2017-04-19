# Angular Builder for Cordova

`abc` cli will give you a great convenient  build Angular app into Cordova Android, iOS and browser app.



# TODO

* ABC runs on Angular and Cordova. What ABC does;
    1. Does NOT proxy any commands of Angular CLI or Cordova CLI.
    2. Adds tools to make Angular App easy.

    3. Add ABC Framework on an Angular project by "abc install"
        This will created cordova project folders and config.xml to make cordova works with Angular.

        Additional resources like bootstrap v4, font awesome, 'enhancer', 'angular-backend', etc will be installed from github.com.


    4. Run app
        $ cordova platform add "..."    // this will create cordova structure.
        $ npm build ios
        $ cordova run ios
        $ abc run ios --live-reload

    5. $ abc build android --icon --splash // will do jarsining, zipalign


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





# Use

## base href

To change base-href, add `--base-href ...`

$ abc run browser --base-href ./

Run on 'browser' platform with <BASE HREF='./'>



## aot

To do aot, add `--aot` option.

$ abc run browser --aot --base-href ./


## Production mode

To build a production app, add `--prod`

$ abc run browser --base-href ./ --aot --prod





# Developers

## Setting Test Environment


### Installation

````
npm install -g gulp-cli
npm install typescript gulp gulp-typescript gulp-sourcemaps
````

## Publish

````
git push
npm version path
npm publish
````


### Cooperate



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

