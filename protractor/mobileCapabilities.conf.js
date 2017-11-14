'use strict';

const androidBrowsers = [
    { browserName: 'android', device: 'Google Nexus 5', platform: 'ANDROID' },
    { browserName: 'android', device: 'Google Nexus 7', platform: 'ANDROID' },
    { browserName: 'android', device: 'Samsung Galaxy S5', platform: 'ANDROID' },
    { browserName: 'android', device: 'Samsung Galaxy S5 Mini', platform: 'ANDROID' },
    { browserName: 'android', device: 'Samsung Galaxy Tab 4 10.1', platform: 'ANDROID' },
    { browserName: 'android', device: 'HTC One M8', platform: 'ANDROID' },
    { browserName: 'android', device: 'Samsung Galaxy S8', platform: 'ANDROID' },
];

const iOSBrowsers = [
    { browserName: 'iPhone', device: 'iPhone 6S', platform: 'MAC', },
    { browserName: 'iPhone', device: 'iPhone 5S', platform: 'MAC', },
    { browserName: 'iPad', device: 'iPad Mini 4', platform: 'MAC', },
    { browserName: 'iPad', device: 'iPad Air 2', platform: 'MAC', },
    { browserName: 'iPad', device: 'iPad Air', platform: 'MAC', },
];

const landscapeIOS = iOSBrowsers.map(browser => ({ ...browser, deviceOrientation: 'landscape' }));
const landscapeAndroid = androidBrowsers.map(browser => ({ ...browser, deviceOrientation: 'landscape' }));
const browsers = [].concat(androidBrowsers, landscapeAndroid, iOSBrowsers, landscapeIOS);

const mobileCapabilities = browsers.map((browser) => {
    return {
        ...browser,
        'browserstack.user': 'joeywisse1',
        'browserstack.key': 'PA5oJ217D9Gy7qbJax8s',
    };
});

module.exports = mobileCapabilities;
