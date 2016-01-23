import * as path from 'path';

const ENV_NG2_SS = process.env._NG2_SS || process.env.NG2_SS || 'true';
const ENV_NG2_WW = process.env._NG2_WW || process.env.NG2_WW || 'true';

export const PORT = process.env.PORT || 3000;

export const PUBLIC_PATH = path.resolve(__dirname, '../../dist/public');
export const INDEX_HTML  = require('../index.html');

export const HAS_SS = ENV_NG2_SS === 'true';
export const HAS_WW = ENV_NG2_WW === 'true';

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

export const PREBOOT = { 
  appRoot: 'app', 
  freeze:  { name: 'spinner' },
  replay:  'rerender',
  buffer:  true, 
  debug:   true, 
  uglify:  false,
};
