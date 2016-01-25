import { Router, Request, Response } from 'express';
import { provide } from 'angular2/core';
import { PlatformLocation, APP_BASE_HREF, ROUTER_PROVIDERS } from 'angular2/router';
import { REQUEST_URL, ServerPlatformLocation } from '../.patches/universal/router';
import { renderComponent } from '../.patches/universal/render';
import { App } from '../app/app';

// TODO: make "constants" to be an external dependency
const { HAS_SS, HAS_WW, PREBOOT, WORKER_SCRIPTS, BROWSER_SCRIPTS } = require('../../constants');

function reduceScripts(content, src) {
  return content + '<script type="text/javascript" src="' + src + '"></script>';
}

const WORKER_SCRIPTS_HTML  = WORKER_SCRIPTS.reduce(reduceScripts, '');
const BROWSER_SCRIPTS_HTML = BROWSER_SCRIPTS.reduce(reduceScripts, '');

const HTML_FILE = require('./ng.html');

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
      console.log('there', HAS_SS);
      if (HAS_SS) {
        console.log('here');
        const REQUEST_PROVIDERS = [
          provide(REQUEST_URL,  { useValue: req.originalUrl })
        ];

        return renderComponent(HTML_FILE, App, [PROVIDERS, REQUEST_PROVIDERS], PREBOOT);
      }
      
      return HTML_FILE;
    })
    .then((rawContent) => {
      const scripts = HAS_WW ? WORKER_SCRIPTS_HTML : BROWSER_SCRIPTS_HTML;
      const content = rawContent.replace('</body>', scripts+ '</body>');
      
      return res.send(content);
    })
    .catch(error => next(error));
});

export { router };
