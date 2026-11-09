'use strict';

const sh = require('shelljs');
const upath = require('upath');

const destPath = upath.resolve(upath.dirname(__filename), '../docs');

if (sh.test('-d', destPath)) {
    const pathsToClean = sh.ls('-A', destPath)
        .filter(path => path !== 'CNAME');

    for (const path of pathsToClean) {
        const target = upath.join(destPath, path);
        const result = sh.rm('-rf', target);

        if (result.code !== 0) {
            throw new Error(`Failed to remove: ${target}`);
        }
    }
}