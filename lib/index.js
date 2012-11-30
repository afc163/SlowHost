require('colors');
require('shelljs/global');
var fs = require('fs');
var CheckUrl = require('./checkUrl.js');
var TEMP = '.slowhost-temp-folder';
var FileName = require('./fileName.js');
var GITHUB_REPO = 'github.com/slowhost/upload';

function main(path, silent) {

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
    
    exec('git init', {silent: silent});

    exec('git remote add origin https://slowhost:slowhost123@' + GITHUB_REPO + '.git');

    var branchName = Date.now() + parseInt(Math.random(1)*100);

    exec('git checkout -b ' + branchName, {silent: silent});

    // for git error "You are on a branch yet to be born"
    exec('git symbolic-ref HEAD refs/heads/' + branchName, {silent: silent});

    exec('git add ' + fileName, {silent: silent});

    exec('git commit -am "upload ' + fileName + '"', {silent: silent});

    console.info('Uploading slowly...');    

    exec('git push origin ' + branchName, {silent: silent});

    cd('..');
    
    rm('-rf', TEMP);
    
    var hostUrl = 'https://raw.' + GITHUB_REPO + '/' + branchName + '/' + fileName;

    CheckUrl.check(hostUrl, function() {
        console.log('Upload ' + fileName.cyan + ' successed!');
        console.log('> ' + hostUrl.green);
    }, function() {
        console.log(('Upload ' + fileName + ' failure for reasons, try -X.').red);        
    });
     
}

exports.main = main;

if (!module.parent) {
    main();
}
