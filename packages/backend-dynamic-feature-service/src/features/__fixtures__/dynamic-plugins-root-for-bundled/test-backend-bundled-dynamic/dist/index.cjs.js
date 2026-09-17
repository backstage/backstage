'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

// This require resolves to the bundled proxy copy inside this plugin's
// own node_modules/@backstage/backend-plugin-api, NOT the host's copy.
var backendPluginApi = require('@backstage/backend-plugin-api');

// Triggers the _resolveFilename fallback: require.resolve runs from
// the bundled @backstage/backend-plugin-api whose mod.path is inside
// this plugin's node_modules.
var pkgDir = backendPluginApi.resolvePackagePath('plugin-test-backend-bundled');

const testBundledPlugin = backendPluginApi.createBackendPlugin({
  pluginId: "test-bundled",
  register(env) {
    env.registerInit({
      deps: {
        logger: backendPluginApi.coreServices.rootLogger,
      },
      async init({ logger }) {
        logger.info("Bundled backend plugin loaded successfully");
      }
    });
  }
});

exports.default = testBundledPlugin;
