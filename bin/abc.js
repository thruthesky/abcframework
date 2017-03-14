#!/usr/bin/env node

'use strict';

var MOCK_NPM_INSTALL = false;


var os = require('os');
var EOL = os.EOL;
var chalk = require('chalk');

const fs = require('fs-extra')
var argv = require('yargs').argv;
var shell = require('shelljs');

const spawn = require('cross-spawn').spawn;

var open = require("open");




// Provide a title to the process in `abc`
process.title = 'abc';

if ( argv._[0] == 'new' ) {
    var dst = argv._[1];
    display_notice(`ABC: Installing ABC project.`);
    setTimeout( () => install_abc(), 500 );
}
else if ( argv._[0] == 'serve' ) {
    var dst = argv._[1];
    display_notice(`ABC: serving to browser ...`);
    setTimeout( () => ng_serve(), 200 );
}
else {
    display_error(`The specified command ${argv._[0]} is invalid`);
}



function install_abc() {
    let src = __dirname + '/../angular/v2.4';


    display_notice(`ABC: Copying sources to ${dst}`);

    try {
        fs.copySync(src, dst);
        display_notice("ABC: Copy success!")
    } catch (err) {
        console.error(err)
    }

    display_notice(`ABC: Change Directory: ${dst}`);
    // shell.cd( dst );
    process.chdir( dst );
    npm_install( code => {
        display_notice("ABC: npm install: done.");
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
        display_notice("ABC: Mocking npm install");
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

function ng_serve( ) {


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
        display_notice(`ABC: ng serve exited with code ${code}`);
        
    });


}


function run_browser() {

    display_notice("ABC: run browser...");
    setTimeout( () => {
        open("http://localhost:4200/");
    }, 1500 );
}

function display_message( msg ) {
    process.stdout.write( msg );
}

function display_error( msg ) {
    let str = chalk.red('ABC ERROR: ') + msg + EOL;
    process.stdout.write(str);
}

function display_notice( msg ) {
    process.stdout.write( EOL + chalk.blue( msg ) + EOL );
}




function display_message_for_first_run() {
    display_notice("ABC: you have just installed ABC framework successfully");
    display_notice("ABC: to run your app, please do the following");
    display_notice(`cd ${dst}; abc serve`);
}