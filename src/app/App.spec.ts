import { describe, it, expect, TestComponentBuilder, injectAsync, tick, fakeAsync } from 'angular2/testing';
import { App } from './App.ts';

describe('App', () => {
  it('should change name to "Angular" after 1s', injectAsync([TestComponentBuilder], fakeAsync((tcb) => {
    return tcb.createAsync(App).then((fixture) => {
      const { componentInstance } = fixture;
      expect(componentInstance.name).toBe('World');
      tick(1000);
      expect(componentInstance.name).toBe('Angular');  
    });
  })));
  
  it('should set message on button click', injectAsync([TestComponentBuilder], (tcb) => {
    return tcb.createAsync(App).then((fixture) => {
      const { componentInstance, nativeElement } = fixture;
      
      expect(componentInstance.message).toBeFalsy();
      nativeElement.querySelector('button').click();
      expect(componentInstance.message).toBeTruthy();
    });
  }))
});