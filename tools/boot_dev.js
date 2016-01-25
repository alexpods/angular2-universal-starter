require('reflect-metadata');
require('zone.js/dist/zone-microtask');
require('zone.js/dist/long-stack-trace-zone');

const ecosystemJson = require('../ecosystem.json');
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfigs = require('../webpack.config');

const constants = require('../constants');
    
const HOST = constants.HOST;
const PORT = constants.PORT;

const ROOT_DIR        = constants.ROOT_DIR;
const SERVER_APP_DIR  = constants.SERVER_APP_DIR;
const SERVER_APP_PATH = constants.SERVER_APP_PATH;

const CLIENT_CONFIG = webpackConfigs.CLIENT_CONFIG;
const SERVER_CONFIG = webpackConfigs.SERVER_CONFIG;
const DEV_CONFIG    = webpackConfigs.DEV_CONFIG;

const CLIENT_SCRIPT  = 'webpack-dev-server/client?' + HOST + ':' + PORT + '/';

if (typeof CLIENT_CONFIG['entry'] === 'object' && !Array.isArray(CLIENT_CONFIG['entry'])) {
  Object.keys(CLIENT_CONFIG['entry']).forEach(function(key) {
    CLIENT_CONFIG['entry'][key] = [CLIENT_SCRIPT].concat(CLIENT_CONFIG['entry'][key])
  });
} else {
  CLIENT_CONFIG['entry'] = [CLIENT_SCRIPT].concat(CLIENT_CONFIG['entry']);    
}

const compiler = Object.create(webpack([CLIENT_CONFIG, SERVER_CONFIG]), { 
  outputPath: {
    configurable: false, 
    writable: false,
    value: CLIENT_CONFIG['output']['path']
  }
});

const server = new WebpackDevServer(compiler, DEV_CONFIG);
const fs = server.middleware.fileSystem;

var app;

compiler.plugin('done', function updateApp() {
  const content = fs.readFileSync(SERVER_APP_PATH, 'utf8');
  
  const exports_ = {};
  const module_ = { exports:  exports_ };

  // TODO: Replace on vm.runInNewContext when it's possible
  new Function(
    'module', 'exports', 'require', 'process', '__filename',     '__dirname',    content
  )( module_,  exports_,  require,   process,   SERVER_APP_PATH, SERVER_APP_DIR );
  
  app = module_.exports.app; 
});

const RUN_SCRIPT_REGEXP = /\<script[^>]+src=['"]run_.+['"][^>]*\>\<\/script\>/;
const WEBPACK_DEV_CLIENT_SCRIPT = '<script type="text/javascript" src="/webpack-dev-server.js"></script>';

server.use('/', function proxyApp(req, res, next) {
  const send_ = res.send;
  res.send = function send(content) {
    if (!RUN_SCRIPT_REGEXP.test(content)) {
      if (~content.indexOf('</body>')) {
        content = content.replace('</body>', WEBPACK_DEV_CLIENT_SCRIPT + '</body>');
      } else {
        content += WEBPACK_DEV_CLIENT_SCRIPT;
      }
    }
    
    return send_.call(this, content);
  };
  
  return app(req, res, next);
});

server.listen(PORT, HOST);


// Shut up enableProdMode() message
// TODO: Think about another way to do it
const log = console.log;
console.log = function(message) {
  if (typeof message === 'string' && message.indexOf('Angular 2 is running') === 0) return;
  return log.apply(this, arguments);
} 
