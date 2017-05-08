# Angular Builder for Cordova

`abc` cli will give you a great convenient  build Angular app into Cordova Android, iOS and browser app.



# TODO


* global custom error handler 가 build time 에러와 컴포넌트 selector 이름을 잘못 적은 경우 에러를 표시하지 못한다.

* 에러 표시 함수를 abc cli 에 만 넣는다. ionic 이 그렇게 하고 있다.

    https://github.com/driftyco/ionic/blob/master/src/util/ionic-error-handler.ts

* -v, --version 라면, package.json 의 버전을 가져와서 보여 줄 것.

* 안드로이드에서 기본적으로 --address=10.0.2.2 가되도록 한다.

* 그 외의 ip, port 의 경우 변경 할 수 있도록 한다.

* 에러 처리를 사용자에게 직접 하게 할 수 없다.
    https://github.com/thruthesky/abcframework/issues/5

    * boostrap + font-awesome + enhancer
    * 아이오닉과 같은 컴포넌트 중 아주, .. 가장. ..., 매우.... 기본적인 컴포넌트를 몇개 제공. 예) 상단 메뉴, 하단 메뉴, 슬라이딩 서브 패널 메뉴.
    * 기본 코딩 제공. 예) Live Reload 에서 에러메세지 표시.
    * firebase 와 완벽하게 결합
    * PHP 기반 Backend 를 Firebase Database 버전으로 작성. ( PHP 기본 SQL Backend 는 대형 커뮤니티 서비스에 반드시 필요. )


* 문서화: 클라이언트에서 exception 에러는 error handler 로 처리한다.
* ng serve 과정에서 bootstrap 에서 발생하는 에러는 socket 으로 에러를 화면에 표시해 준다.
* cordova.js 추가를 한다.


# Changes


## 0.4


* `abc init` is gone.







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










# Developers

## Setting Test Environment


## Installation

````
git clone https://github.com/thruthesky/abcframework
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


## Working and Test with ABC

To test, before publish, you can do below.

````
$ sudo npm uninstall -g abcframework
$ sudo ln -s /Users/thruthesky/node/abcframework/bin/abc.js /usr/local/bin/abc
$ abc
````

## Working and Test with an app

Create an Angular test app and play with it.

````
$ ng new abc-test-app
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

