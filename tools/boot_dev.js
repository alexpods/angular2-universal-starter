const ecosystemJson = require('../ecosystem.json');
const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const webpackConfigs = require('../webpack.config');

process.env.NG2_SS = process.env.NG2_SS || ecosystemJson.env.NG2_SS;
process.env.NG2_WW = process.env.NG2_WW || ecosystemJson.env.NG2_WW;

const constants = require('../constants');
    
const HOST = constants.HOST;
const PORT = constants.PORT;

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

server.use('/', function proxyApp(req, res, next) {
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
