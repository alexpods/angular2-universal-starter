const webpack   = require('webpack');
const fs        = require('fs');
const path      = require('path');
const constants = require('./constants');

const DefinePlugin       = webpack.DefinePlugin;
const DllPlugin          = webpack.DllPlugin;
const DllReferencePlugin = webpack.DllReferencePlugin;

const ROOT_DIR    = constants.ROOT_DIR;
const SRC_DIR     = constants.SRC_DIR;
const PUBLIC_DIR  = constants.PUBLIC_DIR;
const PRIVATE_DIR = constants.PRIVATE_DIR;

const VENDOR_NAME     = constants.VENDOR_NAME;
const SERVER_NAME     = constants.SERVER_NAME;
const BROWSER_NAME    = constants.BROWSER_NAME;
const WORKER_NAME     = constants.WORKER_NAME;
const WORKER_APP_NAME = constants.WORKER_APP_NAME;

const SERVER_SOURCE_PATH     = constants.SERVER_SOURCE_PATH;
const BROWSER_SOURCE_PATH    = constants.BROWSER_SOURCE_PATH;
const WORKER_SOURCE_PATH     = constants.WORKER_SOURCE_PATH;
const WORKER_APP_SOURCE_PATH = constants.WORKER_APP_SOURCE_PATH;

const VENDOR_DLL_MANIFEST_FILE = constants.VENDOR_DLL_MANIFEST_FILE;
const VENDOR_DLL_MANIFEST_PATH = constants.VENDOR_DLL_MANIFEST_PATH;

const NODE_MODULES = fs.readdirSync(ROOT_DIR + '/node_modules').filter(function(name) {
  return name != '.bin';
});

const STATS_OPTIONS = {
  colors: {
    level: 2,
    hasBasic: true,
    has256: true,
    has16m: false
  },
  cached: false,
  cachedAssets: false,
  modules: true,
  chunks: false,
  reasons: true,
  errorDetails: true,
  chunkOrigins: false,
  exclude: ['node_modules']
};

const WATCH_OPTIONS = {
  aggregateTimeout: 100,
  poll: undefined
};

const DEV_OPTIONS = {
  contentBase: false,
  queit: false,
  noInfo: false,
  stats: STATS_OPTIONS
};

