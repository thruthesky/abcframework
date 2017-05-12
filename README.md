![Abc framework](https://raw.githubusercontent.com/wiki/thruthesky/abcframework/front-title.jpg)

# ABC Framework

Abc framework is a tool that give you a greate convenience on building apps with Angular 2+. With `abc` you can build Angular app as easy as A! B! C!.

Youtube video tutorial)<br>
<a href="https://www.youtube.com/watch?v=nN3ifO_c05I" target="_blank"><img src="https://raw.githubusercontent.com/wiki/thruthesky/abcframework/video.jpg?dummy=1" alt="IMAGE ALT TEXT HERE" width="400"/></a>


# Open source

Abc framework is open sourced under [MIT License](https://github.com/thruthesky/abcframework/blob/master/License.md). Please help us by using, commenting, bug reporting.

* Do you need a help? - [ABC framework - Git Help Wanted](https://github.com/thruthesky/abcframework/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)
* Found a bug? or suggestions? -  [ABC framework - Git Issues](https://github.com/thruthesky/abcframework/issues)


## Help wanted

* We are in need of help for improving ABC framework. Please do not hesitating to join abc community. Whether you are a developer/designer/planner or even a runner, feel free to participate in anyway you can. Reporting typo erros or requesting for better documentating may be one way. You can send us a logo icon, or any opinion to make it better.


# Installation &amp; Update

## Prerequisites

Before you are going to install abc, you have to install Angular CLI and Cordova.

````
npm install -g @angular/cli
npm install -g cordova
````

Note: If you are on Linux/Mac, you may need to use `[sudo]` to install them globally.

## Installation


````
$ npm install -g abcframework --verbose
````
For Linux/Mac users may need use `sudo` to install globally.


# Update

Simply uninstall and install again.

````
npm uninstall -g abcframework
npm update -g abcframework
````


# ABC Options


* `-h, --help` shows help message.
* `-d, --debug` shows debug message.
* `--bash-href` Base url for the application being built.
````
$ abc run browser --base-href ./
````


* `--address` is the address where local desktop test webserver is running. Cordova app will connect to this address.
    * default address is
        * 'localhost' for browser and ios
        * '10.0.2.2' for andriod
    
* `--port` is the port of the local desktop server port.



* `--aot` Build using Ahead of Time compilation.

````
$ abc run browser --aot --base-href ./
````

* `--dry` does not install npm modules. It is useful when you do installation test.

````
$ abc new a2 --dry
````

* `--skip-npm-install` skips npm install

This is good for just getting source code without installing npm node modules since `npm install` takes internet bandwidth.
This is especially useful when you are using limited bandwidth internet.

````
$ abc new project-name --skip-npm-install
````


* `copy-node-modules` copies node_modules from `abcframework` work folder.
You may use it command to copy node_modules folder from `abcframework` work folder to your project that was installed with `--skip-npm-install` option.
Doing this, npm will not install its dependencies instead, it copies from abc work folder benefitting not consuming internet bandwidth.

This is only available when you are working on abcframework.


Example of usage)

````
$ abc new a4 --skip-npm-install
$ cd a4
$ abc copy-node-modules
$ ng serve
$ cordova platform add browser
$ cordova platform add android
$ cordova platform add ios
$ abc run browser
$ abc run android
$ abc run ios
````





## Usecase

### Create a new project

````
$ abc new project-name
````

### Serving it to browser

Simply use Angular CLI for whatever you want.

````
$ ng serve
````

### Serving it to device

By default, abc works with live reloading.

````
$ cordova platform add browser
$ cordova platform add android
$ cordova platform add ios

$ abc run browser
$ abc run android
$ abc run ios
````

You can add options.

````
$ abc run android --address=10.0.2.2:3000 -d       // From the view of android device, you need to connect to 10.0.2.2:3000 to get to the local desktop server. -d is for debug message.
$ abc run browser --address=localhost:3000      // From the view of browser, you need to connect to localhost:3000 to get to the local desktop server.
$ abc run ios --address=localhost:3000          // From the view of iOS emulator, you need to connect to localhost:3000 to get to the local desktop server.
````

* Before you do `abc run android ...`, you need to run Android emulator or connect a Android device.
* If you do `abc run ios ...`, iOS emulatory may run automatically on MacOS.


# Desktop Server Connection

* If you have any (web) server on your desktop and you want to access it from device(Android emualtor), you can just access through "http://10.0.2.2/..." or whatever IP. You may need to set web server configuration to accept the ip from the device.

on Angular code, simple connect like below.
````
http.get("http://10.0.2.2/...");
````




# Things to know


* one `abc run` may server many platforms.

    * abc run android
    * quit
    * abc run ios
    * then, when you edit source code, android will do live-reload as do ios.




# For core developers

To become core developer, please refer [for core developer](https://github.com/thruthesky/abcframework/wiki/core-developer).