#!/usr/bin/env node

'use strict';


var argv = require('yargs').argv;
if ( argv._[0] == 'new' ) {
    console.log("ng new")
    
}
else if ( argv._[0] == 'serve' ) {
    console.log('ng serve');
}

/*
console.log(argv.theme);
console.log(argv._);
*/


const spawn = require('child_process').spawn;
const ls = spawn('ng', [ 'new', argv._[1], '--verbose'] );

ls.stdout.on('data', (data) => {
  print( data );
});

ls.stderr.on('data', (data) => {
  print( data );
});

ls.on('close', (code) => {
  print( data );
});


function print( str ) {
    process.stdout.write( str );
}