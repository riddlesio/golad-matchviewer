const capitalize = ([c, ...cs]) => [c.toUpperCase(), ...cs].join('');

import { createWriteStream } from 'fs';

const writeScreenshot = fileName => data => {
    const stream = createWriteStream(fileName);
    stream.write(new Buffer(data, 'base64'));
    stream.end();
};

export default function () {

    browser.getCapabilities().then(capabilities => {

        const testName          = this.currentTest.fullTitle();
        const browserName       = capitalize(capabilities.get('browserName'));
        const browserVersion    = capabilities.get('version');
        const platform          = capabilities.get('platform');
        const screenshotFolder  = process.cwd() + '/protractor/screenshots/';
        const screenshotName    = `${testName} [${platform} ${browserName} ${browserVersion}].png`;

        browser
            .takeScreenshot()
            .then(writeScreenshot(screenshotFolder + screenshotName));
    });
}
