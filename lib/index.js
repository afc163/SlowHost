require('colors');
require('shelljs/global');
var fs = require('fs');
var path = require('path');

function main(path) {
    "use strict";
    try {
        fs.statSync(path);
    } catch(e) {
        console.error((path + ' is not existed.').red);
        return;
    }
    console.info('Ready to upload your file: ' + path.blue + ' ...');

    // Run external tool synchronously
    if (exec('git clone https://github.com/slowhost/slowhost').code !== 0) {
        echo('Error: Git clone failed');
        exit(1);
    }
}

exports.main = main;

if (!module.parent) {
    main();
}
