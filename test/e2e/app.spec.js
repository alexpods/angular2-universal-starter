describe('angular2-universal-starter application', function() {

  describe('Home page', function() {
    beforeEach(function() {
      browser.get('/');
    });

    it('should show "Preboot is working" message', function () {

      const button = browser.wait(protractor.until.elementLocated(by.id('check-preboot')), 10000);
      const message = element(by.id('message-preboot'));

      expect(message.isPresent()).toBeFalsy();
      button.click();
      browser.wait(function() { return message.isPresent() }, 10000);
    });

    it('should show lazy loaded greeting message', function () {
      const button = browser.wait(protractor.until.elementLocated(by.id('check-lazyloading')), 10000);
      const message = element(by.id('message-lazyloading'));

      expect(message.isPresent()).toBeFalsy();
      button.click();
      expect(message.isPresent());
      browser.wait(function() { return message.isPresent() }, 10000);
    });
  });

  describe('Workers page', function() {
    beforeEach(function() {
      browser.get('/workers');
    });

    it('should contain "Workers Page" header', function () {
      const header = browser.wait(protractor.until.elementLocated(by.css('h1')), 10000);
      expect(header.getText()).toBe('Workers Page');
    })
  });
});
