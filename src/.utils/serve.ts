import { Request, Response } from 'express';
import { resolve as resolvePath, relative as relativePath } from 'path';
import { platform, Provider, ComponentRef, ExceptionHandler } from 'angular2/core';
import { DOM } from 'angular2/src/platform/dom/dom_adapter';
import { DOCUMENT } from 'angular2/platform/common_dom';
import { ROUTER_PROVIDERS, APP_BASE_HREF, Router } from 'angular2/router';
import { REQUEST_URL } from 'angular2-universal-preview';

const {
  createPrebootHTML,
  getBrowserCode,
  prebootConfigDefault
} = require('angular2-universal-preview');

const {
  parseDocument,
  serializeDocument
} = require('angular2-universal-preview/dist/server/src/platform/document');

const req = __non_webpack_require__;

const VENDOR_PATH = req.resolve(__PUBLIC_DIR__ + '/' + __VENDOR_BUNDLE_NAME__);
const VENDOR_URL = '/' + relativePath(__PUBLIC_DIR__, VENDOR_PATH);

const WORKER_APP_LOADER_ORIGIN = 'window.location.origin';
const WORKER_APP_READY_MESSAGE = 'APP_READY';

function createBrowserScripts(browserUrl) {
  return `
    <script type="text/javascript" src="${VENDOR_URL}"></script>
    <script type="text/javascript" src="${browserUrl}"></script>
  `;
}

function createWorkerScripts(workerUrl, workerAppUrl) {
  return `
    <script type="text/javascript" src="${VENDOR_URL}"></script>
    <script type="text/javascript" src="${workerUrl}"></script>
    <script>
      window.__WORKER_SCRIPT_URL = URL.createObjectURL(new Blob([
        "${createWorkerAppScripts(workerAppUrl).replace(/\n/g, '\\n\\\n')}"
      ], {
        type: 'text/javascript'
      }));
    </script>
  `
}

function createWorkerAppScripts(workerAppUrl) {
  return `
    var importScripts_ = this.importScripts;

    this.importScripts = function importScripts() {
      for (var i = 0, scripts = new Array(arguments.length); i < scripts.length; ++i) {
        var script = arguments[i];
        var origin = '" + ${WORKER_APP_LOADER_ORIGIN} + "';

        if (script.indexOf('http:') !== 0 || script.indexOf('https:') !== 0) {
          script =  origin + (script[0] === '/' ? script : '/' + script);
        }

        scripts[i] = script;
      }

      return importScripts_.apply(this, scripts);
    };

    importScripts('${VENDOR_URL}', '${workerAppUrl}');
  `;
}

export function serveUniversal(name, indexHtml, options: any = {}) {
  let server, browserScripts = '', workerScripts = '', prebootHtml = '', prebootPromise = Promise.resolve();

  if (options.server) {
    const serverPath = typeof options.server === 'string'
      ? options.server
      : resolvePath(__PRIVATE_DIR__, name + '-' + __APPS_SERVER_BUNDLE_NAME__ + '.js');

    server = req(serverPath);
  }

  if (options.browser) {
    const browserPath = typeof options.browser === 'string'
      ? options.browser
      : resolvePath(__PUBLIC_DIR__,  name + '-' + __APPS_BROWSER_BUNDLE_NAME__ + '.js');

    const browserUrl = '/' + relativePath(__PUBLIC_DIR__, browserPath);

    browserScripts = createBrowserScripts(browserUrl);
  }

  if (options.worker) {
    const workerPaths = Array.isArray(options.worker)
      ? options.worker
      : [
        resolvePath(__PUBLIC_DIR__,  name + '-' + __APPS_WORKER_UI_BUNDLE_NAME__ + '.js'),
        resolvePath(__PUBLIC_DIR__,  name + '-' + __APPS_WORKER_APP_BUNDLE_NAME__+ '.js')
      ];

    const workerUrl    = '/' + relativePath(__PUBLIC_DIR__, workerPaths[0]);
    const workerAppUrl = '/' + relativePath(__PUBLIC_DIR__, workerPaths[1]);

    workerScripts  = createWorkerScripts(workerUrl, workerAppUrl);
  }

  const prebootOptions =  options.preboot !== false 
    ? prebootConfigDefault(Object.assign({}, __PREBOOT__, options.preboot))
    : false;

  return (req: Request, res: Response, next: Function) => prebootPromise.then(() => Promise.resolve(indexHtml))
    .then((html) => {
      if (__SS__ && server) {
        const REQUEST_PROVIDERS = [
          new Provider(ExceptionHandler, { useFactory: () => new ExceptionHandler(DOM, true) }),
          new Provider(DOCUMENT, { useValue: parseDocument(html) }),    
          new Provider(REQUEST_URL, { useValue: req.originalUrl }),
        ];

        return server.main(REQUEST_PROVIDERS, req).then(function(compRef) {
          const injector = compRef.injector;
          const router: Router = injector.getOptional(Router);
          
          return Promise.resolve()
            .then(() => router && (<any> router)._currentNavigation)
            .then(() => new Promise(function(resolve) { setTimeout(resolve) }))
            .then(() => serializeDocument(compRef.injector.get(DOCUMENT)))
        });
      }
      return html;
    })
    .then((html) => {
      if (prebootOptions && (workerScripts || browserScripts)) {
        return getBrowserCode(prebootOptions).then((code) => {
          const prebootHtml = createPrebootHTML(code, prebootOptions);

          return html.replace('</body>', prebootHtml + '</body>')
        });
      }
      return html;
    })
    .then((html) => {
      let scripts = '';

      if (__WW__ && workerScripts) {
        scripts = workerScripts;
      } else if (browserScripts) {
        scripts = browserScripts;
      }

      return res.status(200).send(scripts ? html.replace('</body>', scripts + '</body>') : html);
    })
    .catch(err => next(err))
}
