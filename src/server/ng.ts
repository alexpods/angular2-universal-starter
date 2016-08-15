import { Router, Request, Response } from 'express';
import { provide } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import {
  REQUEST_URL,
  NODE_LOCATION_PROVIDERS,
  ORIGIN_URL,
  selectorResolver,
  selectorRegExpFactory,
  renderToStringWithPreboot,
  Bootloader
} from 'angular2-universal';

import { App } from '../app/app';

function reduceScripts(content, src) {
  return `${content}<script type="text/javascript" src="${src}"></script>`;
}

function getBaseUrlFromRequest(request: Request): string {
  return `${request.protocol}://${request.get('HOST')}/`;
}

const WORKER_SCRIPTS  = [`${VENDOR_NAME}.js`, `${WORKER_NAME}.js`].reduce(reduceScripts, '');
const BROWSER_SCRIPTS = [`${VENDOR_NAME}.js`, `${BROWSER_NAME}.js`].reduce(reduceScripts, '');

const HTML_FILE = require('./ng.html');

export function renderComponent(html, component, providers, prebootOptions) {
  return renderToStringWithPreboot(component, providers, prebootOptions).then((serializedCmp) => {
    const selector: string = selectorResolver(component);

    return html.replace(selectorRegExpFactory(selector), serializedCmp);
  });
}

if (!global['_bootloader']) {
  global['_bootloader'] = new Bootloader({
    template: HTML_FILE,
    platformProviders: [
      ...NODE_LOCATION_PROVIDERS,
      provide(APP_BASE_HREF, { useValue: '/' }),
    ]
  });
}

const bootloader = global['_bootloader'];

const router = Router();

/**
 * Angular2 application
 */
router.get('/*', (req: Request, res: Response, next: Function) => {
  return Promise.resolve()
    .then(() => {
      if (HAS_SS) {
        return bootloader.serializeApplication({
          directives: [App],
          preboot: PREBOOT,
          providers: [
            provide(REQUEST_URL,   { useValue: req.originalUrl }),
            provide(ORIGIN_URL,    { useValue: getBaseUrlFromRequest(req) })
          ]
        });
      }

      return HTML_FILE;
    })
    .then((rawContent) => {
      const scripts = HAS_WW ? WORKER_SCRIPTS : BROWSER_SCRIPTS;
      const content = rawContent.replace('</body>', scripts + '</body>');

      return res.send(content);
    })
    .catch(error => next(error));
});

export { router };
