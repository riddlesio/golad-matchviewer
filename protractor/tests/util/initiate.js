import chai from 'chai';
import promised from 'chai-as-promised';

chai.use(promised);

const { expect } = chai;

describe('Initiate:', function () {

    this.timeout(60000);

    before(() => {
        browser.get('http://localhost:8686')
            .then(() => browser.wait(element(by.id('player')).isPresent()));
    });

    it('Maximizing window', () => {
        browser.sleep(100);
        browser.driver.manage().window().setSize(1920, 1080);
        browser.driver.manage().window().maximize();

        expect(true).to.be.true;
    });
});
