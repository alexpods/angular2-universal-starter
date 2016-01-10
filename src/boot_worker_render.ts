import { platform, provide } from 'angular2/core';
import { WORKER_RENDER_APP, WORKER_RENDER_PLATFORM, WORKER_SCRIPT } from 'angular2/platform/worker_render';

const workerScriptUrl = URL.createObjectURL(new Blob([`
    var window = this; 
    var origin = this.location.origin;
    importScripts(origin + '/vendor.js', origin + '/boot_worker.js');
`], { 
    type: 'text/javascript' 
}));

platform(WORKER_RENDER_PLATFORM).application([
    WORKER_RENDER_APP,
    provide(WORKER_SCRIPT, { useValue: workerScriptUrl })
]);
  
