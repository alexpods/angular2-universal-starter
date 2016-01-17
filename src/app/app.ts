declare var require: any;

import { Component } from 'angular2/core';
import { NgIf } from 'angular2/common';
import { RouteConfig, RouterOutlet } from 'angular2/router';
import { Home } from './home';

@Component({
  selector: 'app',
  directives: [RouterOutlet],
  template: '<router-outlet></router-outlet>'
})
@RouteConfig([
  { path: '/', name: 'Home', component: Home }
])
export class App {}