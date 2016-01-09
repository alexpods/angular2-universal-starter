import './vendor.ts';

import { platform, provide } from 'angular2/core';
import { WORKER_RENDER_APP, WORKER_RENDER_PLATFORM, WORKER_SCRIPT } from 'angular2/platform/worker_render';

platform([
    WORKER_RENDER_PLATFORM
  ])
  .application([
    WORKER_RENDER_APP,
    provide(WORKER_SCRIPT, { useValue: "app_worker.js" })
  ]);