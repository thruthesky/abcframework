var abc = {};
const Q = require('q');
const fs = require('fs-extra')
const chalk = require('chalk');
const spawn = require('cross-spawn').spawn;
const package = require('./package');

var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static');
var socketIo = require('socket.io');
var io = null;

var argv = require('yargs').argv;

var download = require('download-git-repo');



abc.start = function () {


    // abc.patchIndex();
    // return Q.fcall(true);

    // console.log( argv );



    abc.debug(`abc begins with `, argv);
    if (abc.hasHelp()) return abc.help();
    else if ( abc.hasVersion() ) return (() => console.log(package.version))();
    else if ( abc.isInit() ) return abc.init();
    else if ( abc.isReset() ) return abc.init( false );
    else if (abc.isNew()) return abc.create();
    else if (abc.isRun()) return abc.run();
    else return abc.unknwonTask();

}


abc.help = function () {
    abc.notice(red('abc') + " version: " + green( package.version ));
    abc.notice(`abc init\t- To initialize cordova platform on Angular project.`);
    abc.notice(`cordova platform add android|browser|ios\t - To install Cordova platform.`);
    abc.notice(`abc run ios|android|browser [--base-href][--address=...][--port=....]\t - To run or watch Angular project on device.`);
}



abc.init = function ( check = true ) {
    
    setTimeout(()=>{
        // abc.notice(`abc: going to initialize Cordova on Angular project.`);
        if (!abc.hasForce() && !fs.existsSync('./node_modules')) {
            abc.notice(`You are not in Angular project. Use --force if you want to continue.`);
            return;
        }
        if ( check && fs.existsSync('config.xml') ) {
            abc.notice("Look! config.xml exists. It looks like abc has already initialized. Try to run `abc run ...`");
            return;
        }

        let src = __dirname + '/cordova/config.xml';
        let dst = 'config.xml';


        try {
            abc.debug(`copying resources from ${src} to ${dst}.`);
            fs.copySync(src, dst)
            fs.ensureDirSync('www')
            abc.notice("abc: success!")
        }
        catch (err) {
            err.message += ' ' + red(`failed to initialize.`);
            abc.error( err );
        };
    }, 100);


}


/**
 * @note when you work on 'abc framework', you do not need to copy these files.
 */
abc.npmInstallFilter = function (src, dst) {

    var c = src.substr(src.indexOf('angular'));
    if (c.indexOf("node_modules") >= 0) return false;
    if (c.indexOf("platforms") >= 0) return false;
    if (c.indexOf("plugins") >= 0) return false;
    if (c.indexOf("www") >= 0) return false;
    return true;
}

abc.create = function () {


    abc.notice("Creating an ABC porject.");
    // let src = __dirname + '/angular';
    var dst = argv._[1];
    if (!dst) return abc.error("Input project name.");
    

    var template = abc.getTemplate();

    abc.notice(`Downloading template: https://github.com/${template}.`);

    download(template, dst, e => {
        if (e) return abc.error( e );
        abc.notice("Template downloaded.");
        // npm install
        abc.notice(`Installing npm modules on ${dst} for abc tooling.`);
        process.chdir(dst);
        abc.npmInstall(code => {
            return abc.notice(`abc has been created successfully. type "cd ${dst}; ng serve" to run the app.`);
        });

    });

}



abc.npmInstall = function (callback) {

    if (abc.skipNpmInstall()) {
        abc.notice("--skip-npm-install: skip npm install");
        return callback(1);
    }
    let ls = spawn('npm', ['install', '--verbose']);

    ls.stdout.on('data', (data) => {
        abc.message(`${data}`);
    });

    ls.stderr.on('data', (data) => {
        abc.message(`${data}`);
    });

    ls.on('close', (code) => {
        callback(code);
    });
}



// abc.copyNodeModules = function () {


//     let src = __dirname + '/angular/node_modules';
//     var dst = './node_modules';
//     abc.notice(`Copying node_modules folder from ${src} to ${dst}`);

