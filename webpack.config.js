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
    boot_worker: path.resolve(SRC_DIR, 'boot_worker_app.ts'),
    boot: path.resolve(SRC_DIR, 'boot_worker_render.ts'),
    vendor: path.resolve(SRC_DIR, 'vendor.ts'),
  },
  output: {
    path: PUBLIC_DIR,
    filename: '[name].js'
  },
  plugins: [
    new CommonsChunkPlugin({ name: 'vendor', filename: 'vendor.js', minChunks: Infinity })
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
  devtool: 'inline-source-map',
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
