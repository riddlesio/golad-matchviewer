import chai from 'chai';
import promised from 'chai-as-promised';
import takeScreenshot from './util/takeScreenshot';

chai.use(promised);

const { expect } = chai;

describe('MatchViewer:', function () {

    this.timeout(60000);

    before(() => {
        browser.get('http://localhost:8686')
            .then(() => browser.wait(element(by.id('player')).isPresent()));
    });

    afterEach(takeScreenshot);

    it('Should show a game state', () => {
        browser.sleep(1200);

        expect(true).toBe(true);
    });

    it('Should show the victory overlay', () => {
        const lastStateButton = element(by.css('.fa-fast-forward'));

        lastStateButton.click();

        browser.sleep(1200);

        expect($('.Golad-overlay-foreground').isPresent()).to.eventually.equal(true);
    });
});
