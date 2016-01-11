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
  message = '';

  constructor() {
    setTimeout(() => this.name = 'Angular', 1000);
  }
  
  onCheckPreboot() {
    console.log(this.message = "Preboot is working");
  }
}