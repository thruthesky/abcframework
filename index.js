var abc = {};
const Q = require('q');
const fs = require('fs-extra')
const chalk = require('chalk');
const spawn = require('cross-spawn').spawn;

var finalhandler = require('finalhandler')
var http = require('http')
var serveStatic = require('serve-static');
var socketIo = require('socket.io');
var io = null;

var argv = require('yargs').argv;


abc.start = function () {


    // abc.patchIndex();
    // return Q.fcall(true);

    // console.log( argv );


    abc.debug(`abc begins with `, argv);
    if (abc.isHelp()) return Q.fcall(abc.help);
    //else if (abc.isInit()) return Q.fcall(abc.init);
    else if (abc.isNew()) return abc.create();
    else if (abc.isRun()) return Q.fcall(abc.run);
    else return Q.fcall(abc.unknwonTask);

}

abc.version = function () {
    return '20170505';
}
abc.help = function () {
    abc.notice(red('abc') + " version: " + green(abc.version()));
    abc.notice(`abc init\t- To initialize cordova platform on Angular project.`);
    abc.notice(`cordova platform add android|browser|ios\t - To install Cordova platform.`);
    abc.notice(`abc run ios|android|browser [--base-href][--address=...][--port=....]\t - To run or watch Angular project on device.`);
}

abc.init = function () {
    abc.notice(`abc: goint to initialize Cordova on Angular project.`);
    if (!abc.hasForce() && !fs.existsSync('./node_modules')) {
        throw new Error("You are not in Angular project folder. If you want to initialize, do it with " + red("--force") + ".");
    }
    if (!abc.hasReset() && fs.existsSync('./config.xml')) {
        throw new Error(green("Cordova is already initialized. If you want to reset, do it with " + red("--reset") + "."));
    }


    let src = __dirname + '/copy/' + abc.version();
    let dst = '.';
    // fs.copy( src, dst )
    //     .then( () => {
    //         abc.notice("abc: init success!");
    //     } )
    //     .catch( e => {
    //         throw new Error( e );
    //     });


    try {
        abc.debug(`copying resources from ${src} to ${dst}.`);
        fs.copySync(src, dst)
        abc.notice("abc: init success!")
    }
    catch (err) {
        err.message += ' ' + red(`You must do "abc init --reset" to complete initializiation.`);
        throw new Error(err);
    };

}

abc.create = function() {

    var deferred = Q.defer();
    abc.notice("Creating new porject.");
    let src = __dirname + '/angular';
    var dst = argv._[1];

    try {
        fs.copySync( src, dst, { filter: abc.npmInstallFilter } );
    }
    catch ( err ) {
        deferred.reject( new Error( err ) ); // error.
    }
    abc.notice(`Installing npm modules on ${dst} for abc.`);

    process.chdir( dst );
    abc.npmInstall( code => {
        abc.notice(`abc has been created successfully. type "cd ${dst}; ng serve" to run the app.`);
        deferred.resolve();
    });

    return deferred.promise;
}

/**
 * @note when you work on 'abc framework', you do not need to copy these files.
 */
abc.npmInstallFilter = function ( src, dst ) {
    if ( src.indexOf("node_modules") != -1 ) return false;
    if ( src.indexOf("platforms") != -1 ) return false;
    if ( src.indexOf("plugins") != -1 ) return false;
    return true;
}

abc.npmInstall = function(callback) {

    if ( abc.isDry() ) {
        abc.notice("--dry: skip npm install");
        return callback( 1 );
    }
    let ls = spawn('npm', ['install', '--verbose']);

    ls.stdout.on('data', (data) => {
        abc.message(`${data}`);
    });

    ls.stderr.on('data', (data) => {
        abc.message(`${data}`);
    });

    ls.on('close', (code) => {
        callback( code );
    });
}

abc.run = function () {
    abc.ngBuild = null;
    var os = abc.getOs();

    if (!os) throw new Error("OS is not provided.");

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
    proc.on('close', (code) => { }); // watch 를 하므로, 프로세스가 종료되지 않는다.

}

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
    abc.notice("Listening on " + abc.getPort());

}


abc.patchIndex = function () {



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
    if (io) io.emit('reload', { data: 'reload now' });
}

