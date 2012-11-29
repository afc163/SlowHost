require('colors');
require('shelljs/global');
var fs = require('fs');
var TEMP = '.slowhost-temp-folder';
var FileName = require('./fileName.js');
var GITHUB_REPO = 'github.com/slowhost/upload';

function main(path) {

    "use strict";

    if (!test('-e', path)) {
        console.error((path + ' is not existed!').red);
        return;
    }

    if (test('-d', path)) {
        console.error((path + ' is a folder!').red);
        return;
    }

    if (!test('-f', path)) {
        console.error((path + ' is not a regular file!').red);
        return;
    }
    
    var fileName = FileName.parse(path);    

    console.info('Ready to upload your file -> ' + fileName.cyan);

    rm('-rf', TEMP);

    mkdir('-p', TEMP);

    cp(path, TEMP + '/' + fileName);

    cd(TEMP);
    
    exec('git init', {silent: true});

    exec('git remote add origin https://slowhost:slowhost123@' + GITHUB_REPO + '.git');

    var branchName = Date.now() + parseInt(Math.random(1)*100);

    exec('git checkout -b ' + branchName, {silent: true});

    exec('git add ' + fileName, {silent: true});

    exec('git commit -am "upload ' + fileName + '"', {silent: true});

    console.info('Uploading slowly...');    

    exec('git push origin ' + branchName, {silent: true});

    cd('..');
    
    rm('-rf', TEMP);
    
    console.log('Upload ' + fileName.cyan + ' successed!');
    
    console.log('- ' + ('https://raw.' + GITHUB_REPO + '/' + branchName + '/' + fileName).green);
    
}

exports.main = main;

if (!module.parent) {
    main();
}
