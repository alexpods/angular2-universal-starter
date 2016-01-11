const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;

const ROOT_DIR    = path.resolve(__dirname);
const SRC_DIR     = path.resolve(ROOT_DIR, 'src');
const DIST_DIR    = path.resolve(ROOT_DIR, 'dist');
const PUBLIC_DIR  = path.resolve(DIST_DIR, 'public');
const PRIVATE_DIR = path.resolve(DIST_DIR, 'private');

const nodeModules = fs.readdirSync('./node_modules').filter(function(name) {
  return name != '.bin';
});

const typescriptLoader = {
  test: /\.ts$/,
  loader: 'ts',
  query: {
    'ignoreDiagnostics': [
      2403, // 2403 -> Subsequent variable declarations
      2300, // 2300 -> Duplicate identifier
      2374, // 2374 -> Duplicate number index signature
      2375  // 2375 -> Duplicate string index signature
    ]
  },
  exclude: [
    /node_modules/
  ]
};

const htmlLoader = {
  test: /\.html/,
  loader: 'raw'
};

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
      typescriptLoader,
      htmlLoader
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
      typescriptLoader,
      htmlLoader
    ]
  }
};

module.exports = [clientConfig, serverConfig];