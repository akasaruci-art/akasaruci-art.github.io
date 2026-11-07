'use strict';

const renderSCSS = require('./render-scss');

renderSCSS().catch(error => {
    console.error('### ERROR: SCSS build failed:', error);
    process.exit(1);
});
