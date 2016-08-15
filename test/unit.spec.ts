declare var require: any;
declare var __karma__: any;

import 'core-js/es6';
import 'core-js/es7/reflect';

import 'zone.js/dist/zone';
import 'zone.js/dist/long-stack-trace-zone';
import 'zone.js/dist/jasmine-patch';
import 'zone.js/dist/async-test';
import 'zone.js/dist/sync-test';
import 'zone.js/dist/fake-async-test';

import 'rxjs/Rx'

import { setBaseTestProviders } from '@angular/core/testing'

import {
  TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS,
  TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS
} from '@angular/platform-browser-dynamic/testing';


setBaseTestProviders(TEST_BROWSER_DYNAMIC_PLATFORM_PROVIDERS, TEST_BROWSER_DYNAMIC_APPLICATION_PROVIDERS);

const args = __karma__.config.args;
const opts = args[0];

const testsContext = require.context('../src', true, /\.spec\.ts/);

let modules  = testsContext.keys();
let testPath = opts.testPath;

if (testPath) {
  testPath = './' + testPath.slice(4);
  modules = modules.filter(modulePath => modulePath.startsWith(testPath));
}

modules.forEach(testsContext);
