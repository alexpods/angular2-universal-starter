import * as serveStatic from 'serve-static';
import * as express from 'express';
import { provide } from 'angular2/core';
import { Request, Response } from 'express';
import { REQUEST_URL } from './.universal/router';
import { renderComponent } from './.universal/render';
import { App } from '../app/app.ts';
import { HAS_SS, HAS_WW, INDEX_HTML, PROVIDERS, PREBOOT, WORKER_SCRIPTS, BROWSER_SCRIPTS, PUBLIC_PATH } from './const';

export const app = express();

app.use(serveStatic(PUBLIC_PATH));

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

        return renderComponent(INDEX_HTML, App, [PROVIDERS, REQUEST_PROVIDERS], PREBOOT);
      }
      
      return INDEX_HTML;
    })
    .then((rawContent) => {
      const scripts = HAS_WW ? WORKER_SCRIPTS : BROWSER_SCRIPTS;
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
 * Development error handler.
 * Print error message with a stacktrace.
 */
app.use((err: any, req: Request, res: Response, next: Function) => {
  const status:  number = err.status || 500;

  let stack: string;
  let message: string;
  
  if (err.message.length < 100) {
    message = err.message;
    stack = err.stack;
  } else {
    message = 'Server Error';
    stack = err.message + '\n\n' + err.stack;
  }
  
  return res.status(status).send(`
    <h1>${message}<h1>
    <h2>${status}</h2>
    <pre>${stack}</pre>
  `);
});
