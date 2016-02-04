import * as serveStatic from 'serve-static';
import * as express from 'express';
import { Request, Response } from 'express';
import { router as ngRouter } from './ng';

const app = express();

app.use('/', serveStatic(PUBLIC_DIR));
app.use('/', ngRouter);

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
  const status: number = err.status || 500;

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
