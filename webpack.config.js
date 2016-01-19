const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

const ROOT_DIR    = path.resolve(__dirname);
const SRC_DIR     = path.resolve(ROOT_DIR, 'src');
const DIST_DIR    = path.resolve(ROOT_DIR, 'dist');
const PUBLIC_DIR  = path.resolve(DIST_DIR, 'public');
const PRIVATE_DIR = path.resolve(DIST_DIR, 'private');

function merge(obj1, obj2) {
  obj1 = obj1 || {};
  obj2 = obj2 || {};
  for (var prop in obj2) obj1[prop] = obj2[prop];
  return obj1;
}

const nodeModules = fs.readdirSync('./node_modules').filter(function(name) {
  return name != '.bin';
});

const loaders = {
  ts: function(opts) {
    return {
      test: /\.ts$/,
      loader: 'ts',
      query: merge({
        'ignoreDiagnostics': [
          2403, // 2403 -> Subsequent variable declarations
          2300, // 2300 -> Duplicate identifier
          2374, // 2374 -> Duplicate number index signature
          2375, // 2375 -> Duplicate string index signature,
          2307  // 2307 -> Cannot find module './App.html'. (.html and .css extensions)
        ]
      }, opts && opts.query),
      exclude: [
        /node_modules/
      ]
    };    
  },
  html: function() {
    return {
      test: /\.html$/,
      loader: 'raw'
    };
  },
  css: function() {
    return {
      test: /\.css$/,
      loader: 'raw'
    };
  },
  json: function() {
    return {
      test: /\.json$/,
      loader: 'json'
    };
  }
}

const clientConfig = {
  devtool: 'inline-source-map',
  target: 'web',
  entry: {
    boot_browser: path.resolve(SRC_DIR, 'boot_browser.ts'),
    boot_worker: path.resolve(SRC_DIR, 'boot_worker_render.ts'),
    boot_worker_app: path.resolve(SRC_DIR, 'boot_worker_app.ts'),
    vendor: path.resolve(SRC_DIR, 'vendor.ts'),
  },
  output: {
    path: PUBLIC_DIR,
    filename: '[name].js',
    // if you're changing this field, don't forget to synchronize it with "replaceBootWorkerEnsure()"
    chunkFilename: "[id].chunk.js" 
  },
  plugins: [
    new CommonsChunkPlugin({ name: 'vendor',  minChunks: Infinity }),
    new CommonsChunkPlugin({ name: 'run_browser',     chunks: ['vendor', 'boot_browser'], minChunks: Infinity }),
    new CommonsChunkPlugin({ name: 'run_worker',      chunks: ['vendor', 'boot_worker'], minChunks: Infinity }),
    new CommonsChunkPlugin({ name: 'run_worker_app',  chunks: ['vendor', 'boot_worker_app'], minChunks: Infinity }),
    replaceBootWorkerEnsure()
  ],
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: [
      loaders.ts(),
      loaders.html(),
      loaders.css(),
      loaders.json()
    ]
  }
};

const serverConfig = {
  target: 'node',
  entry: {
    app: path.resolve(SRC_DIR, 'server/boot.ts')
  },
  output: {
    path: PRIVATE_DIR,
    filename: '[name].js',
    libraryTarget: 'commonjs2'
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  externals: [
    nodeModules.map(function(name) { return new RegExp('^' + name) })
  ],
  node: {
    __dirname: true
  },
  module: {
    loaders: [
      loaders.ts(),
      loaders.html(),
      loaders.css(),
      loaders.json()
    ]
  }
};

const testingConfig = {
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: [
      loaders.ts({ query: { transpileOnly: true } }),
      loaders.html(),
      loaders.css(),
      loaders.json()
    ]
  },
  devServer: {
    quiet: true,
    noInfo: true,
  }
}

module.exports = [clientConfig, serverConfig];

module.exports.clientConfig  = clientConfig;
module.exports.serverConfig  = serverConfig;
module.exports.testingConfig = testingConfig;
    
/**
 * TODO: HACK!! Remove it when it's' possible.
 * This is the way to share the same "vendor" chunk amoung browser main thread and
 * web worker thread. I don't want to have two different vendor chunks for each environment.
 * They whould be different only in a name of "webpack" callback: "webpackJsonp"" for main 
 * thred and "webpackChunk" for web workers.
 */
function replaceBootWorkerEnsure() {
  return{ 
    apply(compiler) {
      compiler.plugin('done', function(stats) {
        const chunk = stats.compilation.namedChunks['run_worker'];
        const chunkPath = compiler.outputPath + '/' + chunk.files[0];
        
        // sync doesn't hurt here, 'run_worker' chunk will be compiled only once per watch
        const content = fs.readFileSync(chunkPath, { encoding: 'utf8' });
        
        fs.writeFileSync(chunkPath, content.replace(
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
        `), { encoding: 'utf8' })
      })
    }
  };
}
