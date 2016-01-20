const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const constants = require('../constants');
const webpackConfigs = require('../webpack.config');

const HOST = constants.HOST;
const PORT = constants.PORT;

const CLIENT_CONFIG = webpackConfigs.CLIENT_CONFIG;
const SERVER_CONFIG = webpackConfigs.SERVER_CONFIG;

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
    writable:     false,
    value: CLIENT_CONFIG['output']['path']
  }
});

const server = new WebpackDevServer(compiler, { contentBase: false, queit: true, noInfo: true });

const SERVER_APP_DIR  = path.resolve(SERVER_CONFIG['output']['path']);
const SERVER_APP_PATH = path.resolve(SERVER_APP_DIR, SERVER_CONFIG['output']['filename']);

const fs = server.middleware.fileSystem;

var app = null;

function updateApp() {
  const content = fs.readFileSync(SERVER_APP_PATH, 'utf8');
  const _exports = {};
  const _module = { exports:  {} };

  // TODO: Replace on vm.runInNewContext when it's possible
  new Function(
    'module',  'exports', 'require', 'process', '__filename',      '__dirname',   content
  )(  _module,   _exports,  require,   process,   SERVER_APP_PATH,  SERVER_APP_DIR );
  
  app = _module.exports.app; 
}

function proxyApp(req, res, next) {
  return app(req, res, next);
}

compiler.plugin('done', updateApp);
server.use('/', proxyApp);

server.listen(PORT, HOST);
