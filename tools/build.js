const os = require('os');
const webpack = require('webpack');
const configs = require('../webpack.config.js');
const constants = require('../constants');

const EOL = os.EOL;

const VENDOR_CONFIG     = configs.VENDOR_CONFIG;
const SERVER_CONFIG     = configs.SERVER_CONFIG;
const BROWSER_CONFIG    = configs.BROWSER_CONFIG;
const WORKER_CONFIG     = configs.WORKER_CONFIG;
const WORKER_APP_CONFIG = configs.WORKER_APP_CONFIG;

const STATS_OPTIONS = configs.STATS_OPTIONS;
const WATCH_OPTIONS = configs.WATCH_OPTIONS;

const SHOULD_WATCH = process.argv.indexOf('--watch') !== -1;

function printStats(stats) {
  process.stdout.write(EOL + stats.toString(STATS_OPTIONS) + EOL);
}

webpack(VENDOR_CONFIG, function(vendorError, vendorStats) {
  if (vendorError) {
    throw vendorError;
  }

  printStats(vendorStats);

  const compiler = webpack([SERVER_CONFIG, BROWSER_CONFIG, WORKER_CONFIG, WORKER_APP_CONFIG]);
  
  function onInvalid() {
    console.info('webpack: bundle is now INVALID');
  }

  function onDone(projectError, projectStats) {
    if (projectError) {
      throw projectError;
    }
    
    printStats(projectStats);

    console.info('webpack: bundle is now VALID');
  }
  
  compiler.plugin('invalid',  onInvalid);

  if (SHOULD_WATCH) {
    compiler.watch(WATCH_OPTIONS, onDone);
  } else {
    compiler.run(onDone);
  }
});