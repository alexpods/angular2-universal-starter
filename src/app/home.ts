declare var require: any;

import { Component } from 'angular2/core';
import { NgIf } from 'angular2/common';

@Component({
  selector: 'preboot-page',
  directives: [NgIf],
  template: require('./home.html'),
  styles: [require('./home.css')]
})
export class Home {
  name = 'World';
  messagePreboot = '';
  messageLazyLoading = '';

  constructor() {
    setTimeout(() => this.name = 'Angular', 1000);
  }

  onCheckPreboot() {
    console.log('Check preboot');
    this.messagePreboot = 'Preboot is working';
  }

  onCheckLazyLoading() {
    require.ensure([], () => {
      const greeter = require('./greeter.ts');
      this.messageLazyLoading = greeter.greet();
    });
  }
}
