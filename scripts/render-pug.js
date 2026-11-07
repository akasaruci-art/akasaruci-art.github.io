'use strict';

const fs = require('fs');
const upath = require('upath');
const pug = require('pug');
const sh = require('shelljs');
const prettier = require('prettier');

const projectRoot = upath.resolve(upath.dirname(__filename), '..');

module.exports = async function renderPug(filePath) {
    const normalizedPath = upath.normalize(filePath);

    const pugRoot = upath.resolve(projectRoot, 'src/pug');
    const docsRoot = upath.resolve(projectRoot, 'docs');

    const relativePath = upath.relative(pugRoot, normalizedPath);

    if (
        relativePath.startsWith('..')
        || upath.isAbsolute(relativePath)
    ) {
        throw new Error(`Pug file is outside the Pug source directory: ${filePath}`);
    }

    const destPath = upath.resolve(
        docsRoot,
        relativePath.replace(/\.pug$/, '.html')
    );

    console.log(`### INFO: Rendering ${normalizedPath} to ${destPath}`);

    const html = pug.renderFile(normalizedPath, {
        doctype: 'html',
        filename: normalizedPath,
        basedir: projectRoot
    });

    const destPathDirname = upath.dirname(destPath);

    if (!sh.test('-e', destPathDirname)) {
        sh.mkdir('-p', destPathDirname);
    }

    const prettified = await prettier.format(html, {
        printWidth: 1000,
        tabWidth: 4,
        singleQuote: true,
        proseWrap: 'preserve',
        endOfLine: 'lf',
        parser: 'html',
        htmlWhitespaceSensitivity: 'ignore'
    });

    fs.writeFileSync(destPath, prettified, 'utf8');
};
