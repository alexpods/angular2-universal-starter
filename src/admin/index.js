const fs = require('fs');
const path = require('path');
const express = require('express');
const basicAuth = require('basic-auth-connect');
const Router  = express.Router;

exports.createRouter = function($) {
  const router    = Router();
  const indexHtml = fs.readFileSync(path.resolve(__dirname, 'index.html'), { encoding: 'utf8' });
  
  router.use(basicAuth('user', 'pass'));
  
  router.get('/*', $.serveUniversal(indexHtml, {
    browser: true,
  }));
 
  return router;
}

exports.createBuilds = function($) {
  return [
    $.createBrowserConfig('./boot_browser.ts'),
  ];
}
