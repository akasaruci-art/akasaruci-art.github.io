'use strict';

const upath = require('upath');

async function start() {
    const { concurrently } = await import('concurrently');

    const browserSyncPath = upath.resolve(
        upath.dirname(__filename),
        '../node_modules/.bin/browser-sync'
    );

    const { result } = concurrently(
        [
            {
                command: 'node --inspect scripts/sb-watch.js',
                name: 'SB_WATCH',
                prefixColor: 'bgBlue.bold',
            },
            {
                command: `"${browserSyncPath}" docs -w --no-online`,
                name: 'SB_BROWSER_SYNC',
                prefixColor: 'bgGreen.bold',
            },
        ],
        {
            prefix: 'name',
            killOthers: ['failure', 'success'],
        }
    );

    await result;
}

start().catch(error => {
    console.error('Failed to start debug:', error);
    process.exitCode = 1;
});
