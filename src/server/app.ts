declare interface NG2E { (string, Object, Function): any }

import * as path from 'path';
import * as express from 'express';
import * as serveStatic from 'serve-static';
import { ng2engine } from  'angular2-universal-preview';
import { App } from '../app/app.ts';

const PUBLIC_PATH = path.resolve(__dirname, '../../dist/public');
const INDEX_PATH  = path.resolve(__dirname, '../index.html');

const hasSS = 'NG2_SS' in process.env ? process.env.NG2_SS === 'true' : true;
const hasWW = 'NG2_WW' in process.env ? process.env.NG2_WW === 'true' : true;

const indexHtml = require('../index.html');

const workerScripts = `
  <script type="text/javascript" src="boot_worker.js"></script>
  <script type="text/javascript" src="vendor.js"></script>
  <script type="text/javascript" src="worker.js"></script>
`;

const browserScripts = `
  <script type="text/javascript" src="boot_browser.js"></script>
  <script type="text/javascript" src="vendor.js"></script>
  <script type="text/javascript" src="browser.js"></script>
`;


const providers = [
];

const preboot = { 
  appRoot: 'app', 
  freeze: { name: 'spinner' },
  replay: 'rerender',
  buffer: true, 
  debug: true, 
  uglify: false 
};

const app = express();

app.use(serveStatic(PUBLIC_PATH));

app.get('/', (req, res, next) => {
  Promise.resolve()
    .then(() => {
      if (hasSS) {
        return new Promise((resolve, reject) => {
          (<NG2E>ng2engine)(INDEX_PATH, { App, providers, preboot }, (err, content) => err ? reject(err) : resolve(content))
        });
      }
      return indexHtml;
    })
    .then((rawContent) => {
      const scripts = hasWW ? workerScripts : browserScripts;
      const content = rawContent.replace('</body>', scripts+ '</body>');
      return res.send(content);
    })
    .catch(err => next(err));
});

export { app }