const LOADERS = [{
  test: /\.ts$/,
  loader: 'ts',
  query: {
    ignoreDiagnostics: [
      2403, // 2403 -> Subsequent variable declarations
      2300, // 2300 -> Duplicate identifier
      2374, // 2374 -> Duplicate number index signature
      2375, // 2375 -> Duplicate string index signature,
      2435,
      2436,
      2502
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
  loaders: ['raw', 'postcss']
}, {
  test: /\.json$/,
  loader: 'json'
}];

const POSTCSS = function() {
  return [
    require('postcss-cssnext')
  ]
}

const DEFINE_CONSTANTS_PLUGIN = new DefinePlugin((function stringifyConstants() {
  const stringifiedConstants = {};

  Object.keys(constants).forEach(function(constantName) {
    stringifiedConstants[constantName] = JSON.stringify(constants[constantName]);
  });

  return stringifiedConstants;
})());

const VENDOR_DLL_REFERENCE_PLUGIN = new DllReferencePlugin({
  context: ROOT_DIR,
  sourceType: 'var',
  get manifest() {
    return require(VENDOR_DLL_MANIFEST_PATH);
  }
});

const VENDOR_CONFIG = {
  target: 'web',
  entry: {
    [VENDOR_NAME]: [
      'core-js/es6/symbol',
      'core-js/es6/object',
      'core-js/es6/function',
      'core-js/es6/parse-int',
      'core-js/es6/parse-float',
      'core-js/es6/number',
      'core-js/es6/math',
      'core-js/es6/string',
      'core-js/es6/date',
      'core-js/es6/array',
      'core-js/es6/regexp',
      'core-js/es6/map',
      'core-js/es6/set',
      'core-js/es6/weak-map',
      'core-js/es6/weak-set',
      'core-js/es6/typed',
      'core-js/es6/reflect',
      'core-js/es7/reflect',
      'zone.js/dist/zone',
      'zone.js/dist/long-stack-trace-zone',
      '@angular/core',
      '@angular/common',
      '@angular/platform-browser',
      '@angular/platform-browser-dynamic',
      '@angular/http',
    ]
  },
  output: {
    path: PUBLIC_DIR,
    filename: '[name].js',
    library: VENDOR_NAME,
    libraryTarget: 'var'
  },
  plugins: [
    new DllPlugin({
      name: VENDOR_NAME,
      path: VENDOR_DLL_MANIFEST_PATH
    })
  ]
};

const BROWSER_CONFIG = {
  target: 'web',
  entry: {
    [BROWSER_NAME]: [
      BROWSER_SOURCE_PATH
    ]
  },
  output: {
    path: PUBLIC_DIR,
    filename: '[name].js',
    chunkFilename: '[id].' + BROWSER_NAME + '.js',
  },
  plugins: [
    VENDOR_DLL_REFERENCE_PLUGIN
  ],
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: LOADERS
  },
  postcss: POSTCSS
};

const WORKER_CONFIG = {
  target: 'web',
  entry: {
    [WORKER_NAME]: [
      WORKER_SOURCE_PATH
    ]
  },
  output: {
    path: PUBLIC_DIR,
    filename: '[name].js',
    chunkFilename: '[id].' + WORKER_NAME + '.js',
  },
  plugins: [
    VENDOR_DLL_REFERENCE_PLUGIN,
    DEFINE_CONSTANTS_PLUGIN,
  ],
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: LOADERS
  },
  postcss: POSTCSS
};

const WORKER_APP_CONFIG = {
  target: 'webworker',
  entry: {
    [WORKER_APP_NAME]: [
      WORKER_APP_SOURCE_PATH
    ]
  },
  output: {
    path: PUBLIC_DIR,
    filename: '[name].js',
    chunkFilename: '[id].' + WORKER_APP_NAME + '.js'
  },
  get plugins() {
    return [
      VENDOR_DLL_REFERENCE_PLUGIN,
      DEFINE_CONSTANTS_PLUGIN,
    ];
  } ,
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: LOADERS
  },
  postcss: POSTCSS
};

const SERVER_CONFIG = {
  target: 'node',
  entry: {
    [SERVER_NAME]: [
      SERVER_SOURCE_PATH
    ]
  },
  output: {
    path: PRIVATE_DIR,
    filename: '[name].js',
    chunkFilename: '[id].' + SERVER_NAME + '.js',
    library: SERVER_NAME,
    libraryTarget: 'commonjs2'
  },
  plugins: [
    DEFINE_CONSTANTS_PLUGIN
  ],
  node: {
    __dirname:  true,
    __filename: true
  },
  externals: [
    NODE_MODULES.map(function(name) { return new RegExp('^' + name) }),
  ],
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: {
    loaders: LOADERS
  },
  postcss: POSTCSS
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

exports = module.exports = [VENDOR_CONFIG, BROWSER_CONFIG, WORKER_CONFIG, WORKER_APP_CONFIG, SERVER_CONFIG];

exports.VENDOR_CONFIG     = VENDOR_CONFIG;
exports.SERVER_CONFIG     = SERVER_CONFIG;
exports.BROWSER_CONFIG    = BROWSER_CONFIG;
exports.WORKER_CONFIG     = WORKER_CONFIG;
exports.WORKER_APP_CONFIG = WORKER_APP_CONFIG;
exports.TESTING_CONFIG    = TESTING_CONFIG;

exports.STATS_OPTIONS = STATS_OPTIONS;
exports.WATCH_OPTIONS = WATCH_OPTIONS;
exports.DEV_OPTIONS   = DEV_OPTIONS;
