import { Component } from 'angular2/core';
import { Title } from 'angular2/src/platform/browser/title';

@Component({
  selector: 'worker',
  template: '<h1>Workers Page</h1>'
})
export class Workers {
  constructor(titleService: Title) {
    titleService.setTitle('Workers page!!!');
  }
}
