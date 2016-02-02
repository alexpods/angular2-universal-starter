import * as express from 'express';
import * as serveStatic from 'serve-static';
import { Request, Response } from 'express';
import { serveUniversal } from './.utils/serve';

const app = express();

app.use('/', serveStatic(__PUBLIC_DIR__));

__APPS__.forEach((options) => {
  const appName = options.name;
  const appPath = options.path;
  const appUrlPrefix = options.urlPrefix || '/' + appName;
  
  app.use(appUrlPrefix, __non_webpack_require__(appPath).createRouter({
    serveUniversal: (indexHtml, options) => serveUniversal(appName, indexHtml, options)
  }));
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
  const status: number = err.staus || 500;

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

export { app };
