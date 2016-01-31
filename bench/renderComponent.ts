import 'reflect-metadata';

import { provide } from 'angular2/core';
import { ROUTER_PROVIDERS, APP_BASE_HREF } from 'angular2/router';
import { SERVER_LOCATION_PROVIDERS, REQUEST_URL } from 'angular2-universal-preview';

import { App } from '../src/app/app';
import { render1, render2 } from '../src/.patches/universal/render';

const Benchmark = require('benchmark');

const html = require('../src/server/ng.html');
const providers = [
  ROUTER_PROVIDERS,
  SERVER_LOCATION_PROVIDERS,
  provide(APP_BASE_HREF, { useValue: '/' }),
  provide(REQUEST_URL,  { useValue: '/home' })
];


// Sutting up the "production/development mode" message
const log_ = console.log;
console.log = function log(m) {
  if (typeof m === 'string' && m.indexOf('Angular 2 is running') === 0) {
    return;
  }
  return log_.apply(this, arguments);
}

// warming up
var promises = [];
for (var i = 0; i < 100; ++i) {
  promises.push(render1(html, App, providers));
  promises.push(render2(html, App, providers));
}

// tests
Promise.all(promises).then(() => {
  return new Benchmark.Suite()
    .add({
      name: 'Original',
      async: true,
      defer: true,
      fn: (deferred) => {
        render1(html, App, providers).then(() => deferred.resolve())
      }
    })
    .add({
      name: 'With DOCUMENT serialization',
      async: true,
      defer: true,
      fn: (deferred) => {
        render2(html, App, providers).then(() => deferred.resolve())
      }
    })
    .on('complete', function() {
      console.log(this[0].toString());
      console.log(this[1].toString());
    })
    .run();
});
