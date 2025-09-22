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
  LoggerService,
  RootConfigService,
} from '@backstage/backend-plugin-api';
import express from 'express';
import { createOpenApiRouter, spec } from '../schema/openapi/generated';
import { DynamicPluginProvider } from '../manager/types';
import * as fs from 'fs';
import * as path from 'path';
import * as url from 'url';
import { FrontendRemoteResolvers } from './frontendRemotesServer';
import { Remote } from '../schema/openapi/generated/models';
import { JsonObject } from '@backstage/types';

export async function createRouter({
  logger,
  config,
  dynamicPlugins,
  resolvers,
}: {
  logger: LoggerService;
  config: RootConfigService;
  dynamicPlugins: DynamicPluginProvider;
  resolvers: FrontendRemoteResolvers;
}): Promise<express.Router> {
  const externalBaseUrl = `${config.getString('backend.baseUrl')}/${
    spec.info.title
  }`;

  const typedRouter = await createOpenApiRouter();

  const frontendPluginRemotes: Remote[] = [];

  const { default: defaultResolver, provider: resolverProvider } = resolvers;
  for (const plugin of dynamicPlugins.frontendPlugins()) {
    try {
      const pluginScannedPackage = dynamicPlugins.getScannedPackage(plugin);
      const pluginScannedPackagePath = path.resolve(
        url.fileURLToPath(pluginScannedPackage.location),
      );
      const providedResolver = resolverProvider?.for(
        plugin.name,
        pluginScannedPackagePath,
      );

      const assetsPath = path.resolve(
        pluginScannedPackagePath,
        providedResolver?.assetsPathFromPackage ??
          defaultResolver.assetsPathFromPackage,
      );

      const manifestFileName =
        providedResolver?.manifestFileName ?? defaultResolver.manifestFileName;
      const manifestLocation = path.resolve(assetsPath, manifestFileName);
      if (!fs.existsSync(manifestLocation)) {
        logger.error(
          `Could not find manifest '${manifestLocation}' for frontend plugin ${plugin.name}@${plugin.version}`,
        );
        continue;
      }

      let manifest: JsonObject;
      try {
        manifest = JSON.parse(fs.readFileSync(manifestLocation).toString());
      } catch (error) {
        logger.error(
          `Dynamic frontend plugin manifest '${manifestLocation}' could not be parsed for plugin ${plugin.name}@${plugin.version}`,
        );
        continue;
      }

      if (!manifest.name || typeof manifest.name !== 'string') {
        logger.error(
          `Error in manifest '${manifestLocation}' for plugin ${plugin.name}@${plugin.version}: module name not found`,
        );
        continue;
      }
      if (
        !manifest.metaData ||
        typeof manifest.metaData !== 'object' ||
        !('remoteEntry' in manifest.metaData) ||
        !manifest.metaData.remoteEntry ||
        typeof manifest.metaData.remoteEntry !== 'object' ||
        !('name' in manifest.metaData.remoteEntry) ||
        typeof manifest.metaData.remoteEntry.name !== 'string'
      ) {
        logger.error(
          `Could not find remote entry asset in the manifest '${manifestLocation}' for plugin ${plugin.name}@${plugin.version}`,
        );
        continue;
      }

      if (
        !manifest.exposes ||
        !Array.isArray(manifest.exposes) ||
        !manifest.exposes.every<{ name: string }>(
          (i): i is { name: string } =>
            i !== null && typeof i === 'object' && 'name' in i,
        )
      ) {
        logger.error(
          `Could not find the exposes field in the manifest '${manifestLocation}' for plugin ${plugin.name}@${plugin.version}`,
        );
        continue;
      }

      const getAdditionalRemoteInfo =
        providedResolver?.getAdditionalRemoteInfo ??
        providedResolver?.getAdditionaRemoteInfo ??
        defaultResolver.getAdditionalRemoteInfo ??
        defaultResolver?.getAdditionaRemoteInfo;
      const getRemoteEntryType =
        providedResolver?.getRemoteEntryType ??
        defaultResolver.getRemoteEntryType;
      const remoteEntryType = getRemoteEntryType(manifest);

      let remoteEntryAsset = manifestFileName;
      if (remoteEntryType === 'javascript') {
        remoteEntryAsset = manifest.metaData.remoteEntry.name;
      }

      const remoteEntryAssetLocation = path.resolve(
        assetsPath,
        remoteEntryAsset,
      );
      if (!fs.existsSync(remoteEntryAssetLocation)) {
        logger.error(
          `Could not find remote entry asset '${remoteEntryAssetLocation}' for frontend plugin ${plugin.name}@${plugin.version}`,
        );
        continue;
      }

      const remoteAssetsPrefix = `/remotes/${plugin.name}`;
      const remoteEntryPath = `${remoteAssetsPrefix}/${remoteEntryAsset}`;

      const overrideExposedModules =
        providedResolver?.overrideExposedModules ??
        defaultResolver.overrideExposedModules;

      const exposedModules = manifest.exposes.map(e => e.name);

      frontendPluginRemotes.push({
        packageName: plugin.name,
        remoteInfo: {
          name: manifest.name,
          entry: `${externalBaseUrl}${remoteEntryPath}`,
          ...getAdditionalRemoteInfo?.(manifest),
        },
        exposedModules:
          overrideExposedModules?.(exposedModules, manifest) ?? exposedModules,
      });

      const customizeManifest =
        providedResolver?.customizeManifest ??
        defaultResolver.customizeManifest;
      if (remoteEntryType === 'manifest' && customizeManifest) {
        const customizedContent = customizeManifest(manifest);
        typedRouter.use(`${remoteEntryPath}`, (_, res) => {
          res.json(customizedContent);
        });
      }
      typedRouter.use(remoteAssetsPrefix, express.static(assetsPath));
      logger.info(
        `Exposed dynamic frontend plugin '${plugin.name}' from '${assetsPath}' `,
      );
    } catch (error) {
      logger.error(
        `Unexpected error when exposing dynamic frontend plugin '${plugin.name}@${plugin.version}'`,
        error,
      );
      continue;
    }
  }

  logger.info(`/remotes => ${JSON.stringify(frontendPluginRemotes)}`);
  typedRouter.get('/remotes', (_, res) => {
    res.status(200).json(frontendPluginRemotes);
  });

  return typedRouter;
}
