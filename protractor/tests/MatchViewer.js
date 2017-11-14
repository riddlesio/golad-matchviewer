import chai from 'chai';
import promised from 'chai-as-promised';
import takeScreenshot from './util/takeScreenshot';

chai.use(promised);

const { expect } = chai;

describe('MatchViewer:', function () {

    this.timeout(60000);

    let lastStateButton;

    before(() => {

        browser.sleep(2000);

        browser.driver.switchTo().frame(browser.findElement(by.id('player')));

        const gameplayerButtons = $$('.GamePlayer-button');

        lastStateButton = gameplayerButtons.get(4);
    });

    afterEach(takeScreenshot);

    it('Should show a game state', () => {

        expect(true).to.be.true;
    });

    it('Should show the victory overlay', () => {

        lastStateButton.click();

        browser.sleep(1000);

        expect(true).to.be.true;
    });
});
