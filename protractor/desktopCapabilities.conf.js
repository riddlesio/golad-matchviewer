'use strict';

// Browsers which should be tested for all OS
const browserBase = [
    { browserName: 'Firefox', browser_version: '53.0' },
    { browserName: 'Firefox', browser_version: '54.0' },
    { browserName: 'Firefox', browser_version: '55.0' },
    { browserName: 'Chrome', browser_version: '49.0' },
    { browserName: 'Chrome', browser_version: '58.0' },
    { browserName: 'Chrome', browser_version: '59.0' },
    { browserName: 'Chrome', browser_version: '60.0' },
];

// Specific browsers per OS
const win10Special = [
    { browserName: 'IE', browser_version: '11.0' },
    { browserName: 'Edge', browser_version: '14.0' },
    { browserName: 'Edge', browser_version: '15.0' },
];
const win8Special = [{ browserName: 'IE', browser_version: '11.0' }];
const win7Special = [{ browserName: 'IE', browser_version: '11.0' }];
const osxSiSpecial = [{ browserName: 'Safari', browser_version: '10.0' }];
const osxElSpecial = [{ browserName: 'Safari', browser_version: '9.0' }];
const osxYosSpecial = [{ browserName: 'Safari', browser_version: '8.0' }];

// Concat standard browsers and specific browsers
const win10Browsers = browserBase.concat(win10Special);
const win8Browsers = browserBase.concat(win8Special);
const win7Browsers = browserBase.concat(win7Special);
const osxElBrowsers = browserBase.concat(osxElSpecial);
const osxYosBrowsers = browserBase.concat(osxYosSpecial);
const osxSiBrowsers = browserBase.concat(osxSiSpecial);

// Adding the browsers to each OS object
const win10 = win10Browsers.map(browser => ({ os: 'WINDOWS', os_version: '10', ...browser }));
const win8 = win8Browsers.map(browser => ({ os: 'WINDOWS', os_version: '8.1', ...browser }));
const win7 = win7Browsers.map(browser => ({ os: 'WINDOWS', os_version: '7', ...browser }));
const osxSi = osxSiBrowsers.map(browser => ({ os: 'OS X', os_version: 'Sierra', ...browser }));
const osxEl = osxElBrowsers.map(browser => ({ os: 'OS X', os_version: 'El Captain', ...browser }));
const osxYos = osxYosBrowsers.map(browser => ({ os: 'OS X', os_version: 'Yosemite', ...browser }));

// All browser configs for all OS
const allBrowsers = [].concat(win10, win8, win7, osxSi, osxEl, osxYos);

// Assign base to each browser config
const capabilities = allBrowsers.map((brows) => {
    return {
        'browserstack.user': 'joeywisse1',
        'browserstack.key': 'PA5oJ217D9Gy7qbJax8s',
        'browserstack.local': true,
        'browserstack.debug': true,
        resolution: '1920x1080',
        browserName: brows.browserName,
        browser_version: brows.browser_version,
        os: brows.os,
        os_version: brows.os_version,
    };
});

module.exports = capabilities;
