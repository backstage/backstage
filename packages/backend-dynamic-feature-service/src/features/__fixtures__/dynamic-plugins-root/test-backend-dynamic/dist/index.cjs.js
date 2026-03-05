'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const { dynamicPluginsServiceRef } = require('../../../../../manager');
var backendPluginApi = require('@backstage/backend-plugin-api');
const express = require('express');
const path = require('path');
const url = require('url');

const privateDep = require('private-dep-with-frontend-plugin-index-path');

const someResource = backendPluginApi.resolvePackagePath('plugin-test-backend', 'someResource.txt');

const testPlugin = backendPluginApi.createBackendPlugin({
  pluginId: "test",
  register(env) {
    env.registerInit({
      deps: {
        http: backendPluginApi.coreServices.httpRouter,
        logger: backendPluginApi.coreServices.rootLogger,
        discovery: backendPluginApi.coreServices.discovery,
        dynamicPlugins: dynamicPluginsServiceRef,
        metadata: backendPluginApi.coreServices.pluginMetadata,
      },
      async init({
        http,
        logger,
        discovery,
        dynamicPlugins,
        metadata,
      }) {
        logger.info("This secret value should be hidden by the dynamic-plugin-aware logger: AVerySecretValue");
        const messageFromPrivateDep = privateDep.message;
        logger.info(messageFromPrivateDep);
      }
    });
  }
});

exports.default = testPlugin;
//# sourceMappingURL=alpha.cjs.js.map
