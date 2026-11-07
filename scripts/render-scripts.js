'use strict';

const fs = require('fs');
const upath = require('upath');
const sh = require('shelljs');

module.exports = function renderScripts() {

    const scriptsPath = upath.resolve(__dirname, '../src/js');
    const destScriptsPath = upath.resolve(__dirname, '../docs/js');

    // Create destination directory
    fs.mkdirSync(destScriptsPath, { recursive: true });

    // Copy theme scripts
    sh.cp('-R', `${scriptsPath}/*`, destScriptsPath);

    // Copy Bootstrap bundle
    const bootstrapSource = upath.resolve(
        __dirname,
        '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
    );

    const bootstrapDestination = upath.resolve(
        destScriptsPath,
        'bootstrap.bundle.min.js'
    );

    fs.copyFileSync(bootstrapSource, bootstrapDestination);

    console.log('### INFO: Theme scripts copied to:', destScriptsPath);
    console.log('### INFO: Bootstrap copied:', fs.existsSync(bootstrapDestination));
};
