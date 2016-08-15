require('core-js/es6/reflect');
require('core-js/es7/reflect');
require('zone.js/dist/zone-node');
require('zone.js/dist/long-stack-trace-zone');

const http = require('http');
const constants = require('../constants');

const HOST = constants.HOST;
const PORT = constants.PORT;

const PRIVATE_DIR = constants.PRIVATE_DIR;
const SERVER_NAME = constants.SERVER_NAME;

const app = require(PRIVATE_DIR + '/' + SERVER_NAME).app;

http.createServer(app).listen(PORT, HOST);
