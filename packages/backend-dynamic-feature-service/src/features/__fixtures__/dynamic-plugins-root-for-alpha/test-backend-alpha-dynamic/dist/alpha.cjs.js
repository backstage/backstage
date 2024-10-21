'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backendPluginApi = require('@backstage/backend-plugin-api');

const testAlphaPlugin = backendPluginApi.createBackendPlugin({
  pluginId: "test-alpha",
  register(env) {
    env.registerInit({
      deps: {
        logger: backendPluginApi.coreServices.rootLogger,
      },
      async init({
        logger,
      }) {
        logger.info("This plugin has been loaded from the alpha package.");
      }
    });
  }
});

exports.default = testAlphaPlugin;
