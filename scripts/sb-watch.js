'use strict';

const upath = require('upath');
const renderAssets = require('./render-assets');
const renderPug = require('./render-pug');
const renderScripts = require('./render-scripts');
const renderSCSS = require('./render-scss');

const allPugFiles = new Set();

let READY = false;
let taskQueue = Promise.resolve();

process.title = 'pug-watch';
process.stdout.write('Loading');

function runTask(task) {
    taskQueue = taskQueue
        .then(() => task())
        .catch(error => {
            console.error('### WATCHER ERROR:', error);
        });

    return taskQueue;
}

function isPugFile(filePath) {
    return filePath.endsWith('.pug');
}

function isSharedPugFile(filePath) {
    return (
        /(^|\/)(includes|mixins)(\/|$)/.test(filePath)
        || /(^|\/)pug\/layouts(\/|$)/.test(filePath)
    );
}

function isPugPage(filePath) {
    return isPugFile(filePath) && !isSharedPugFile(filePath);
}

async function processFile(filePath, watchEvent) {
    filePath = upath.normalize(filePath);

    if (isPugPage(filePath)) {
        allPugFiles.add(filePath);
    }

    if (!READY) {
        process.stdout.write('.');
        return;
    }

    console.log(`### INFO: File event: ${watchEvent}: ${filePath}`);

    if (isPugFile(filePath)) {
        return handlePug(filePath, watchEvent);
    }

    if (filePath.endsWith('.scss')) {
        return renderSCSS();
    }

    if (filePath.includes('/js/')) {
        return renderScripts();
    }

    if (filePath.includes('/assets/')) {
        return renderAssets();
    }
}

async function handlePug(filePath, watchEvent) {
    if (isSharedPugFile(filePath)) {
        return renderAllPug();
    }

    if (isPugPage(filePath)) {
        return renderPug(filePath);
    }
}

async function renderAllPug() {
    console.log('### INFO: Rendering All');

    await Promise.all(
        [...allPugFiles].map(filePath => renderPug(filePath))
    );
}

async function startWatcher() {
    const { watch } = await import('chokidar');

    const watcher = watch('src', {
        persistent: true
    });

    watcher.on('add', filePath => {
        runTask(() => processFile(filePath, 'add'));
    });

    watcher.on('change', filePath => {
        runTask(() => processFile(filePath, 'change'));
    });

    watcher.on('ready', () => {
        READY = true;
        console.log(' READY TO ROLL!');
    });

    watcher.on('error', error => {
        console.error('### WATCHER ERROR:', error);
    });

    await renderSCSS();
}

startWatcher().catch(error => {
    console.error('### WATCHER STARTUP ERROR:', error);
    process.exit(1);
});
