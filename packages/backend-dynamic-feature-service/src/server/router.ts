/*
 * Copyright 2024 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  DiscoveryService,
  LoggerService,
  PluginMetadataService,
} from '@backstage/backend-plugin-api';
import express from 'express';
import { createOpenApiRouter } from '../schema/openapi';
import { DynamicPluginProvider } from '@backstage/backend-dynamic-feature-service';
import { ManifestFileName } from '@module-federation/sdk';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';

export async function createRouter({
  logger,
  discovery,
  metadata,
  dynamicPlugins,
}: {
  logger: LoggerService;
  discovery: DiscoveryService;
  metadata: PluginMetadataService;
  dynamicPlugins: DynamicPluginProvider;
}): Promise<express.Router> {
  const typedRouter = await createOpenApiRouter();

  const externalBaseUrl = await discovery.getExternalBaseUrl(metadata.getId());

  const frontendPluginManifests: {
    [key: string]: string;
  } = {};

  for (const plugin of dynamicPlugins.frontendPlugins()) {
    const pluginScannedPackage = dynamicPlugins.getScannedPackage(plugin);
    const pkgDistLocation = path.resolve(
      url.fileURLToPath(pluginScannedPackage.location),
      'dist',
    );

    const pkgManifestLocation = path.resolve(pkgDistLocation, ManifestFileName);
    if (!fs.existsSync(pkgManifestLocation)) {
      logger.warn(
        `Could not find '${pkgManifestLocation}' for frontend plugin ${plugin.name}@${plugin.version}`,
      );
      continue;
    }

    let moduleName: string | undefined;
    try {
      const pkgManifest = JSON.parse(
        fs.readFileSync(pkgManifestLocation).toString(),
      );
      moduleName = pkgManifest.name;
      if (!moduleName) {
        logger.error(
          `Dynamic frontend plugin module name not found in manifest for plugin ${plugin.name}@${plugin.version}`,
        );
        continue;
      }
    } catch (error) {
      logger.error(
        `Dynamic frontend plugin manifest could not be loaded for plugin ${plugin.name}@${plugin.version}`,
      );
      continue;
    }

    const remoteAssetsPrefix = `/remotes/${plugin.name}`;
    typedRouter.use(remoteAssetsPrefix, express.static(pkgDistLocation));

    logger.info(
      `Exposed dynamic frontend plugin '${plugin.name}' from '${pluginScannedPackage.location}' `,
    );

    frontendPluginManifests[
      plugin.name
    ] = `${externalBaseUrl}/remotes/${plugin.name}/${ManifestFileName}`;
  }

  typedRouter.get('/manifests', (_, res) => {
    res.status(200).json(frontendPluginManifests);
  });

  return typedRouter;
}
