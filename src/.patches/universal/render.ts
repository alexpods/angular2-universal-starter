import { platform, Provider, ComponentRef, Injector } from 'angular2/core';
import { COMPILER_PROVIDERS } from 'angular2/compiler';
import { Router } from 'angular2/router';
import { DOCUMENT } from 'angular2/platform/common_dom';
import { DOCUMENT_HTML, PLATFORM_PROVIDERS, APPLICATION_PROVIDERS } from './node';


/* => Original render => */

const {
  selectorResolver,
  selectorRegExpFactory,
  renderToString
} = require('angular2-universal-preview');


export function render1(html, ComponentType, providers) {
  return renderToString(ComponentType, providers).then((serializedCmp) => {
    const selector: string = selectorResolver(ComponentType);
    return html.replace(selectorRegExpFactory(selector), serializedCmp);
  });
}

/* <= Original render <= */


/* => Render with DOCUMENT serialization => */

const { Serializer, TreeAdapters } = require('parse5');
const serializer = new Serializer(TreeAdapters.htmlparser2);

export function render2(html, ComponentType, providers) {
  return platform( PLATFORM_PROVIDERS )
    .application([ APPLICATION_PROVIDERS, new Provider(DOCUMENT_HTML, { useValue: html }) ])
    .bootstrap(ComponentType, providers)
    .then((compRef: ComponentRef) => {
      const injector: Injector = compRef.injector;
      const router: Router = injector.getOptional(Router);
      const document = injector.get(DOCUMENT)
      
      return Promise.resolve()
        .then(() => router && (<any> router)._currentNavigation)
        .then(() => new Promise(resolve => setTimeout(resolve)))
        .then(() => serializer.serialize(document))
    })
}