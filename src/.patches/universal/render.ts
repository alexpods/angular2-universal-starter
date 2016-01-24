declare var zone: any;

import { platform, Injector } from 'angular2/core';
import { Router } from 'angular2/router';
import { REQUEST_URL } from './router';
import * as universal from 'angular2-universal-preview'

const {
  bootstrap,
  appRefSyncRender,
  createPrebootHTML,
  selectorResolver,
  selectorRegExpFactory,
  prebootConfigDefault,
} = require('angular2-universal-preview');

const {
  getClientCode
} = require('preboot');

function bootstrapComponent(component, providers) {
  return bootstrap(component, providers).then((compRef) => {
    const injector: Injector = compRef.injector;
    const router: Router = injector.getOptional(Router);
    
    return Promise.resolve()
      .then(() => router && (<any>router)._currentNavigation)
      .then(() => new Promise(resolve => setTimeout(() => resolve(compRef))));
  }); 
}

function serializeComponent(component, providers) {
  return bootstrapComponent(component, providers).then((appRef) => {
    const html = appRefSyncRender(appRef);
    (<any>appRef).dispose();
    return html;
  });
}

function serializeComponentWithPreboot(component, providers, prebootOptions): Promise<string> {
  return serializeComponent(component, providers).then((html: string) => {
    if (typeof prebootOptions === 'boolean' && prebootOptions=== false) {
      return html;
    }
    
    const options = prebootConfigDefault(prebootOptions);
    
    return getClientCode(options).then(code => html + createPrebootHTML(code, options));
  });
}

export function renderComponent(html, component, providers, prebootOptions) {
  return serializeComponentWithPreboot(component, providers, prebootOptions).then((serializedCmp) => {
    const selector: string = selectorResolver(component);

    return html.replace(selectorRegExpFactory(selector), serializedCmp);
  });
}
