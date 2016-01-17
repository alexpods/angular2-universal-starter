import * as path from 'path';
import * as universal from  'angular2-universal-preview';
import { provide } from 'angular2/core';
import { ROUTER_PROVIDERS, APP_BASE_HREF } from 'angular2/router';

const { SERVER_LOCATION_PROVIDERS, BASE_URL } = <any>universal;

export const PORT = process.env.PORT || 3000;

export const PUBLIC_PATH = path.resolve(__dirname, '../../dist/public');
export const INDEX_HTML  = require('../index.html');

export const HAS_SS = 'NG2_SS' in process.env ? process.env.NG2_SS === 'true' : true;
export const HAS_WW = 'NG2_WW' in process.env ? process.env.NG2_WW === 'true' : true;

export const WORKER_SCRIPTS = `
  <script type="text/javascript" src="run_worker.js"></script>
  <script type="text/javascript" src="vendor.js"></script>
  <script type="text/javascript" src="boot_worker.js"></script>
`;

export const BROWSER_SCRIPTS = `
  <script type="text/javascript" src="run_browser.js"></script>
  <script type="text/javascript" src="vendor.js"></script>
  <script type="text/javascript" src="boot_browser.js"></script>
`;

export const PROVIDERS = [
  ROUTER_PROVIDERS,
  SERVER_LOCATION_PROVIDERS,
  provide(BASE_URL, { useValue: '/' }),
];

export const PREBOOT = { 
  appRoot: 'app', 
  freeze:  { name: 'spinner' },
  replay:  'rerender',
  buffer:  true, 
  debug:   true, 
  uglify:  false,
};
