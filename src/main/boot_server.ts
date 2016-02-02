import { Provider } from 'angular2/core';
import { bootstrap, SERVER_LOCATION_PROVIDERS } from 'angular2-universal-preview';
import { ROUTER_PROVIDERS, APP_BASE_HREF } from 'angular2/router';
import { App } from './app';

export function main(BOOT_PROVIDERS) {
  return bootstrap(App, [
    BOOT_PROVIDERS,
    ROUTER_PROVIDERS,
    SERVER_LOCATION_PROVIDERS,
    new Provider(APP_BASE_HREF, { useValue: '/' }),
  ]);
};
