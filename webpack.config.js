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
    browser: path.resolve(SRC_DIR, 'boot_browser.ts'),
    worker: path.resolve(SRC_DIR, 'boot_worker_render.ts'),
    worker_app: path.resolve(SRC_DIR, 'boot_worker_app.ts'),
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
    new CommonsChunkPlugin({ name: 'boot_browser', chunks: ['vendor', 'browser'], minChunks: Infinity }),
    new CommonsChunkPlugin({ name: 'boot_worker', chunks: ['vendor', 'worker'], minChunks: Infinity }),
    new CommonsChunkPlugin({ name: 'boot_worker_app',  chunks: ['vendor', 'worker_app'], minChunks: Infinity }),
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
  devtool: 'inline-source-map',
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
  stats: { 
    colors: true, 
    reasons: true 
  }
}

module.exports = [clientConfig, serverConfig];

module.exports.clientConfig  = clientConfig;
module.exports.serverConfig  = serverConfig;
module.exports.testingConfig = testingConfig;
    
/**
 * TODO: HACK!! Remove it when it becomes possible.
 * This is the way to share the same "vendor" amoung browser main thread and
 * web worker thread. I don't want to have two vendor chunks for each environment
 */
function replaceBootWorkerEnsure() {
  return{ 
    apply(compiler) {
      compiler.plugin('done', function(stats) {
        const chunk = stats.compilation.namedChunks['boot_worker'];
        const chunkPath = compiler.outputPath + '/' + chunk.files[0];
        
        // sync doesn't hurt here, 'boot_worker' chunk will be compiled only once per watch
        const content = fs.readFileSync(chunkPath, { encoding: 'utf8' });
        
        fs.writeFileSync(chunkPath, content.replace(
/__webpack_require__\.e[\s\S]*?head.appendChild\(script\);[\s\/\*]*?\}[\s\/\*]*?\}/
, `
/******/ 	__webpack_require__.e = function requireEnsure(chunkId, callback) {
/******/ 		// "1" is the signal for "already loaded"
/******/ 		if(!installedChunks[chunkId]) {
/******/      var origin = location.origin;
/******/ 			importScripts(origin + "/" + chunkId + ".chunk.js");
/******/ 		}
/******/ 		callback.call(null, __webpack_require__);
/******/ 	};
        `), { encoding: 'utf8' })
      })
    }
  };
}