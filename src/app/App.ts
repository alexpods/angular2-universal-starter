import { Component } from 'angular2/core';

@Component({
  selector: 'app',
  template: `
    <h1>Hello, {{ name }}!!!</h1>
    <div>
      <p>
        Try to push the button before angular2 will be loaded. 
        Preboot will catch the "click" event and replay it later.
      </p>
      <p>
        <button (click)="onCheckPreboot()">Check "preboot"</button>
        <b>{{ message }}</b>
      </p>
    </div>
  `
})
export class App {
  name = 'World';
  message = '';

  constructor() {
    setTimeout(() => this.name = 'Angular', 1000);
  }
  
  onCheckPreboot() {
    console.log(this.message = "Preboot is working");
  }
}