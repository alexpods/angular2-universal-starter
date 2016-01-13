describe('angular2-universal-starter application', function() {
 
  beforeEach(function() {
    browser.get('/');
  })
  
  it('should show "Preboot is working" message', function() {
    const button = element(by.id('check-preboot'));
    const message = element(by.id('message-preboot'));
    
    expect(button.getText()).toEqual('Check "preboot"');
    expect(message.isPresent()).toBeFalsy();
    button.click();
    expect(message.isPresent()).toBeFalsy();
    
    browser.wait(function() { return message.isPresent() }, 5000);
  });
});