const fs = require('fs');
const path = require('path');

exports.ROOT_DIR    = path.resolve(__dirname);
exports.SRC_DIR     = path.resolve(exports.ROOT_DIR, 'src');
exports.DIST_DIR    = path.resolve(exports.ROOT_DIR, 'dist');
exports.PUBLIC_DIR  = path.resolve(exports.DIST_DIR, 'public');
exports.PRIVATE_DIR = path.resolve(exports.DIST_DIR, 'private');
exports.SERVER_DIR  = path.resolve(exports.SRC_DIR,  'server');

exports.HOST = process.env.HOST || 'localhost';
exports.PORT = +process.env.PORT || 3000;
exports.PROTOCOL = process.env.PROTOCOL || 'http';

exports.HAS_SS = 'NG2_SS' in process.env ? process.env.NG2_SS === 'true' : true;
exports.HAS_WW = 'NG2_WW' in process.env ? process.env.NG2_WW === 'true' : true;

exports.VENDOR_NAME     = 'vendor';
exports.SERVER_NAME     = 'server';
exports.BROWSER_NAME    = 'browser';
exports.WORKER_NAME     = 'worker';
exports.WORKER_APP_NAME = 'worker_app';

exports.SERVER_SOURCE_PATH     = path.resolve(exports.SRC_DIR, 'server/app.ts');
exports.BROWSER_SOURCE_PATH    = path.resolve(exports.SRC_DIR, 'boot_browser.ts');
exports.WORKER_SOURCE_PATH     = path.resolve(exports.SRC_DIR, 'boot_worker.ts');
exports.WORKER_APP_SOURCE_PATH = path.resolve(exports.SRC_DIR, 'boot_worker_app.ts');

exports.VENDOR_DLL_MANIFEST_FILE = 'vendor-manifest.json';
exports.VENDOR_DLL_MANIFEST_PATH = path.resolve(exports.PUBLIC_DIR, exports.VENDOR_DLL_MANIFEST_FILE);

exports.PREBOOT = {
  appRoot: 'app',
  freeze:  { name: 'spinner' },
  replay:  'rerender',
  buffer:  true,
  debug:   true,
  uglify:  false,
};
