declare var zone: any;

import { platform } from 'angular2/core';
import { Router } from 'angular2/router';
import * as universal from 'angular2-universal-preview'

const {
  bootstrap,
  appRefSyncRender,
  createPrebootHTML,
  selectorResolver,
  selectorRegExpFactory,
  prebootConfigDefault,
} = <any>universal;

const preboot = require('preboot');

function bootstrapComponent(component, providers) {
  return bootstrap(component, providers).then((compRef) => {
    const injector = compRef.injector;
    const router = injector.getOptional(Router);
    
    if (router) {
      return Promise.resolve(router._currentNavigation).then(() => compRef);
    }
    
    return compRef;
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
    
    return preboot.getClientCode(options).then(code => html + createPrebootHTML(code, options));
  });
}

export function renderComponent(html, component, providers, prebootOptions) {
  return serializeComponentWithPreboot(component, providers, prebootOptions).then((serializedCmp) => {
    const selector: string = selectorResolver(component);

    return html.replace(selectorRegExpFactory(selector), serializedCmp);
  });
}
