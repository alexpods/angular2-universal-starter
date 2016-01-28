const os = require('os');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const Linter = require('tslint');
const chokidar = require('chokidar');
const constants = require('../constants');
const tslintJson = require('../tslint.json');

const EOL = os.EOL;

const SRC_DIR = constants.SRC_DIR;
const SUCCESS_MESSAGE = 'TSLint: Everything is OK';

const SHOULD_WATCH = process.argv.indexOf('--watch') !== -1;

const watcher = chokidar.watch([
  SRC_DIR + '/**/*.ts'
], { 
  persistent: true 
});

var isReady = false;
var readyPromises = [];
var failedFiles = {};
var failedFilesCount = 0;

function logSuccess(done) {
  process.stdout.write(EOL + chalk.green(SUCCESS_MESSAGE + EOL), done);
}

function logFailedFiles(done) {
  var output = '';
  
  for (var path in failedFiles) {
    var failedFile = failedFiles[path];
    
    if (failedFile) {
      output += EOL + chalk.red(failedFile.output);
    }
  }
  
  process.stdout.write(output, done);
}

function lintFile(path, contents) {
  const linter = new Linter(path, contents, {
    formatter: 'prose',
    configuration: tslintJson
  });

  const results = linter.lint();

  if (results.failureCount) {
    if (!failedFiles[path]) { 
      failedFilesCount++;
    }
    
    failedFiles[path] = results;
    
    process.stdout.write(EOL + chalk.red(results.output));
  } else {
    if (failedFiles[path]) { 
      failedFilesCount--;
    }
    
    failedFiles[path] = false;

    process.stdout.write(chalk.green(path) + EOL);
    
    if (isReady) {
      if (failedFilesCount) {
        logFailedFiles();
      } else {
        logSuccess();
      }
    }
  }
}

function checkFile(path) {
  return new Promise(function(resolve, reject) {
    fs.readFile(path, 'utf8', function(error, contents) {
      if (error) {
        return reject(error);
      }
      
      lintFile(path, contents);
      
      return resolve();
    });
  });
}

function ensureExit() {
  if (!SHOULD_WATCH) {
    process.exit(failedFilesCount ? 2 : 0);
  }
}

function onChange(path) {
  const promise = checkFile(path);
  
  if (isReady === false) {
    readyPromises.push(promise);
  }
}

function onRemove(path) {
  if (failedFiles[path]) {
    failedFiles[path] = false;
    failedFilesCount++;
  }
}

function onReady() {
  Promise.all(readyPromises).then(function() {
    isReady = true;
    readyPromises = [];
    
    if (failedFilesCount === 0) {
      return logSuccess(ensureExit);
    } else {
      return ensureExit();
    }
  });
}


watcher.on('add', onChange);
watcher.on('change', onChange);
watcher.on('remove', onRemove);
watcher.on('ready', onReady);
