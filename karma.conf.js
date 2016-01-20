const path = require('path');
const webpackConfig = require('./webpack.config.js');

const WEBPACK_TESTING_CONFIG = webpackConfig.TESTING_CONFIG;

function getTestPath(args) {
  for (var i = 0; i < args.length; ++i) {
    if (args[i] === '--path--') {
      return path.relative(__dirname, args[i+1] || '');
    }
  }
  return '';
}

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'test/unit.spec.ts'
    ],


    // list of files to exclude
    exclude: [
    ],
    
    client: {
      args: [{
        testPath: getTestPath(process.argv)
      }],
      // other client-side config
      captureConsole: true
    },


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/unit.spec.ts': ['webpack', 'sourcemap']
    },
    
    webpack: WEBPACK_TESTING_CONFIG,

    webpackMiddleware: WEBPACK_TESTING_CONFIG['devServer'],
    
    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['PhantomJS'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
}
