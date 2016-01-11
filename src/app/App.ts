import { Component } from 'angular2/core';

@Component({
  selector: 'app',
  template: `
    <h1>Hello, {{ name }}!!!</h1>
    <button (click)="onCheckPreboot()">Check "preboot"</button>
  `
})
export class App {
  name = 'World';

  constructor() {
    setTimeout(() => this.name = 'Angular', 1000);
  }
  
  onCheckPreboot() {
    console.log('Preboot is checked');
  }
}