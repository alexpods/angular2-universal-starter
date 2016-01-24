import 'reflect-metadata';
import 'zone.js/dist/zone-microtask';
import 'zone.js/dist/long-stack-trace-zone';

import * as serveStatic from 'serve-static';
import * as express from 'express';
import { provide } from 'angular2/core';
import { PlatformLocation, APP_BASE_HREF, ROUTER_PROVIDERS } from 'angular2/router';
import { Request, Response } from 'express';
import { REQUEST_URL, ServerPlatformLocation } from '../.patches/universal/router';
import { renderComponent } from '../.patches/universal/render';
import { App } from '../app/app.ts';

// TODO: make "constants" to be an external dependency
const { PUBLIC_DIR, HAS_SS, HAS_WW, PREBOOT, WORKER_SCRIPTS, BROWSER_SCRIPTS } = require('../../constants.js');

function reduceScripts(content, src) {
  return content + '<script type="text/javascript" src="' + src + '"></script>';
}

const INDEX_HTML_FILE = require('../index.html');

const WORKER_SCRIPTS_HTML  = WORKER_SCRIPTS.reduce(reduceScripts, '');
const BROWSER_SCRIPTS_HTML = BROWSER_SCRIPTS.reduce(reduceScripts, '');

const PROVIDERS = [
  ROUTER_PROVIDERS,
  provide(PlatformLocation, { useClass: ServerPlatformLocation }),
  provide(APP_BASE_HREF, { useValue: '/' }),
];

export const app = express();

app.use(serveStatic(PUBLIC_DIR));

/**
 * Angular2 application
 */
app.get('/*', (req: Request, res: Response, next: Function) => {
  return Promise.resolve()
    .then(() => {
      if (HAS_SS) {
        const REQUEST_PROVIDERS = [
          provide(REQUEST_URL,  { useValue: req.originalUrl })
        ];

        return renderComponent(INDEX_HTML_FILE, App, [PROVIDERS, REQUEST_PROVIDERS], PREBOOT);
      }
      
      return INDEX_HTML_FILE;
    })
    .then((rawContent) => {
      const scripts = HAS_WW ? WORKER_SCRIPTS_HTML : BROWSER_SCRIPTS_HTML;
      const content = rawContent.replace('</body>', scripts+ '</body>');
      
      return res.send(content);
    })
    .catch(error => next(error));
});

/**
 * 404 Not Found
 */
app.use((req: Request, res: Response, next: Function) => {
  const err: any = new Error('Not Found');
  err.status = 404;
  
  return next(err);
});

/**
 * Errors normalization
 */
app.use((err: any, req: Request, res: Response, next: Function) => {
  const status = err.staus || 500;
  
  let stack: string = err.message;
  let message: string = err.stack;
  
  if (message.length > 100) {
    stack = message + (stack ? ('\n\n' + stack) : '');
    message = 'Server Error';
  }
  
  return next({ status, message, stack });
});

/**
 * Development error handler.
 * Print error message with a stacktrace.
 */
app.use((err: any, req: Request, res: Response, next: Function) => {
  return res.status(err.status).send(`
    <h1>${err.message}<h1>
    <h2>${err.status}</h2>
    <pre>${err.stack}</pre>
  `);
}); 
 