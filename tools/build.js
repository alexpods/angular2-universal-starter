const os = require('os');
const webpack = require('webpack');
const configs = require('../webpack.config.js');
const constants = require('../constants');

const EOL = os.EOL;

const SHOULD_WATCH = process.argv.indexOf('--watch') !== -1;

function printStats(stats) {
  process.stdout.write(EOL + stats.toString(configs.STATS_OPTIONS) + EOL);
}

webpack(configs.VENDOR_CONFIG, function(vendorError, vendorStats) {
  if (vendorError) {
    throw vendorError;
  }

  printStats(vendorStats);

  const compiler = webpack([configs.MASTER_APP_CONFIG].concat(configs.APPS_CONFIGS));
  
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
    compiler.watch(configs.WATCH_OPTIONS, onDone);
  } else {
    compiler.run(onDone);
  }
});