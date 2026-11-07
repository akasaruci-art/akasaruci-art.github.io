'use strict';

const upath = require('upath');
const sh = require('shelljs');

module.exports = function renderAssets() {
    const sourcePath = upath.resolve(__dirname, '../src/assets');
    const destPath = upath.resolve(__dirname, '../docs/assets');

    console.log('### INFO: Copying assets');
    console.log('Source:', sourcePath);
    console.log('Destination:', destPath);

    if (!sh.test('-d', sourcePath)) {
        throw new Error(`Assets source directory does not exist: ${sourcePath}`);
    }

    if (!sh.test('-e', destPath)) {
        sh.mkdir('-p', destPath);
    }

    const result = sh.cp('-R', sourcePath + '/*', destPath);

    if (result.code !== 0) {
        console.error('Copy error:', result.stderr);
        throw new Error('Failed to copy assets');
    }

    console.log('### INFO: Assets copied successfully');
};
