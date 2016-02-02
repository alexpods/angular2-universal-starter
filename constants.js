const fs = require('fs');
const path = require('path');

exports.ROOT_DIR       = path.resolve(__dirname);
exports.SRC_DIR        = path.resolve(exports.ROOT_DIR, 'src');
exports.DIST_DIR       = path.resolve(exports.ROOT_DIR, 'dist');
exports.PUBLIC_DIR     = path.resolve(exports.DIST_DIR, 'public');
exports.PRIVATE_DIR    = path.resolve(exports.DIST_DIR, 'private');
exports.MANIFESTS_DIR  = path.resolve(exports.DIST_DIR, 'manifests');
exports.SERVER_DIR     = path.resolve(exports.SRC_DIR,  'server');

exports.HOST = process.env.HOST || 'localhost';
exports.PORT = +process.env.PORT || 3000;

exports.SS = 'NG2_SS' in process.env ? process.env.NG2_SS === 'true' : true;
exports.WW = 'NG2_WW' in process.env ? process.env.NG2_WW === 'true' : true;

exports.APPS = [
  { name: 'admin', path: path.resolve(exports.SRC_DIR, 'admin/index.js'), urlPrefix: '/admin' },
  { name: 'main',  path: path.resolve(exports.SRC_DIR, 'main/index.js'),  urlPrefix: '/' }
];

exports.APPS_SERVER_BUNDLE_NAME     = 'server';
exports.APPS_BROWSER_BUNDLE_NAME    = 'browser';
exports.APPS_WORKER_UI_BUNDLE_NAME  = 'worker_ui';
exports.APPS_WORKER_APP_BUNDLE_NAME = 'worker_app';

exports.VENDOR_BUNDLE_NAME = 'vendor';

exports.MASTER_APP_BUNDLE_NAME = 'app';
exports.MASTER_APP_SOURCE_PATH = path.resolve(exports.SRC_DIR, 'app.ts');

exports.PREBOOT = { 
  appRoot: 'app', 
  freeze:  { name: 'spinner' },
  replay:  'rerender',
  buffer:  true, 
  debug:   true, 
  uglify:  false,
};
