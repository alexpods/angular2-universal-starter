const fs = require('fs');
const path = require('path');

exports.ROOT_DIR    = path.resolve(__dirname);
exports.SRC_DIR     = path.resolve(exports.ROOT_DIR, 'src');
exports.DIST_DIR    = path.resolve(exports.ROOT_DIR, 'dist');
exports.PUBLIC_DIR  = path.resolve(exports.DIST_DIR, 'public');
exports.PRIVATE_DIR = path.resolve(exports.DIST_DIR, 'private');
exports.SERVER_DIR  = path.resolve(exports.SRC_DIR, 'server');

exports.HOST = process.env.HOST || 'localhost';
exports.PORT = +process.env.PORT || 3000;

exports.HAS_SS = 'NG2_SS' in process.env ? process.env.NG2_SS === 'true' : true;
exports.HAS_WW = 'NG2_WW' in process.env ? process.env.NG2_WW === 'true' : true;

exports.SERVER_APP_NAME = 'app.js';
exports.SERVER_APP_DIR  = exports.PRIVATE_DIR;
exports.SERVER_APP_PATH = path.resolve(exports.SERVER_APP_DIR, exports.SERVER_APP_NAME);

exports.NODE_MODULES = fs.readdirSync(exports.ROOT_DIR + '/node_modules').filter(function(name) {
  return name != '.bin';
});

exports.PREBOOT = { 
  appRoot: 'app', 
  freeze:  { name: 'spinner' },
  replay:  'rerender',
  buffer:  true, 
  debug:   true, 
  uglify:  false,
};
