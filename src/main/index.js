const fs = require('fs');
const path = require('path');
const express = require('express');
const Router  = express.Router;

exports.createRouter = function($) {
  const router    = Router();
  const indexHtml = fs.readFileSync(path.resolve(__dirname, 'index.html'), { encoding: 'utf8' });
  
  router.get('/*', $.serveUniversal(indexHtml, {
    server:  true,
    browser: true,
    worker:  true
  }));
 
  return router;
}

exports.createBuilds = function($) {
  return [
    $.createServerConfig('./boot_server.ts'),
    $.createBrowserConfig('./boot_browser.ts'),
    $.createWorkerUiConfig('./boot_worker_ui.ts'),
    $.createWorkerAppConfig('./boot_worker_app.ts')
  ];
}
