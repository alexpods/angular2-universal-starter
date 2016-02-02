const webpack = require('webpack');
const fs      = require('fs');
const path    = require('path');
const consts  = require('./constants');

const DefinePlugin       = webpack.DefinePlugin;
const DllPlugin          = webpack.DllPlugin;
const DllReferencePlugin = webpack.DllReferencePlugin;

const NODE_MODULES = fs.readdirSync(consts.ROOT_DIR + '/node_modules').filter(function(name) {
  return name != '.bin';
});

const SERVER_EXTERNALS = NODE_MODULES.map(function(name) { return new RegExp('^' + name) });

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
  reasons: false,
  errorDetails: false,
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

const RUN_BROWSER_PATH    = path.resolve(consts.SRC_DIR, '.utils/run_browser.ts');
const RUN_WORKER_UI_PATH  = path.resolve(consts.SRC_DIR, '.utils/run_worker_ui.ts');
const RUN_WORKER_APP_PATH = path.resolve(consts.SRC_DIR, '.utils/run_worker_app.ts');

const POLIFILLS = [
  'es6-shim',
  'es6-promise',
  'reflect-metadata',
  'zone.js/dist/zone-microtask',
  'zone.js/dist/long-stack-trace-zone',
];

const CONSTANTS_DEFINE_PLUGIN = new DefinePlugin((function() {
  const stringifiedConstants = {};
  
  Object.keys(consts).forEach(function(constantName) {
    stringifiedConstants['__' + constantName + '__'] = JSON.stringify(consts[constantName]);    
  });

  return stringifiedConstants;
})());

const VENDOR_DLL_REFERENCE_PLUGIN = new DllReferencePlugin({
  context: consts.ROOT_DIR,
  sourceType: 'var',
  get manifest() {
    return require(path.resolve(consts.MANIFESTS_DIR, consts.VENDOR_BUNDLE_NAME + '.json'));
  }
});

const VENDOR_CONFIG = {
  target: 'web',
  entry: {
    [consts.VENDOR_BUNDLE_NAME]: [
      'es6-shim',
      'es6-promise',
      'reflect-metadata',
      'zone.js/dist/zone-microtask',
      'zone.js/dist/long-stack-trace-zone',
      'angular2/core',
      'angular2/router'
    ]
  },
  output: {
    path: consts.PUBLIC_DIR,
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'var'
  },
  plugins: [
    new DllPlugin({
      name: consts.VENDOR_BUNDLE_NAME,
      path: path.resolve(consts.MANIFESTS_DIR, consts.VENDOR_BUNDLE_NAME + '.json')
    })
  ]
};

function createServerConfig(appName, sourcePath) {
  return {
    target: 'node',
    entry: {
      [consts.APPS_SERVER_BUNDLE_NAME]: POLIFILLS.concat(sourcePath)
    },
    output: {
      path: consts.PRIVATE_DIR,
      filename: appName + '-[name].js',
      chunkFilename: appName + '-' + consts.APPS_SERVER_BUNDLE_NAME + '-[id].js',
      library: '[name]',
      libraryTarget: 'commonjs2'
    },
    plugins: [
      VENDOR_DLL_REFERENCE_PLUGIN,
      CONSTANTS_DEFINE_PLUGIN
    ],
    node: {
      __dirname:  true,
      __filename: true
    },
    externals: SERVER_EXTERNALS,
    resolve: {
      extensions: ['', '.ts', '.js']
    },
    module: { 
      loaders: LOADERS
    },
    postcss: POSTCSS
  }; 
}

function createBrowserConfig(appName, sourcePath) {
  return {
    target: 'web',
    entry: {
      [consts.APPS_BROWSER_BUNDLE_NAME]: POLIFILLS.concat(RUN_BROWSER_PATH, sourcePath)
    },
    output: {
      path: consts.PUBLIC_DIR,
      filename: appName + '-[name].js',
      chunkFilename: appName + '-' + consts.APPS_BROWSER_BUNDLE_NAME + '-[id].js',
      library: '[name]',
      libraryTarget: 'var'
    },
    plugins: [
      VENDOR_DLL_REFERENCE_PLUGIN,
      CONSTANTS_DEFINE_PLUGIN
    ],
    resolve: {
      extensions: ['', '.ts', '.js']
    },
    module: {
      loaders: LOADERS
    },
    postcss: POSTCSS
  };
}

