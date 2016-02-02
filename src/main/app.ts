import { Component } from 'angular2/core';
import { RouteConfig, RouterOutlet } from 'angular2/router';
import { Home } from './home';
import { Workers } from './workers';

@Component({
  selector: 'app',
  directives: [RouterOutlet],
  template: '<router-outlet></router-outlet>'
})
@RouteConfig([
  { path: '/home',    name: 'Home',    component: Home,   useAsDefault: true },
  { path: '/workers', name: 'Workers', component: Workers }
])
export class App {}
