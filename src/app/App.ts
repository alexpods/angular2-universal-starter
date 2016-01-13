declare var require: any;

import { Component } from 'angular2/core';
import { NgIf } from 'angular2/common';
import * as style from './App.css';
import * as template from './App.html';

@Component({
  selector: 'app',
  directives: [NgIf],
  template,
  styles: [style]
})
export class App {
  name = 'World';
  messagePreboot = '';
  messageLazyLoading = '';

  constructor() {
    setTimeout(() => this.name = 'Angular', 1000);
  }
  
  onCheckPreboot() {
    console.log('Check preboot');
    this.messagePreboot = "Preboot is working"
  }
  
  onCheckLazyLoading() {
    require.ensure(['./greeter.ts'], (require) => {
      const greeter = require('./greeter.ts');
      greeter.greet();
      this.messageLazyLoading = 'Lazy loading is working';
    })
  }
}