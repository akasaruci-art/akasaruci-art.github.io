'use strict';

const sh = require('shelljs');
const upath = require('upath');

const destPath = upath.resolve(upath.dirname(__filename), '../docs');

if (sh.test('-e', destPath)) {
    const result = sh.rm('-rf', upath.join(destPath, '*'));

    if (result.code !== 0) {
        throw new Error(`Failed to clean: ${destPath}`);
    }
}