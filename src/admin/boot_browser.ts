import { Provider } from 'angular2/core';
import { bootstrap } from 'angular2/platform/browser';
import { ROUTER_PROVIDERS, APP_BASE_HREF } from 'angular2/router';
import { App } from './app';

export function main(BOOT_PROVIDERS) {
  return bootstrap(App, [
    BOOT_PROVIDERS,
    ROUTER_PROVIDERS,
    new Provider(APP_BASE_HREF, { useValue: '/' })
  ]);
};
