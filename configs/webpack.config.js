const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

const ROOT_DIR    = path.resolve(__dirname, '..');
const SRC_DIR     = path.resolve(ROOT_DIR, 'src');
const DIST_DIR    = path.resolve(ROOT_DIR, 'dist');
const CONFIG_DIR  = path.resolve(ROOT_DIR, 'configs');
const PUBLIC_DIR  = path.resolve(DIST_DIR, 'public');
const PRIVATE_DIR = path.resolve(DIST_DIR, 'private');

const nodeModules = fs.readdirSync(ROOT_DIR + '/node_modules').filter(function(name) {
  return name != '.bin';
});

const typescriptLoader = {
  test: /\.ts$/,
  loader: 'ts',
  query: {
    transpileOnly: true,
    configFileName: path.resolve(CONFIG_DIR, 'tsconfig.json')
  },
  exclude: [
    /node_modules/
  ]
};

const htmlLoader = {
  test: /\.html/,
  loader: 'raw'
};

const browserConfig = {
  target: 'web',
  entry: {
    app: path.resolve(SRC_DIR, 'browser.ts'),
    vendor: [
      'es6-shim',
      'es6-promise',
      'reflect-metadata',
      'zone.js/lib/browser/zone-microtask',
      'zone.js/lib/browser/long-stack-trace-zone',
      'angular2/core',
      'angular2/platform/worker_render'
    ]
  },
  output: {
    path: PUBLIC_DIR,
    filename: '[name]_browser.js'
  },
  plugins: [
    new CommonsChunkPlugin({ name: 'vendor', filename: 'vendor_browser.js', minChunks: Infinity })
  ],
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: [
      typescriptLoader,
      htmlLoader
    ]
  }
};

const workerConfig = {
  target: 'webworker',
  entry: {
    app: path.resolve(SRC_DIR, 'worker.ts'),
  },
  output: {
    path: PUBLIC_DIR,
    filename: '[name]_worker.js'
  },
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: [
      typescriptLoader,
      htmlLoader
    ]
  }
};

const serverConfig = {
  target: 'node',
  entry: {
    app: path.resolve(SRC_DIR, 'server.ts')
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
      typescriptLoader,
      htmlLoader
    ]
  }
};

module.exports = [browserConfig, workerConfig, serverConfig];