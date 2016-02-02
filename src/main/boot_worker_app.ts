import { platform, Provider, ApplicationRef } from 'angular2/core';

import {
  WORKER_APP_PLATFORM,
  WORKER_APP_APPLICATION,
  WORKER_APP_ROUTER
} from 'angular2/platform/worker_app';

import { APP_BASE_HREF } from 'angular2/router';
import { App } from './app';

export function main(BOOT_PROVIDERS) {
  return platform(WORKER_APP_PLATFORM).asyncApplication(() => Promise.resolve([
    BOOT_PROVIDERS,
    WORKER_APP_APPLICATION,
    WORKER_APP_ROUTER,
    new Provider(APP_BASE_HREF, { useValue: '/' }),
  ]))
  .then((appRef: ApplicationRef) => {
    return appRef.bootstrap(App, [])
  })
}
