import chai from 'chai';
import promised from 'chai-as-promised';
import takeScreenshot from './util/takeScreenshot';

chai.use(promised);

const { assert, expect } = chai;

describe('MatchViewer:', function () {

    this.timeout(60000);

    before(() => browser.get('http://localhost:8686/'));

    afterEach(takeScreenshot);

    it('Should show a game state', () => {
        const promise = browser
            .wait(() => element(by.tagName('GamePlayer')).isPresent())
            .then(() => browser.sleep(500));

        return assert.isFulfilled(promise);
    });

    it('Should show the victory overlay', () => {
        const lastStateButton = element(by.css('.fa-fast-forward'));

        lastStateButton.click();

        browser.sleep(1200);

        expect($('.Golad-overlay-foreground').isPresent()).to.eventually.equal(true);
    });
});
