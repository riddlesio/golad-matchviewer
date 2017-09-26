require('babel-core/register')({ presets: ['es2015'] });

const desktopCapabilities = require('./desktopCapabilities.conf');

exports.config = {
    multiCapabilities: desktopCapabilities,
    seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
    // seleniumAddress: 'http://localhost:4444/wd/hub',
    maxSessions: 1,
    specs: ['./tests/index-spec.js'],
    baseUrl: 'http://localhost:8686/',
    framework: 'mocha',
    getPageTimeout: 10000,
    allScriptsTimeout: 60000,
    onPrepare: function () {
        browser.ignoreSynchronization = true;
    },
};
