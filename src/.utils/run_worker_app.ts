import { Router } from 'angular2/router';

const global = new Function('return this')();

setTimeout(function() {
  const providers = [];
  
  global[__APPS_WORKER_APP_BUNDLE_NAME__].main(providers).then(function(compRef) {
    const injector = compRef.injector;
    const router: Router = injector.getOptional(Router);
    
    return Promise.resolve()
      .then(() => router && (<any> router)._currentNavigation)
      .then(() => new Promise(function(resolve) { setTimeout(resolve) }))
      .then(() => postMessage('APP_READY', undefined))
  });
}, 100);
