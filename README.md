# ABC Framework

Abc framework is a tool for building apps with Angular 2+.
`abc` is short for 'Angular Builder for Cordova' and is combination of open sources.

With `abc` you can build Angular app as easy as A! B! C!.


# TODO

@refer [ABC framework git issue](https://github.com/thruthesky/abcframework/issues)





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
* `--address` is the address where local desktop test webserver is running. Cordova app will connect to this address.
    * default address is
        * 'localhost' for browser and ios
        * '10.0.2.2' for andriod
    
* `--port` is the port of the local desktop server port.


To change base-href, add `--base-href ...`

$ abc run browser --base-href ./

Run on 'browser' platform with <BASE HREF='./'>



* `--aot` compiles as in AoT.

To do aot, add `--aot` option.

````
$ abc run browser --aot --base-href ./
````

* `--dry` does not install npm modules

It is useful when you do installation test.

````
$ abc new a2 --dry
````




* `abc new project-name --skip-npm-install` skips npm install

This is good for just getting source code without installing npm node modules since `npm install` takes internet bandwidth.
This is especially useful when you are using limited bandwidth internet.


* `abc copy-node-modules` copies node_modules from `abcframework` work folder.
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

````
$ ng serve
````

### Serving it to device; Run app into device with live reload.

````
$ cordova platform add browser
$ cordova platform add android
$ cordova platform add ios

$ abc run android --address=10.0.2.2:3000       // From the view of android device, you need to connect to 10.0.2.2:3000 to get to the local desktop server.
$ abc run android --address=10.0.2.2:3000 -d    // run with debug message.
$ abc run browser --address=localhost:3000      // From the view of browser, you need to connect to localhost:3000 to get to the local desktop server.
$ abc run ios --address=localhost:3000          // From the view of iOS emulator, you need to connect to localhost:3000 to get to the local desktop server.
````

* Before you do `abc run android ...`, you need to run Android emulator or connect a Android device.
* If you do `abc run ios ...`, iOS emulatory may run automatically on MacOS.

The above exmaple uses default 'base href' but other resources like css, js comes from 'http://10.0.2.2:3000' where the local desktop server is running.



# Desktop Server Connection

* If you have nginx webserver on your desktop and you want to access it from Android emualtor, you can just access through "http://10.0.2.2/..."

For instance, you have a "Backend" running on your desktop, you need to set web server to accept IP as server name(domain) and let the webserver to point the root directory to backend.

and on your Angular code, simple set the url of "Backend"
````
backend.setBackendUrl("http://10.0.2.2/index.php");
````




# Things to know


* one platform may work as live reload for case like below.
    * abc run android
    * quit
    * abc run ios
    * then, when you edit source code, android will do live-reload as ios do.








# For ABC Developers

If you want to edit abc framework on your own, please don't hesitate.

## Setting Test Environment


### Installation

You can install abc like below

````
git clone https://github.com/thruthesky/abcframework
cd abcframework
npm install
````

Or, you can fork into your account and clone it from your account.



### Working and Test with ABC

To work and test with abc framework, simply remove globally installed abcframework and link abcframework/bin/abc.js to /usr/local/bin/abc or any place of your environmental path.

````
$ sudo npm uninstall -g abcframework
$ sudo ln -s /Users/thruthesky/node/abcframework/bin/abc.js /usr/local/bin/abc
$ abc new project-name
$ cd project-anme
$ ng serve
````

You can edit abc.js and index.js under "abcframework/bin/" folder and test it.



### Reporting issues and enhancement.

You can create an issue on [abcframework git issue](https://github.com/thruthesky/abcframework/issues) or feel free to fork and pull request.




## Publish

Only core developers can publish to npmjs.org

````
git commit
npm version patch
npm publish
npm uninstall -g abcframework
$ sudo npm install -g abcframework --verbose
abc version
````