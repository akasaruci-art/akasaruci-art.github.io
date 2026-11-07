'use strict';

const autoprefixer = require('autoprefixer');
const fs = require('fs');
const packageJSON = require('../package.json');
const upath = require('upath');
const postcss = require('postcss');
const sass = require('sass');
const sh = require('shelljs');

const stylesPath = upath.resolve(
    __dirname,
    '../src/scss/styles.scss'
);

const destPath = upath.resolve(
    __dirname,
    '../docs/css/styles.css'
);

module.exports = async function renderSCSS() {

    const results = sass.compile(stylesPath, {
        loadPaths: [
            upath.resolve(__dirname, '../node_modules')
        ],
        quietDeps: true,
        silenceDeprecations: ['import']
    });

    const copyright = `/*!
* Start Bootstrap - ${packageJSON.title} v${packageJSON.version} (${packageJSON.homepage})
* Copyright 2013-${new Date().getFullYear()} ${packageJSON.author}
* Licensed under ${packageJSON.license} (https://github.com/StartBootstrap/${packageJSON.name}/blob/master/LICENSE)
*/
`;

    const destPathDirname = upath.dirname(destPath);

    if (!sh.test('-e', destPathDirname)) {
        sh.mkdir('-p', destPathDirname);
    }

    const result = await postcss([autoprefixer]).process(
        results.css,
        {
            from: stylesPath,
            to: destPath
        }
    );

    result.warnings().forEach(warn => {
        console.warn(warn.toString());
    });

    fs.writeFileSync(destPath, copyright + result.css);

    console.log(`### INFO: Successfully compiled SCSS to ${destPath}`);
};