const { proxySettings } = require('@backstage/plugin-circleci');
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = (/** @type {import('express').Application} */ app) =>
  Object.entries(proxySettings).forEach(([url, settings]) =>
    app.use(url, createProxyMiddleware(settings)),
  );
