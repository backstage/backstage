const createProxyMiddleware = require('http-proxy-middleware');

// FIXME: somehow get it from within the plugin itself?
const circleCIProxySettings = {
  '/circleci/api': {
    target: 'https://circleci.com/api/v1.1',
    changeOrigin: true,
    logLevel: 'debug',
    pathRewrite: {
      '^/circleci/api/': '/',
    },
  },
};

module.exports = (/** @type {import('express').Application} */ app) =>
  Object.entries(circleCIProxySettings).forEach(([url, settings]) =>
    app.use(url, createProxyMiddleware(settings)),
  );
