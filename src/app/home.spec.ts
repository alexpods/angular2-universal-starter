import {
  describe,
  it,
  expect,
  TestComponentBuilder,
  injectAsync,
  tick,
  fakeAsync,
  setBaseTestProviders
} from 'angular2/testing';

import {
  TEST_BROWSER_PLATFORM_PROVIDERS,
  TEST_BROWSER_APPLICATION_PROVIDERS
} from 'angular2/platform/testing/browser';

import { Home } from './home';

setBaseTestProviders(TEST_BROWSER_PLATFORM_PROVIDERS, TEST_BROWSER_APPLICATION_PROVIDERS);

describe('Home', () => {
  it('should change name to "Angular" after 1s', injectAsync([TestComponentBuilder], fakeAsync((tcb) => {
    return tcb.createAsync(Home).then((fixture) => {
      const { componentInstance } = fixture;
      expect(componentInstance.name).toBe('World');
      tick(1000);
      expect(componentInstance.name).toBe('Angular');
    });
  })));

  it('should set message on button click', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(Home).then((fixture) => {
      const { componentInstance, nativeElement } = fixture;

      expect(componentInstance.messagePreboot).toBeFalsy();
      nativeElement.querySelector('#check-preboot').click();
      expect(componentInstance.messagePreboot).toBeTruthy();
    });
  }));

  it('should lazy load service', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(Home).then((fixture) => {
      const { componentInstance, nativeElement } = fixture;

      expect(componentInstance.messageLazyLoading).toBeFalsy();
      nativeElement.querySelector('#check-lazyloading').click();
      expect(componentInstance.messageLazyLoading).toBeFalsy();

      return new Promise(resolve => setTimeout(resolve, 100)).then(() => {
        expect(componentInstance.messageLazyLoading).toBeTruthy();
      });
    });
  }));
});
