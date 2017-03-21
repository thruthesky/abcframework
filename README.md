# Angular Builder for Cordova

`abc` cli will give you a great convenient  build Angular app into Cordova Android, iOS and browser app.



# TODO

* Code refactoring - Use Typescript.
* Cordova browser platform support


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

; you can edit abcframework/bin/abc.js and test
; after build, commit and push

