const path = require('path');
const webpack = require('webpack');
const Module = require('module').Module;
const WebpackDevServer = require('webpack-dev-server');
const consts = require('../constants');
const configs = require('../webpack.config.js');

const SERVER_DIRNAME  = consts.PRIVATE_DIR;
const SERVER_FILENAME = path.resolve(SERVER_DIRNAME, consts.MASTER_APP_BUNDLE_NAME + '.js');

const DEV_INDEX_SRC   = '/webpack-dev-server.js';
const DEV_CLIENT_SRC  = 'webpack-dev-server/client?' + consts.HOST + ':' + consts.PORT + '/';

const DEV_INDEX_SCRIPT  = '<script type="text/javascript" src="' + DEV_INDEX_SRC + '"></script>';

const configsList = [configs.MASTER_APP_CONFIG].concat(configs.APPS_CONFIGS);

configsList
  .filter(function filterClientConfigs(config) { 
    return config.target === 'web' 
  })
  .forEach(function addDevClientScript(config) {
    if (typeof config.entry === 'object' && !Array.isArray(config.entry)) {
      Object.keys(config.entry).forEach(function(key) {
        config.entry[key] = [DEV_CLIENT_SRC].concat(config.entry[key])
      });
    } else {
      config.entry = [DEV_CLIENT_SRC].concat(config.entry);    
    }
  });

function runDevServer() {  
  var app;
  
  const compiler = Object.create(webpack(configsList), { outputPath: { value: consts.PUBLIC_DIR }});
  const server = new WebpackDevServer(compiler, configs.DEV_OPTIONS);
  const fileSystem = server.middleware.fileSystem;
  
  function require_(modulePath) {
    if (0 === modulePath.indexOf(consts.DIST_DIR)) {
      const content = fileSystem.readFileSync(modulePath, 'utf8');
      
      const exports_ = {};
      const module_ = { exports:  exports_ };

      // TODO: Replace on vm.runInNewContext when it's possible
      new Function(
        'module', 'exports', 'require',  'process', '__filename',     '__dirname',     content
      )( module_,  exports_,  require_,   process,   SERVER_FILENAME,  SERVER_DIRNAME);
      
      return module_.exports;
    } 
    
    return require(modulePath); 
  }
  
  Object.assign(require_, require);

  compiler.plugin('done', function onCompilationDone() {
    app = require_(SERVER_FILENAME).app;
  });
  
  server.use('/', function proxyApp(req, res, next) {  
    const send_ = res.send;
    
    res.send = function send(content) {
      if (!res.statusCode) {
        res.status(500);
      }
      
      if (res.statusCode >= 400) {
        const tag = ['body', 'head', 'html'].find(function(tag) { return !!~content.indexOf('</' + tag + '>') });
        
        console.log('HERE=>>', res.statusCode, content);
        
        if (tag) {
          content = content.replace('</' + tag + '>', DEV_INDEX_SCRIPT + '$&');
        } else {
          content += DEV_INDEX_SCRIPT;
        }
      }
      
      return send_.call(res, content);
    };

    return app(req, res, next);
  });

  server.listen(consts.PORT, consts.HOST);
}
  
webpack(configs.VENDOR_CONFIG, function(error, stats) {
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
