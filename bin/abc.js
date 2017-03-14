#!/usr/bin/env node

'use strict';

var MOCK_NPM_INSTALL = true;


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


let command =  argv._[0];

if ( command == 'new' ) install_abc();
else if ( command == 'serve' ) abc_serve();
else if ( command == 'platform' ) cordova_proxy();
else if ( command == 'run' ) abc_run();
else {
    display_error(`The specified command ${argv._[0]} is invalid`);
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
    

    let ls = spawn('ng', ['serve']);

    ls.stdout.on('data', (data) => {
        display_message(`${data}`);
        if ( data.indexOf("successfully") != -1 ) {
            run_browser();
        }
    });

    ls.stderr.on('data', (data) => {
        display_message(`${data}`);

    });

    ls.on('close', (code) => {
        display_notice(`ng serve exited with code ${code}`);
        
    });


}


function run_browser() {

    display_notice("run browser...");
    open("http://localhost:4200/");    
}





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
            else {
                display_error( msg );
            }
        }
        else {
            let acted = 'unknown action';
            if ( action == 'add' ) acted = 'added';
            else if ( action == 'rm' ) acted = 'remvoed';
            display_notice(`${os} platform ${acted} successfully.`);
        }
    });

}


function pack( os, callback ) {
    let proc;
    if ( os == 'ios' ) {
        proc = spawn( 'ng', ['build', '--base-href', 'www', '--output-path', 'www', '--sourcemap']);
    }
    else if ( os == 'android' ) {
        proc = spawn( 'ng', ['build', '--base-href', '/android_asset/www/', '--output-path', 'www', '--sourcemap']);
    }

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

    pack( os, () => {
        cordova_proxy();
    });
    
}


function display_message( msg ) {
    process.stdout.write(  msg );
}

function display_error( msg ) {
    let str = chalk.red('ABC ERROR: ') + msg + EOL;
    console.log(str);
}

function display_notice( msg ) {
    msg = msg;
    console.log( chalk.green( 'ABC: ' + msg ) );
}




function display_message_for_first_run() {
    let dst = argv._[1];
    display_notice("you have just installed ABC framework successfully");
    display_notice("to run your app, please do the following");
    display_notice(`type: "cd ${dst}" and type: "abc serve"`);
}

