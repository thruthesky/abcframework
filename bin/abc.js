#!/usr/bin/env node

'use strict';


const fs = require('fs-extra')
var argv = require('yargs').argv;
var shell = require('shelljs');

const spawn = require('child_process').spawn;



// Provide a title to the process in `abc`
process.title = 'abc';


if ( argv._[0] == 'new' ) {
    install_abc();
}




function install_abc() {
    let dst = argv._[1];
    let src = __dirname + '/../angular/v2.4';

    display_message(`Installing ABC project on ${dst}`);
    display_message(`Copying ${src} to ${dst}`);
    try {
        fs.copySync(src, dst);
        display_message("success!")
    } catch (err) {
        console.error(err)
    }

    display_message(`Change Directory: ${dst}`);
    // shell.cd( dst );
    process.chdir( dst );
    npm_install( code => {
        display_message("npm install: done");
        console.log('');
        display_message("Going to run ng serve");
        ng_serve( code => {

        });
    } );
}


function npm_install(callback) {

    let ls = spawn('npm', ['install', '--verbose']);

    ls.stdout.on('data', (data) => {
        display_message(`${data}`);
    });

    ls.stderr.on('data', (data) => {
        display_message(`${data}`);
    });

    ls.on('close', (code) => {
        display_message(`child process exited with code ${code}`);
        callback( code );
    });
}

function ng_serve( callback ) {

    let ls = spawn('ng', ['serve']);

    ls.stdout.on('data', (data) => {
        display_message(`${data}`);
    });

    ls.stderr.on('data', (data) => {
        display_message(`${data}`);
    });

    ls.on('close', (code) => {
        display_message(`child process exited with code ${code}`);
        callback( code );
    });
}

function display_message( msg ){
    process.stdout.write( msg );
}