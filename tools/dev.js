require('reflect-metadata');
require('zone.js/dist/zone-node');
require('zone.js/dist/long-stack-trace-zone');

const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
var MemoryFileSystem = require("memory-fs");
const constants = require('../constants');
const configs = require('../webpack.config.js');

const HOST = constants.HOST;
const PORT = constants.PORT;
const PROTOCOL = constants.PROTOCOL;

const HAS_WW = constants.HAS_WW;

const SERVER_NAME = constants.SERVER_NAME;
const PRIVATE_DIR = constants.PRIVATE_DIR;
const PUBLIC_DIR  = constants.PUBLIC_DIR;

const VENDOR_CONFIG     = configs.VENDOR_CONFIG;
const SERVER_CONFIG     = configs.SERVER_CONFIG;
const BROWSER_CONFIG    = configs.BROWSER_CONFIG;
const WORKER_CONFIG     = configs.WORKER_CONFIG;
const WORKER_APP_CONFIG = configs.WORKER_APP_CONFIG;

const DEV_OPTIONS = configs.DEV_OPTIONS;

const SERVER_DIRNAME  = PRIVATE_DIR;
const SERVER_FILENAME = path.resolve(SERVER_DIRNAME, SERVER_NAME + '.js');

const DEV_INDEX_SRC   = '/webpack-dev-server.js';
const DEV_CLIENT_SRC  = 'webpack-dev-server/client?'+ PROTOCOL + '://' + HOST + ':' + PORT + '/';

const DEV_INDEX_SCRIPT  = '<script type="text/javascript" src="' + DEV_INDEX_SRC + '"></script>';

function addDevClientScript(config) {
  if (typeof config.entry === 'object' && !Array.isArray(config.entry)) {
    Object.keys(config.entry).forEach(function(key) {
      config.entry[key] = [DEV_CLIENT_SRC].concat(config.entry[key])
    });
  } else {
    config.entry = [DEV_CLIENT_SRC].concat(config.entry);
  }
}

const configsList = [SERVER_CONFIG];

if (HAS_WW) {
  addDevClientScript(WORKER_CONFIG);
  configsList.push(WORKER_CONFIG, WORKER_APP_CONFIG);
} else {
  addDevClientScript(BROWSER_CONFIG);
  configsList.push(BROWSER_CONFIG);
}

function recompileApp(content) {
  const exports_ = {};
  const module_ = { exports:  exports_ };

  // TODO: Replace on vm.runInNewContext when it's possible
  new Function(
    'module', 'exports', 'require', 'process', '__filename',     '__dirname',     content
  )( module_,  exports_,  require,   process,   SERVER_FILENAME,  SERVER_DIRNAME);

  return module_.exports.app;
}

function runDevServer() {
  var app;

  const compiler = Object.create(webpack(configsList), { outputPath: { value: PUBLIC_DIR }});
  const server = new WebpackDevServer(compiler, DEV_OPTIONS);

  compiler.plugin('done', function onCompilationDone() {
    app = recompileApp(server.middleware.fileSystem.readFileSync(SERVER_FILENAME, 'utf8'));
  });

  server.use('/', function proxyApp(req, res, next) {
    const send_ = res.send;

    res.send = function send(content) {
      if (res.statusCode >= 400) {
        const tag = ['body', 'head', 'html'].find(function(tag) { return !!~content.indexOf('</' + tag + '>') });

        if (tag) {
          content = content.replace('</' + tag + '>', DEV_INDEX_SCRIPT + '$&');
        } else {
          content += DEV_INDEX_SCRIPT;
        }
      }

      return send_.call(this, content);
    };

    return app(req, res, next);
  });

  server.listen(PORT, HOST);
}

webpack(VENDOR_CONFIG, function(error, stats) {
  if (error) {
    throw error;
  }

  runDevServer();
});


// Shut up enableProdMode() message
// TODO: Think about another way to do it
const log = console.log;
console.log = function(message) {
  if (typeof message === 'string' && message.indexOf('Angular 2 is running') === 0) return;
  return log.apply(this, arguments);
}
