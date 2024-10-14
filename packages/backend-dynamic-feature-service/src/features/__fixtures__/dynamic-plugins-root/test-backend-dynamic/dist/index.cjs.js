'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const { dynamicPluginsServiceRef } = require('../../../../../manager');
var backendPluginApi = require('@backstage/backend-plugin-api');
const express = require('express');
const path = require('path');
const url = require('url');

const privateDep = require('private-dep-with-frontend-plugin-index-path');

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
        const externalBaseUrl = await discovery.getExternalBaseUrl(metadata.getId());
        const router = express.Router();
        const frontendPluginsIndexPath = privateDep.frontendPluginsIndexPath;
        const frontendPluginManifests = Object.fromEntries(dynamicPlugins.frontendPlugins().map(fp => {
          const pluginScannedPackage = dynamicPlugins.getScannedPackage(fp);
          const pkgDistLocation = path.resolve(
            url.fileURLToPath(pluginScannedPackage.location),
            'dist',
          );
          router.use(`/${frontendPluginsIndexPath}/${fp.name}`, express.static(pkgDistLocation))
          return [fp.name, `${externalBaseUrl}/${frontendPluginsIndexPath}/${fp.name}/mf-manifest.json`]
        }));
        router.get(`/${frontendPluginsIndexPath}`, (req, res) => {          
          res.status(200).json(frontendPluginManifests);
        });
        http.use(router);
        http.addAuthPolicy({
          path: `/`,
          allow: 'unauthenticated',
        });

      }
    });
  }
});

exports.default = testPlugin;
//# sourceMappingURL=alpha.cjs.js.map
