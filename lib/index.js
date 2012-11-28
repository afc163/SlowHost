require('colors');
require('shelljs/global');
var fs = require('fs');
var path = require('path');
var TEMP = '.slowhost-temp-folder';

function main(path) {

    "use strict";

    if (!test('-e', path)) {
        console.error((path + ' is not existed.').red);
        return;
    }

    console.info('Ready to upload your file -> ' + path.cyan);

    mkdir('-p', TEMP);

    cp(path, TEMP + '/' + path);

    cd(TEMP);
    
    exec('git init', {silent: true});

    exec('git remote add origin https://slowhost:slowhost123@github.com/slowhost/slowhost.git', {silent: true});

    var branchName = 'upload_' + Date.now();

    exec('git checkout -b ' + branchName, {silent: true});

    exec('git add ' + path, {silent: true});

    exec('git commit -am "upload ' + path + '"', {silent: true});

    console.info('Uploading slowly...');    

    exec('git push origin ' + branchName, {silent: true});

    cd('..');
    
    rm('-rf', TEMP);
    
    console.log('Upload ' + path.cyan + ' successed!');
    
    console.log('- ' + ('https://raw.github.com/slowhost/slowhost/' + branchName + '/' + path).green);
    
}

exports.main = main;

if (!module.parent) {
    main();
}