abc.runCordova = function () {

    abc.patchIndex();

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

abc.isHelp = function () {
    if (argv.help || argv.h) return true;
};
// abc.isInit = function () {
//     return Array.from(argv._).findIndex(v => v == 'init') != -1;
// };
abc.isNew = function () {
    return argv._.includes( 'new' );
};
abc.isDry = function () {
    return argv.dry;
};
abc.isRun = function () { return argv._[0] == 'run'; }
abc.isDebug = function () { if (argv.debug || argv.d) return true; }

abc.hasReset = function () { return argv.reset; }
abc.hasForce = function () { return argv.force; }

abc.hasAot = function () { return argv['aot']; }


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
    return argv['address'] ? argv['address'] : 'localhost';
}
abc.getPort = function () {
    return argv['port'] ? argv['port'] : 3000;
}


abc.getOs = function () {
    return argv._[1];
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



/*


var abc_version = '0.2.0';
var os = require('os');
var EOL = os.EOL;
var chalk = require('chalk');
var S = require('string');
const fs = require('fs-extra')
var argv = require('yargs').argv;
var shell = require('shelljs');
const spawn = require('cross-spawn').spawn;



// console.info("argv: ", argv);



let command =  argv._[0];


if ( argv.v ) display_version();
else if ( argv.h ) display_help();
else if ( argv._[0] == 'init' ) initialize();
else if ( argv._[0] == 'run' ) run();
else {
    if ( argv._[0] ) display_error(`The specified command '${argv._[0]}' is invalid.`);
    else display_notice(`Invalid command`);
    display_notice(`Type "abc -h" for help message.`);
}





function initialize() {
    let src = __dirname + '/../copy/' + abc_version;
    let dst = '.';
    try {
        fs.copySync(src, dst);
        display_notice("Init success!")
    } catch (err) {
        console.error(err)
    };
}

function run() {
    ng_build_for_cordova(cordova_run);
}
function ng_build_for_cordova( callback ) {

    var base = getArgvBaseHref();
    var os = getArgvOs();




    display_notice( `ng build option` );
    

    let o = [
        'build',
        '-w',
        '--base-href', base,
        '--output-path', 'www',
        '--sourcemap'
    ];
    if ( getArgvAot() ) o.push( '--aot' );

    console.log( o );

    let proc = spawn( 'ng', o);

    
    if ( proc === void 0 ) return display_error(`Failed to created build process for ${os}. Check if ${os} is a supported platform and the platform is added to the project.`);
    proc.stdout.on('data', (data) => {
        display_message(`${data}`);
        var s = String(data);
        if ( s.indexOf( "inline.bundle.js" ) != -1 ) {
            callback();
        }
    } );
    proc.stderr.on('data', (data) => display_message(`${data}`) );

    proc.on('close', (code) => {
        if ( code ) {
            display_error( 'build failed.' );
        }
        else {
            callback();
        }
    });

}



function display_error( msg ) {
    let str = chalk.red('ABC ERROR: ') + msg;
    console.log(str);
}

function display_notice( msg ) {
    msg = msg;
    console.log( chalk.green( '' + msg ) );
}




function display_version() {
    display_notice(abc_version);
}




function display_help() {
    display_notice(`version ${abc_version}`);
    display_notice(`abc init`);
    display_notice(`cordova platform add android|browser|ios`);
    display_notice(`abc run ios|android|browser [--watch]`);
}


function display_message( msg ) {
    process.stdout.write(  msg );
}



// 
//  * This is cordova proxy for abc.
//  * 
//  * All the cordova commands should be handled by this function.
//  * 
//  
function cordova_run() {
    let proc = spawn( 'cordova', argv._ );
    let command = argv._[0];
    let os = argv._[1];
    

    proc.stdout.on('data', (data) => {
        display_message(`${data}`);
    });

    proc.stderr.on('data', (data) => {
        if ( data.indexOf("already added") ) {
            data = S(data).s.replace("Error:", "ABC:");
        }
        display_message(`${data}`);
    });

    proc.on('close', (code) => {
        if ( code ) { // true if error.
            if ( command == 'run' ) {
                let msg = `failed to run ${os}`;
            }
            else {
                let msg = "error";
                display_error( msg );
            }
        }
        else {
            let acted = 'unknown action';
            if ( command == 'run' ) acted = 'has run';
            display_notice(`${os} platform ${acted} successfully.`);
        }
    });

}


function getArgvOs() {
    return argv._[1];
}

function getArgvAot() {
    return argv['aot'];
}

function getArgvBaseHref() {

    if ( argv['base-href'] ) return argv['base-href'];
    var os = getArgvOs();
    if ( os == 'ios' ) {
        return 'www';
    }
    else if ( os == 'android' ) {
        return '/android_asset/www/';
    }
    else if ( os == 'browser' ) {
        return '/';
    }

}

*/