const fs = require('fs');
const path =require('path');

const ENV_NG2_SS = process.env._NG2_SS || process.env.NG2_SS || 'true';
const ENV_NG2_WW = process.env._NG2_WW || process.env.NG2_WW || 'true';

exports.ROOT_DIR    = path.resolve(__dirname);

exports.SRC_DIR     = path.resolve(exports.ROOT_DIR, 'src');
exports.DIST_DIR    = path.resolve(exports.ROOT_DIR, 'dist');
exports.PUBLIC_DIR  = path.resolve(exports.DIST_DIR, 'public');
exports.PRIVATE_DIR = path.resolve(exports.DIST_DIR, 'private');
exports.SERVER_DIR  = path.resolve(exports.SRC_DIR, 'server');

exports.HOST = process.env.HOST || 'localhost';
exports.PORT = process.env.PORT || 3000;

exports.SERVER_APP_NAME = 'app.js';
exports.SERVER_APP_DIR  = exports.PRIVATE_DIR;
exports.SERVER_APP_PATH = path.resolve(exports.SERVER_APP_DIR, exports.SERVER_APP_NAME);

exports.HAS_SS = ENV_NG2_SS === 'true';
exports.HAS_WW = ENV_NG2_WW === 'true';

exports.NODE_MODULES = fs.readdirSync(exports.ROOT_DIR + '/node_modules').filter(function(name) {
  return name != '.bin';
});

exports.WORKER_SCRIPTS  = ['run_worker.js',  'vendor.js', 'boot_worker.js'];
exports.BROWSER_SCRIPTS = ['run_browser.js', 'vendor.js', 'boot_browser.js'];

exports.PREBOOT = { 
  appRoot: 'app', 
  freeze:  { name: 'spinner' },
  replay:  'rerender',
  buffer:  true, 
  debug:   true, 
  uglify:  false,
};
