import { Router } from 'angular2/router';

document.addEventListener('DOMContentLoaded', function onDOMContentLoaded() {
  const providers = [];
  
  window[__APPS_BROWSER_BUNDLE_NAME__].main(providers).then(function(compRef) {
    const injector = compRef.injector;
    const router: Router = injector.getOptional(Router);
    
    return Promise.resolve()
      .then(() => router && (<any> router)._currentNavigation)
      .then(() => new Promise(function(resolve) { setTimeout(resolve) }))
      .then(() => document.dispatchEvent(new Event('BootstrapComplete')))
  });
});