#!/usr/bin/env node

'use strict';


var abc_version = '0.2.0';
var os = require('os');
var EOL = os.EOL;
var chalk = require('chalk');
var S = require('string');
const fs = require('fs-extra')
var argv = require('yargs').argv;
var shell = require('shelljs');
const spawn = require('cross-spawn').spawn;



console.info("argv: ", argv);


// Provide a title to the process in `abc`
process.title = 'abc';


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



/**
 * This is cordova proxy for abc.
 * 
 * All the cordova commands should be handled by this function.
 * 
 */
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