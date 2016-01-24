const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const constants = require('./constants');

const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

const SRC_DIR     = constants.SRC_DIR;
const PUBLIC_DIR  = constants.PUBLIC_DIR;
const PRIVATE_DIR = constants.PRIVATE_DIR;
const SERVER_DIR  = constants.SERVER_DIR;

const SERVER_APP_NAME = constants.SERVER_APP_NAME;

const NODE_MODULES = constants.NODE_MODULES;

const LOADERS = [{
  test: /\.ts$/,
  loader: 'ts',
  query: {
    ignoreDiagnostics: [
      2403, // 2403 -> Subsequent variable declarations
      2300, // 2300 -> Duplicate identifier
      2374, // 2374 -> Duplicate number index signature
      2375, // 2375 -> Duplicate string index signature
    ]
  },
  exclude: [
    /node_modules/
  ]
}, {
  test: /\.html$/,
  loader: 'raw'
}, {
  test: /\.css$/,
  loader: 'raw'
}, {
  test: /\.json$/,
  loader: 'json'
}];

const CLIENT_CONFIG = {
  context: SRC_DIR,
  devtool: 'source-map',
  target: 'web',
  entry: {
    boot_browser:    path.resolve(SRC_DIR, 'boot_browser.ts'),
    boot_worker:     path.resolve(SRC_DIR, 'boot_worker_render.ts'),
    boot_worker_app: path.resolve(SRC_DIR, 'boot_worker_app.ts'),
    vendor:          path.resolve(SRC_DIR, 'vendor.ts'),
  },
  output: {
    path: PUBLIC_DIR,
    filename: '[name].js',
    // if you're changing this field, don't forget to synchronize it with "WorkWithWorkersPlugin"
    chunkFilename: "[id].chunk.js" 
  },
  plugins: [
    new CommonsChunkPlugin({ name: 'vendor',  minChunks: Infinity }),
    new CommonsChunkPlugin({ name: 'run_browser',     chunks: ['vendor', 'boot_browser'],    minChunks: Infinity }),
    new CommonsChunkPlugin({ name: 'run_worker',      chunks: ['vendor', 'boot_worker'],     minChunks: Infinity }),
    new CommonsChunkPlugin({ name: 'run_worker_app',  chunks: ['vendor', 'boot_worker_app'], minChunks: Infinity }),
    WorkWithWorkersPlugin()
  ],
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: LOADERS
  }
};

const SERVER_CONFIG = {
  target: 'node',
  devtool: 'source-map',
  entry: path.resolve(SERVER_DIR, 'app.ts'),
  output: {
    path: PRIVATE_DIR,
    filename: SERVER_APP_NAME,
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  externals: NODE_MODULES.map(function(name) { return new RegExp('^' + name) }),
  node: {
    __dirname: true,
    __filename: true
  },
  module: {
    loaders: LOADERS
  }
};

const TESTING_CONFIG = {
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: LOADERS
  },
  devServer: {
    quiet: true,
    noInfo: true,
  }
};

const DEV_CONFIG = { 
  progress: true,
  contentBase: false, 
  queit: false, 
  noInfo: false,
  stats: {
    colors:  true,
    hash:    true,
    version: false,
    timings: true,
    assets:  true,
    chunks:  false,
    chunkModules: true,
    children: true,
    modules: false, 
    cached: true,
    reasons: true,
    errorDetails: true,
    chunkOrigins: true,    
    modulesSort: true,
    chunksSort: true,
    assetsSort: true,
    context: false,
    source: true
  }
};

exports = module.exports = [CLIENT_CONFIG, SERVER_CONFIG];

exports.CLIENT_CONFIG  = CLIENT_CONFIG;
exports.SERVER_CONFIG  = SERVER_CONFIG;
exports.TESTING_CONFIG = TESTING_CONFIG;
exports.DEV_CONFIG     = DEV_CONFIG;
    
/**
 * TODO: HACK!! Remove it when it's' possible.
 * This is the way to share the same "vendor" chunk amoung browser main thread and
 * web worker thread. I don't want to have two different vendor chunks for each environment.
 * They whould be different only in a name of "webpack" callback: "webpackJsonp"" for main 
 * thred and "webpackChunk" for web workers.
 * Sync doesn't hurt here, 'run_worker_app' chunk will be compiled only once per watch.
 */
function WorkWithWorkersPlugin() {
  return { 
    apply(compiler) {
      compiler.plugin('done', function(stats) {
        var fileSystem = compiler.outputFileSystem;
        
        // TODO: Need to think about a better way to do it
        if (!fileSystem.readFileSync) {
          fileSystem = fs;
        }
        
        const workerChunk = stats.compilation.namedChunks['run_worker_app'];
        const vendorChunk = stats.compilation.namedChunks['vendor'];
        
        if (workerChunk) {
          const workerChunkPath = compiler.outputPath + '/' + workerChunk.files[0];
          const workerContent = fileSystem.readFileSync(workerChunkPath, 'utf8');
          
          fileSystem.writeFileSync(workerChunkPath, workerContent.replace(
/__webpack_require__\.e[\s\S]*?head.appendChild\(script\);[\s\/\*]*?\}[\s\/\*]*?\}/
, `  
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "0" is the signal for "already loaded"
/******/ 		if(installedChunks[chunkId] === 0) {
/******/      return callback.call(null, __webpack_require__);
/******/ 		}
/******/    installedChunks[chunkId] = [callback];
/******/ 		importScripts(location.origin + "/" + chunkId + ".chunk.js");
/******/ 	};
        `), { encoding: 'utf8' });
        }
        
        if (vendorChunk) {
          const vendorChunkPath = compiler.outputPath + '/' + vendorChunk.files[0];
          const vendorContent = fileSystem.readFileSync(vendorChunkPath, 'utf8');
          
          fileSystem.writeFileSync(vendorChunkPath, vendorContent.replace(
            'document.getElementsByTagName("script")' ,
            'typeof document !== "undefined" ? $& : [{ getAttribute: function() { return "" } }]' 
          ), { encoding: 'utf8' });
        }
      })
    }
  };
}
