'use strict';

const sh = require('shelljs');
const upath = require('upath');

const destPath = upath.resolve(upath.dirname(__filename), '../docs');

const pathsToClean = [
    'index.html',
    'assets',
    'css',
    'js'
];

for (const path of pathsToClean) {
    const target = upath.resolve(destPath, path);

    if (sh.test('-e', target)) {
        const result = sh.rm('-rf', target);

        if (result.code !== 0) {
            throw new Error(`Failed to remove: ${target}`);
        }
    }
}
