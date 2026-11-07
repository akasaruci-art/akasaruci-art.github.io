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
                command: 'node scripts/sb-watch.js',
                name: 'SB_WATCH',
                prefixColor: 'bgBlue.bold'
            },
            {
                command: `"${browserSyncPath}" --reload-delay 2000 --reload-debounce 2000 docs -w --no-online`,
                name: 'SB_BROWSER_SYNC',
                prefixColor: 'bgGreen.bold'
            }
        ],
        {
            prefix: 'name',
            killOthers: ['failure', 'success']
        }
    );

    await result;
}

start().catch(error => {
    console.error('Failed to start:', error);
    process.exitCode = 1;
});
