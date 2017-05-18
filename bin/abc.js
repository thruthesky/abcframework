#!/usr/bin/env node
'use strict';

// Provide a title to the process in `abc`
process.title = 'abc';
var abc = require("../index");
abc.start();
