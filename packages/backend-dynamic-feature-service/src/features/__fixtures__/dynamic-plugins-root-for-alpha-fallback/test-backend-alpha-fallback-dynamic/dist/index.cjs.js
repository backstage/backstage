'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var backendPluginApi = require('@backstage/backend-plugin-api');

const testAlphaFallbackPlugin = backendPluginApi.createBackendPlugin({
  pluginId: 'test-alpha-fallback',
  register(env) {
    env.registerInit({
      deps: {
        logger: backendPluginApi.coreServices.rootLogger,
      },
      async init({ logger }) {
        logger.info(
          'This plugin has been loaded from the main export after alpha fallback.',
        );
      },
    });
  },
});

exports.default = testAlphaFallbackPlugin;
