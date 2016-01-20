const http = require('http');
const path = require('path');
const constants = require('../constants');

const HOST = constants.HOST;
const PORT = constants.PORT;

const SERVER_APP_PATH = constants.SERVER_APP_PATH;

const app = require(SERVER_APP_PATH).app;

http.createServer(app).listen(PORT, HOST);