function createWorkerUiConfig(appName, sourcePath) {
  return {
    target: 'web',
    entry: {
      [consts.APPS_WORKER_UI_BUNDLE_NAME]: POLIFILLS.concat(RUN_WORKER_UI_PATH, sourcePath)
    },
    output: {
      path: consts.PUBLIC_DIR,
      filename: appName + '-[name].js',
      chunkFilename: appName + '-' + consts.APPS_WORKER_UI_BUNDLE_NAME + '-[id].js',
      library: '[name]',
      libraryTarget: 'var'
    },
    plugins: [
      VENDOR_DLL_REFERENCE_PLUGIN,
      CONSTANTS_DEFINE_PLUGIN
    ],
    resolve: {
      extensions: ['', '.ts', '.js']
    },
    module: {
      loaders: LOADERS
    },
    postcss: POSTCSS
  };
}

function createWorkerAppConfig(appName, sourcePath) {
  return {
    target: 'webworker',
    entry: {
      [consts.APPS_WORKER_APP_BUNDLE_NAME]: POLIFILLS.concat(RUN_WORKER_APP_PATH, sourcePath)
    },
    output: {
      path: consts.PUBLIC_DIR,
      filename: appName + '-[name].js',
      chunkFilename: appName + '-' + consts.APPS_WORKER_APP_BUNDLE_NAME + '-[id].js',
      library: '[name]',
      libraryTarget: 'var'      
    },
    plugins: [
      VENDOR_DLL_REFERENCE_PLUGIN,
      CONSTANTS_DEFINE_PLUGIN
    ],
    resolve: {
      extensions: ['', '.ts', '.js']
    },
    module: {
      loaders: LOADERS
    },
    postcss: POSTCSS
  };
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

const APPS_CONFIGS = [];

consts.APPS.map(function(options) {
  const appName = options.name;
  const appPath = options.path;
  const appDir  = path.dirname(appPath)

  const APP_CONFIGS = require(appPath).createBuilds({
    createServerConfig: function(sourcePath) { 
      return createServerConfig(appName, path.resolve(appDir, sourcePath));
    },
    createBrowserConfig: function(sourcePath) { 
      return createBrowserConfig(appName, path.resolve(appDir, sourcePath));
    },
    createWorkerUiConfig: function(sourcePath) { 
      return createWorkerUiConfig(appName, path.resolve(appDir, sourcePath));
    },
    createWorkerAppConfig: function(sourcePath) { 
      return createWorkerAppConfig(appName, path.resolve(appDir, sourcePath));
    }
  });
  
  [].push.apply(APPS_CONFIGS, APP_CONFIGS);
});

const MASTER_APP_CONFIG = {
  target: 'node',
  entry: {
    [consts.MASTER_APP_BUNDLE_NAME]: POLIFILLS.concat(consts.MASTER_APP_SOURCE_PATH)
  },
  output: {
    path: consts.PRIVATE_DIR,
    filename: '[name].js',
    library: '[name]',
    libraryTarget: 'commonjs2'
  },
  plugins: [].concat(
    CONSTANTS_DEFINE_PLUGIN
  ),
  resolve: {
    extensions: ['', '.ts', '.js']
  },
  module: { 
    loaders: LOADERS
  },
  externals: SERVER_EXTERNALS,
  postcss: POSTCSS
};

exports.VENDOR_CONFIG     = VENDOR_CONFIG;
exports.MASTER_APP_CONFIG = MASTER_APP_CONFIG;
exports.TESTING_CONFIG    = TESTING_CONFIG;

exports.APPS_CONFIGS = APPS_CONFIGS;

exports.STATS_OPTIONS = STATS_OPTIONS;
exports.WATCH_OPTIONS = WATCH_OPTIONS;
exports.DEV_OPTIONS   = DEV_OPTIONS;
