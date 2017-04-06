#!/usr/bin/env node

'use strict';

var MOCK_NPM_INSTALL = false;
var abc_version = '0.1.2';
var os = require('os');
var EOL = os.EOL;
var chalk = require('chalk');
var S = require('string');
const fs = require('fs-extra')
var argv = require('yargs').argv;
var shell = require('shelljs');
const spawn = require('cross-spawn').spawn;
var open = require("open");


// Provide a title to the process in `abc`
process.title = 'abc';

var _count_run_browser = 0;



let command =  argv._[0];


if ( argv.v ) display_version();
else if ( argv.h ) display_help();
else if ( command == 'new' ) install_abc();
else if ( command == 'serve' ) abc_serve();
else if ( command == 'platform' ) cordova_proxy();
else if ( command == 'run' ) abc_run();
else {
    if ( argv._[0] ) display_error(`The specified command ${argv._[0]} is invalid.`);
    else display_notice(`Invalid command`);
    display_notice(`Type "abc -h" for help message.`);
}



function install_abc() {

    var dst = argv._[1];
    display_notice(`Installing ABC project.`);
    
    
    let src = __dirname + '/../angular/v2.4';


    display_notice(`Copying sources to ${dst}`);

    try {
        fs.copySync(src, dst);
        display_notice("Copy success!")
    } catch (err) {
        console.error(err)
    }

    display_notice(`Change Directory: ${dst}`);
    // shell.cd( dst );
    process.chdir( dst );
    npm_install( code => {
        display_notice("npm install: done.");
        setTimeout(() => {
            // ng_serve( code => {
            //     run_browser( code => {
            //     });
            // }, 400 );

            display_message_for_first_run();
        }, 300);
        
    } );
}


function npm_install(callback) {

    if ( MOCK_NPM_INSTALL ) {
        display_notice("Mocking npm install");
        return callback( 1 );
    }
    let ls = spawn('npm', ['install', '--verbose']);

    ls.stdout.on('data', (data) => {
        display_message(`${data}`);
    });

    ls.stderr.on('data', (data) => {
        display_message(`${data}`);
    });

    ls.on('close', (code) => {
        callback( code );
    });
}

function abc_serve( ) {


    display_notice(`serving to browser ...`);
    

    let ls = spawn('ng', ['serve', '-o']);

    ls.stdout.on('data', (data) => {
        data = data.toString(); // convert to string.
        if ( data.indexOf("webpack: Compiled successfully.") != -1 ) {
            //run_browser();
            data = data.replace('webpack:', `webpack (${_count_run_browser+1}) :`);
            // var time = (new Date).toLocaleTimeString();
            // console.log("time: ", time);
            // data = data.replace('.', ' at ' + time + '.');
            _count_run_browser ++;

            // console.log('data:', data);
        }
        display_message(`${data}`);

    });

    ls.stderr.on('data', (data) => {
        display_message(`${data}`);
    });

    ls.on('close', (code) => {
        display_notice(`ng serve exited with code ${code}`);
        
    });


}




// function run_browser() {
//     if ( _count_run_browser ) return;
//     display_notice("run browser...");
//     open("http://localhost:4200/");    
// }





/**
 * This is cordova proxy for abc.
 * 
 * All the cordova commands should be handled by this function.
 * 
 */
function cordova_proxy() {
    
    let proc = spawn( 'cordova', argv._ );
    let command = argv._[0];
    let action = argv._[1];
    let os = argv._[2];

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
        if ( code ) {
            if ( command == 'platform' ) {
                let msg = `${os} platform was not added.`;
                display_notice( msg );
            }
            else if ( command == 'run' ) {
                let msg = `failed to run ${os}`;
            }
            else {
                let msg = "error";
                display_error( msg );
            }
        }
        else {
            let acted = 'unknown action';
            if ( action == 'add' ) acted = 'added';
            else if ( action == 'rm' ) acted = 'remvoed';
            else if ( action == 'run' ) acted = 'has run';
            display_notice(`${os} platform ${acted} successfully.`);
        }
    });

}


function ng_build_for_cordova( os, callback ) {
    let proc;
    if ( os == 'ios' ) {
        proc = spawn( 'ng', ['build', '--base-href', 'www', '--output-path', 'www', '--sourcemap']);
    }
    else if ( os == 'android' ) {
        proc = spawn( 'ng', ['build', '--base-href', '/android_asset/www/', '--output-path', 'www', '--sourcemap']);
    }
    else if ( os == 'browser' ) {
        proc = spawn( 'ng', ['build', '--base-href', '/', '--output-path', 'www', '--sourcemap']);
    }

    if ( proc === void 0 ) return display_error(`Failed to created build process for ${os}. Check if ${os} is a supported platform and the platform is added to the project.`);
    proc.stdout.on('data', (data) => display_message(`${data}`) );
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

function abc_run() {

    let os = argv._[1];
    ng_build_for_cordova( os, () => {
        cordova_proxy();
    });
    
}


function display_message( msg ) {
    process.stdout.write(  msg );
}

function display_error( msg ) {
    let str = chalk.red('ABC ERROR: ') + msg;
    console.log(str);
}

function display_notice( msg ) {
    msg = msg;
    console.log( chalk.green( 'ABC: ' + msg ) );
}




function display_version() {
    display_notice(abc_version);
}




function display_message_for_first_run() {
    let dst = argv._[1];
    display_notice("you have just installed ABC framework successfully");
    display_notice("to run your app, please do the following");
    display_notice(`type: "cd ${dst}" and type: "abc serve"`);
}


function display_help() {
    display_notice(`${abc_version}`);
    display_notice(`serve`);
    display_notice(`platform add|rm ios|android|browser`);
    display_notice(`plugin add|rm ...`);
}


