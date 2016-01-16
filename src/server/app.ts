import * as path from 'path';
import * as express from 'express';
import * as serveStatic from 'serve-static';
import * as universal from  'angular2-universal-preview';
import { renderComponent } from './render';
import { provide } from 'angular2/core';
import { ROUTER_PROVIDERS, APP_BASE_HREF } from 'angular2/router';
import { App } from '../app/app.ts';

const { SERVER_LOCATION_PROVIDERS, BASE_URL } = <any>universal;

const PUBLIC_PATH = path.resolve(__dirname, '../../dist/public');

const hasSS = 'NG2_SS' in process.env ? process.env.NG2_SS === 'true' : true;
const hasWW = 'NG2_WW' in process.env ? process.env.NG2_WW === 'true' : true;

const indexHtml = require('../index.html');

const workerScripts = `
  <script type="text/javascript" src="run_worker.js"></script>
  <script type="text/javascript" src="vendor.js"></script>
  <script type="text/javascript" src="boot_worker.js"></script>
`;

const browserScripts = `
  <script type="text/javascript" src="run_browser.js"></script>
  <script type="text/javascript" src="vendor.js"></script>
  <script type="text/javascript" src="boot_browser.js"></script>
`;

const app = express();

const providers = [
  ROUTER_PROVIDERS,
  SERVER_LOCATION_PROVIDERS,
  provide(BASE_URL, { useValue: '/' })
];

const preboot = { 
  appRoot: 'app', 
  freeze: { name: 'spinner' },
  replay: 'rerender',
  buffer: true, 
  debug: true, 
  uglify: false 
};

app.use(serveStatic(PUBLIC_PATH));

app.get('/', (req, res, next) => {
  Promise.resolve()
    .then(() => {
      return hasSS
        ? renderComponent(indexHtml, App, providers, preboot)
        : indexHtml
    })
    .then((rawContent) => {
      const scripts = hasWW ? workerScripts : browserScripts;
      const content = rawContent.replace('</body>', scripts+ '</body>');
      return res.send(content);
    })
    .catch(err => next(err));
});

export { app }
