import { Router, Request, Response } from 'express';
import { provide } from 'angular2/core';
import { PlatformLocation, APP_BASE_HREF, ROUTER_PROVIDERS } from 'angular2/router';
import { REQUEST_URL, ServerPlatformLocation } from '../.patches/universal/router';
import { App } from '../app/app';

const { selectorRegExpFactory } = require('angular2-universal-preview');
const { renderToStringWithPreboot, selectorResolver } = require('angular2-universal-preview/dist/server/src/render');

function reduceScripts(content, src) {
  return `${content}<script type='text/javascript' src='${src}'></script>`;
}

const WORKER_SCRIPTS  = ['run_worker.js',  'vendor.js', 'boot_worker.js'].reduce(reduceScripts, '');
const BROWSER_SCRIPTS = ['run_browser.js', 'vendor.js', 'boot_browser.js'].reduce(reduceScripts, '');

const HTML_FILE = require('./ng.html');

export function renderComponent(html, component, providers, prebootOptions) {
  return renderToStringWithPreboot(component, providers, prebootOptions).then((serializedCmp) => {
    const selector: string = selectorResolver(component);

    return html.replace(selectorRegExpFactory(selector), serializedCmp);
  });
}

const PROVIDERS = [
  ROUTER_PROVIDERS,
  provide(PlatformLocation, { useClass: ServerPlatformLocation }),
  provide(APP_BASE_HREF, { useValue: '/' }),
];

const router = Router();

/**
 * Angular2 application
 */
router.get('/*', (req: Request, res: Response, next: Function) => {
  return Promise.resolve()
    .then(() => {
      if (HAS_SS) {
        const REQUEST_PROVIDERS = [
          provide(REQUEST_URL,  { useValue: req.originalUrl })
        ];

        return renderComponent(HTML_FILE, App, [PROVIDERS, REQUEST_PROVIDERS], PREBOOT);
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
