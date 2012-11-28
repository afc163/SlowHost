require('colors');
require('shelljs/global');
var fs = require('fs');
var path = require('path');

function main(path) {
    "use strict";

    if (!test('-e', path)) {
        console.error((path + ' is not existed.').red);
        return;
    }

    console.info('Ready to upload your file: ' + path.blue + ' ...');

    mkdir('-p', 'slowhost-temp');

    cp(path, 'slowhost-temp/' + path);

    cd('slowhost-temp');
    
    exec('git init', {silent: true});

    exec('git remote add origin https://slowhost:slowhost123@github.com/slowhost/slowhost.git', {silent: true});

    //git remote set-url origin https://name:password@github.org/repo.git

    var branchName = 'upload_' + Date.now();

    exec('git checkout -b ' + branchName, {silent: true});

    exec('git add ' + path, {silent: true});

    exec('git commit -am "upload ' + path + '"', {silent: true});

    exec('git push origin ' + branchName, {silent: true});

    cd('..');
    
    rm('-rf', 'slowhost-temp');
    
    console.log('Upload ' + path.blue + ' successed!');
    
    console.log(('https://raw.github.com/slowhost/slowhost/' + branchName + '/' + path).green);
    
}

exports.main = main;

if (!module.parent) {
    main();
}
