import { Component } from '@angular/core';
import { Home } from './home';

@Component({
  selector: 'app',
  directives: [Home],
  template: `
    <home></home>
  `,
})
export class App {}
