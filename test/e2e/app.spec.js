describe('angular2-universal-starter application', function() {
 
  describe('Home page', function() {
    beforeEach(function() {
      browser.get('/');
    });
    
    it('should show "Preboot is working" message', function() {
      const button = element(by.id('check-preboot'));
      const message = element(by.id('message-preboot'));
      
      expect(message.isPresent()).toBeFalsy();
      button.click();
      browser.wait(function() { return message.isPresent() }, 10000);
    });
    
    it('should show lazy loaded greeting message', function() {
      const button = element(by.id('check-lazyloading'));
      const message = element(by.id('message-lazyloading'));
      
      expect(message.isPresent()).toBeFalsy();
      button.click();
      expect(message.isPresent()).toBeFalsy();
      browser.wait(function() { return message.isPresent() }, 10000);
    });  
  });
  
  describe('Workers page', function() {
    beforeEach(function() {
      browser.get('/workers');
    });

    it('should contain "Workers Page" header', function() {
      const header = element(by.css('h1'));
      
      expect(header.isPresent()).toBeTruthy();
      expect(header.getText()).toBe('Workers Page');
    })
  });
});
