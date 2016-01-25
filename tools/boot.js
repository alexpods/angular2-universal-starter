require('reflect-metadata');
require('zone.js/dist/zone-microtask');
require('zone.js/dist/long-stack-trace-zone');

const http = require('http');
const constants = require('../constants');

const HOST = constants.HOST;
const PORT = constants.PORT;

const SERVER_APP_PATH = constants.SERVER_APP_PATH;

const app = require(SERVER_APP_PATH).app;

http.createServer(app).listen(PORT, HOST);