//     try {
//         fs.copySync(src, dst);
//     }
//     catch (err) {
//         return abc.error( err );
//     }
//     abc.notice(`done.`);
// }




abc.run = function () {
    abc.ngBuild = null;
    var os = abc.getOs();

    if (!os) return abc.error("OS is not provided.");

    abc.debug(`ng build option`);

    let o = [
        'build',
        '--watch',
        // '--output-hashing=all',             // output-hashing 을 하면 안된다. 이렇게 하면, 다시 APK 를 푸시해야 한다.
        //'--verbose',
        '--base-href', abc.getBaseHref(),
        '--output-path', 'www',
        '--sourcemap'
    ];
    if (abc.hasAot()) o.push('--aot');

    abc.debug(o);


    let proc = spawn('ng', o);


    if (proc === void 0) return abc.error(`Failed to created build process for ${os}. Check if ${os} is a supported platform and the platform is added to the project.`);
    proc.stdout.on('data', abc.watchOut);
    proc.stderr.on('data', abc.watchOut);
    // proc.on('close', (code) => { }); // this will not be called since it is going to watch.

}

/**
 * When 
 */
abc.watchOut = function (data) {
    var s = data.toString();
    abc.stdout(s);

    // if ( s.indexOf( "inline.bundle.js" ) != -1 ) {
    //     // abc.runCordova();
    //     // abc.ngBuildFinished();
    // }
    // else 

    if (s.indexOf("ERROR in") != -1) {
        abc.ngBuild = 'error';
        //


        s = chalk.reset(s);
        //var msg = /(ERROR in .*)/.exec(s);

        arr = String(s).split('ERROR in ');


        abc.ngBuildError = 'ERROR in ' + arr[1];
        abc.ngBuildFinished();

    }

    else if (s.indexOf("chunk") != -1 && /inline(.*)bundle.js/.test(s)) {
        abc.ngBuildFinished();
    }
}

abc.ngBuildFinished = function () {
    var b = abc.ngBuild;
    abc.notice("angular build finished " + (b ? "with error" : "without error"));
    if (b) abc.error(abc.ngBuildError);

    if (abc.ngBuild == 'error') {
        if (io) io.emit('error', abc.ngBuildError);
    }
    else {
        abc.runCordova();
    }
    abc.ngBuild = null;
    abc.ngBuildError = null;
}

abc.runServer = function () {


    // Serve up public/ftp folder
    var serve = serveStatic('www', { 'index': ['index.html'] })

    // Create server
    var server = http.createServer(function onRequest(req, res) {
        serve(req, res, finalhandler(req, res))
    });

    io = socketIo(server);
    io.on('connection', function (client) {
        client.on('event', function (data) { });
        client.on('disconnect', function () { });
    });

    // Listen
    server.listen(abc.getPort())
    abc.notice("Listening on " + abc.getPort() + ", Server Address: http://" + abc.getAddress() + ":" + abc.getPort());

}


abc.patchIndex = function () {


    if ( abc.indexPatched ) {
        console.log("index patched. ... return");
        return;
    }
    
    abc.indexPatched = true;

    var address = abc.getAddress();
    var port = abc.getPort();

    address += ':' + port;

    var patch = `
<script src="cordova.js"></script>
<script src="http://${address}/socket.io/socket.io.js"></script>
<script>
  console.log("Connect to desktop server through socket.io: ${address}");
  var socket = io('http://${address}');
  socket.on('reload', function (data) {
    console.log(data);
    // window.location.reload(true);
    location.href="index.html?dummy=" + ( new Date ).getTime(); // dummy 값을 주어서, 새로 내용을 불러온다. 주의: hard-cache-clear 가 아니기 때문에 새로운 .js .css 가 로드되지 않을 수 있다.
  });
  socket.on('error', function (data) {
    console.error(data);
    displayError( data );
  });

    function displayError( data ) {
        var handler = document.querySelector('#custom-error-handler');
        if ( !handler ) {
            var div = document.createElement('div');
            div.id = "custom-error-handler";
            document.body.insertBefore(div, document.body.firstChild);
            handler = document.querySelector('#custom-error-handler');
        }
        var div = document.createElement('div');
        div.innerText = data;

        var h2 = document.createElement('h2');
        h2.innerText = 'build error'

        handler.appendChild(h2);
        handler.appendChild(div);
    }

</script>
    `;
    var index = fs.readFileSync('www/index.html');
    var content = String(index);

    content = content.replace(/inline(.*)bundle.js/, "http://" + address + '/inline$1bundle.js');
    content = content.replace(/polyfills(.*)bundle.js/, "http://" + address + "/polyfills$1bundle.js");
    content = content.replace(/styles(.*)bundle.js/, "http://" + address + "/styles$1bundle.js");
    content = content.replace(/vendor(.*)bundle.js/, "http://" + address + "/vendor$1bundle.js");
    content = content.replace(/main(.*)bundle.js/, "http://" + address + "/main$1bundle.js");
    abc.debug(content);

    content = content.replace("</body>", patch + "\n</body>");
    fs.writeFileSync('www/index.html', content);
}

