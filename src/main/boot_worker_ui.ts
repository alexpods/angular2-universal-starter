import { platform } from 'angular2/core';

import {
  WORKER_RENDER_PLATFORM,
  WORKER_RENDER_APP,
  WORKER_RENDER_ROUTER
} from 'angular2/platform/worker_render';

export function main(BOOT_PROVIDERS) {
  return platform(WORKER_RENDER_PLATFORM).application([
    BOOT_PROVIDERS,
    WORKER_RENDER_APP,
    WORKER_RENDER_ROUTER
  ]);
}