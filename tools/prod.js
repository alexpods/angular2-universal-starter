const http = require('http');
const consts= require('../constants');

const app = require(consts.PRIVATE_DIR + '/' + consts.MASTER_APP_BUNDLE_NAME).app;

http.createServer(app).listen(consts.PORT, consts.HOST);
