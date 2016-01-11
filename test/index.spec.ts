declare var require: any;

import 'phantomjs-polyfill';
import 'es6-shim';
import 'es6-promise';
import 'reflect-metadata';
import 'zone.js/lib/browser/zone-microtask';
import 'zone.js/lib/browser/long-stack-trace-zone';
import 'zone.js/dist/jasmine-patch.js';
import 'angular2/core';
import 'angular2/testing';

const testsContext = require.context('../src', true, /\.spec\.ts/);
testsContext.keys().forEach(testsContext);

const domAdapter = require('angular2/src/platform/browser/browser_adapter');
domAdapter.BrowserDomAdapter.makeCurrent();
