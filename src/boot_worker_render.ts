import { platform, provide } from 'angular2/core';
import { WORKER_RENDER_APP_ROUTER } from './.patches/worker/ui';
import {
  WebWorkerInstance,
  WORKER_RENDER_APP,
  WORKER_RENDER_PLATFORM,
  WORKER_SCRIPT
} from 'angular2/platform/worker_render';

const workerScriptUrl = URL.createObjectURL(new Blob([`
  var window = this; 
  var origin = this.location.origin;
  importScripts(origin + '/run_worker_app.js', origin + '/vendor.js', origin + '/boot_worker_app.js');
`], {
    type: 'text/javascript'
}));

const appRef = platform(WORKER_RENDER_PLATFORM).application([
  WORKER_RENDER_APP,
  WORKER_RENDER_APP_ROUTER,
  provide(WORKER_SCRIPT, { useValue: workerScriptUrl })
]);

const worker = appRef.injector.get(WebWorkerInstance).worker;

worker.addEventListener('message', function onAppReady(event) {
  if (event.data === 'APP_READY') {
    worker.removeEventListener('message', onAppReady, false);
    URL.revokeObjectURL(workerScriptUrl);
    setTimeout(() => document.dispatchEvent(new Event('BootstrapComplete')));
  }
}, false);
