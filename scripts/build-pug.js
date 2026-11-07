'use strict';

const upath = require('upath');
const sh = require('shelljs');
const renderPug = require('./render-pug');

const srcPath = upath.resolve(upath.dirname(__filename), '../src');

async function build() {
    const files = sh.find(srcPath);

    const pugFiles = files.filter(filePath => {
        const normalizedPath = upath.normalize(filePath);

        return (
            normalizedPath.endsWith('.pug')
            && !normalizedPath.includes('/includes/')
            && !normalizedPath.includes('/mixins/')
            && !normalizedPath.includes('/pug/layouts/')
        );
    });

    for (const filePath of pugFiles) {
        await renderPug(filePath);
    }
}

build().catch(error => {
    console.error('### ERROR: Pug build failed:', error);
    process.exitCode = 1;
});
