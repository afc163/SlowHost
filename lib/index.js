require('colors');
require('shelljs/global');
var fs = require('fs');
var CheckUrl = require('./checkUrl.js');
var TEMP = '.slowhost-temp-folder';
var FileName = require('./fileName.js');
var GITHUB_REPO = 'github.com/slowhost/upload';
var GITHUB_USERNAME = 'slowhost';
var GITHUB_PASSWORD = 'slowhost123';
var isWebResource = false;

function main(path, silent) {

    "use strict";

    // detect file type
    var urlReg = /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/;
    if (urlReg.test(path)) {
        isWebResource = true;
    } else {
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
    }
    
    // prepare for upload
    // filename & temp folder
    var fileName = FileName.parse(path);
    console.info('Ready to upload your file -> ' + fileName.cyan);
    makeTemp();

    // copy file to temp
    if (isWebResource) {
        cd(TEMP);
        exec('wget ' + path, {silent: silent});
        if (!test('-e', fileName)) {
            console.error(('Can\'t get ' + path + '!').red);
            cleanup();
            return;
        }
    } else {
        cp(path, TEMP + '/' + fileName);
        cd(TEMP);
    }
    
    // create git repo for uploading
    exec('git init', {silent: silent});
    exec('git remote add origin https://'
        + GITHUB_USERNAME + ':' + GITHUB_PASSWORD
        + '@' + GITHUB_REPO + '.git');
    var branchName = Date.now() + parseInt(Math.random(1)*100);
    exec('git checkout -b ' + branchName, {silent: silent});
    // for git error "You are on a branch yet to be born"
    exec('git symbolic-ref HEAD refs/heads/' + branchName, {silent: silent});
    exec('git add ' + fileName, {silent: silent});
    exec('git commit -am "upload ' + fileName + '"', {silent: silent});

    // upload by git push
    console.info('Uploading slowly...');    
    exec('git push origin ' + branchName, {silent: silent});

    // post upload
    // clean temp folder
    cleanup();
    
    // check the upload url
    // finish upload
    // print success or failure message
    var hostUrl = 'https://raw.' + GITHUB_REPO + '/' + branchName + '/' + fileName;
    CheckUrl.check(hostUrl, function(statusCode) {
        console.log('Upload ' + fileName.cyan + ' successed!');
        console.log('➠ ' + hostUrl.green);
    }, function(statusCode) {
        console.log(('Upload ' + fileName + ' failure for reasons, try -e.').red);        
    });
     
}

function makeTemp() {
    rm('-rf', TEMP);
    mkdir('-p', TEMP);
}

function cleanup() {
    cd('..');
    rm('-rf', TEMP);    
}

exports.main = main;

if (!module.parent) {
    main();
}
