import { Component } from 'angular2/core';

@Component({
  selector: 'app',
  template: 'Hello, {{ name }}!!!'
})
export class App {
  name = 'World';

  constructor() {
    setTimeout(() => this.name = 'Angular', 1000);
  }
}