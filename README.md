# Angular Builder for Cordova

`abc` cli will give you a great convenient  build Angular app into Cordova Android, iOS and browser app.



# TODO

* 문서화: 클라이언트에서 exception 에러는 error handler 로 처리한다.
* ng serve 과정에서 bootstrap 에서 발생하는 에러는 socket 으로 에러를 화면에 표시해 준다.
* cordova.js 추가를 한다.







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




# ABC

As of 0.3.x, ABC only focus on debugging.
So, when you run ABC, it automaitically does livereloading.



## Options

* `-h, --help` shows help message.
* `-d, --debug` shows debug message.
* `--bash-href` changes BASE HREF="....".

To change base-href, add `--base-href ...`

$ abc run browser --base-href ./

Run on 'browser' platform with <BASE HREF='./'>


* `--address` changes local desktop server address.


* `--aot` compiles as in AoT.

To do aot, add `--aot` option.

````
$ abc run browser --aot --base-href ./
````





## Usecase

### Create a new project

````
$ ng new project-name
````

### Serving it to browser

````
$ ng serve
````


### Adding Cordova to Angular Project

````
$ abc run init
````


### Addung platforms

````
$ cordova platform add ios
$ cordova platform add android
````

### Run app into device with live reload.

````
$ abc run android --address=10.0.2.2:3000       // From the view of android device, you need to connect to 10.0.2.2:3000 to get to the local desktop server.
$ abc run android --address=10.0.2.2:3000 -d    // run with debug message.
$ abc run browser --address=localhost:3000      // From the view of browser, you need to connect to localhost:3000 to get to the local desktop server.
$ abc run ios --address=localhost:3000          // From the view of iOS emulator, you need to connect to localhost:3000 to get to the local desktop server.
````

* Before you do `abc run android ...`, you need to run Android emulator or connect a Android device.
* If you do `abc run ios ...`, iOS emulatory may run automatically on MacOS.

The above exmaple uses default 'base href' but other resources like css, js comes from 'http://10.0.2.2:3000' where the local desktop server is running.











# Developers

## Setting Test Environment


## Installation

````
npm install -g gulp-cli
npm install typescript gulp gulp-typescript gulp-sourcemaps
````

## Publish

````
git commit
npm version patch
npm publish
npm uninstall -g abcframework
$ sudo npm install -g abcframework --verbose
abc version
````


## Test

To test, before publish, you can do below.

````
$ sudo ln -s /Users/thruthesky/node/abcframework/bin/abc.js /usr/local/bin/abc
$ abc
````


## Cooperate



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

