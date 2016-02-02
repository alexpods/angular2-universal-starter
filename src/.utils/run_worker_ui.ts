import { Provider } from 'angular2/core';
import { WebWorkerInstance, WORKER_SCRIPT } from 'angular2/platform/worker_render';

document.addEventListener('DOMContentLoaded', function onDOMContentLoaded() {
  const providers = [
    new Provider(WORKER_SCRIPT, { useValue: window['__WORKER_SCRIPT_URL'] })
  ];
  
  const appRef = window[__APPS_WORKER_UI_BUNDLE_NAME__].main(providers);
  const worker = appRef.injector.get(WebWorkerInstance).worker;

  worker.addEventListener('message', function onAppReady(event) {
    if (event.data === 'APP_READY') {
      worker.removeEventListener('message', onAppReady, false);
      URL.revokeObjectURL(window['__WORKER_SCRIPT_URL']);
      delete window['__WORKER_SCRIPT_URL'];
      setTimeout(function() { document.dispatchEvent(new Event('BootstrapComplete')) });
    }
  }, false);
});