abc.runCordova = function () {

    abc.patchIndex(); //


    if (io) io.emit('reload', { data: 'reload now' }); // reload the app.

    if (abc.bRunServer !== void 0) return;
    else abc.bRunServer = true;

    abc.runServer();

    let proc = spawn('cordova', argv._);
    proc.stdout.on('data', abc.watchOut);
    proc.stderr.on('data', abc.watchOut);

    let os = abc.getOs();


    proc.on('close', (code) => {
        if (code) { // true if error.
            abc.error(`failed to run ${os}`);
        }
        else {
            abc.notice(`${os} platform run successfully.`);
        }
    });

}





abc.stdout = function (msg) {
    process.stdout.write(msg);
}

abc.unknwonTask = function () {
    abc.error("Unknown task name or wrong arguement was given.");
    abc.notice(`Type "abc -h" to know more about "abc" options`);
}

abc.notice = (msg) => {
    console.log(blue(msg));
}

abc.message = function (msg, ...rest) {
    if (rest.length == 0) rest = '';
    abc.stdout(msg, rest);
}

abc.error = function (msg) {
    abc.stdout(chalk.red('abc error: '));
    console.log(msg);
}


abc.debug = function (msg) {
    if (abc.isDebug()) {
        console.log(msg);
    }
}

/// argument

abc.hasHelp = function () {
    if (argv.help || argv.h) return true;
};
abc.isInit = function () {
    return argv._[0] == 'init';
};
abc.isReset = function () {
    return argv._[0] == 'reset';
};
abc.isNew = function () {
    return argv._[0] == 'new';
};
// abc.isCopyNodeModules = function () {
//     return argv._[0] == 'copy-node-modules'
// };
abc.skipNpmInstall = function () {
    return argv['skip-npm-install'];
};
abc.isRun = function () { return argv._[0] == 'run'; }
abc.isDebug = function () { if (argv.debug || argv.d) return true; }

abc.hasForce = function () { return argv.force; }

abc.hasAot = function () { return argv['aot']; }
abc.hasVersion = function () { return argv['v'] || argv['version']; }


abc.getBaseHref = function () {
    if (argv['base-href']) return argv['base-href'];
    var os = abc.getOs();
    if (os == 'ios') {
        return 'www';
    }
    else if (os == 'android') {
        return '/android_asset/www/';
    }
    else if (os == 'browser') {
        return '/';
    }
}

abc.getAddress = function () {
    if (argv['address']) return argv['address'];
    if (argv._[1] == 'android') return '10.0.2.2';
    else return 'localhost';
}
abc.getPort = function () {
    return argv['port'] ? argv['port'] : 3000;
}


abc.getOs = function () {
    return argv._[1];
}

abc.getTemplate = function() {
    if (argv['template']) return argv['template'];
    else return 'thruthesky/default';
}


module.exports = abc;



/// helper functions


/// color
var red = function (msg) {
    return chalk.red(msg);
}
var blue = function (msg) {
    return chalk.blue(msg);
}
var green = function (msg) {
    return chalk.green(msg);
}


