import { Component } from 'angular2/core';

@Component({
    selector: 'app',
    template: 'Hello, {{ name }}!!!'
})
export class App {
    name: string = 'Hello';

    constructor() {
        setTimeout(() => this.name = 'Angular2', 1000);
    }
}