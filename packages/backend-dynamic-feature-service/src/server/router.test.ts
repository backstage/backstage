/*
 * Copyright 2026 The Backstage Authors
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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import express from 'express';
import request from 'supertest';
import * as url from 'node:url';
import { createRouter } from './router';
import { DynamicPluginProvider, FrontendDynamicPlugin } from '../manager/types';
import { ScannedPluginPackage } from '../scanner';
import { MockedLogger } from '../__testUtils__/testUtils';
import { FrontendRemoteResolvers } from './frontendRemotesServer';

const manifestFileName = 'mf-manifest.json';

describe('createRouter', () => {
  const mockDir = createMockDirectory();

  afterEach(() => {
    mockDir.clear();
  });

  const frontendPlugin = (name: string): FrontendDynamicPlugin => ({
    name,
    version: '0.0.0',
    role: 'frontend-plugin',
    platform: 'web',
  });

  const writePluginAssets = (name: string) => {
    mockDir.addContent({
      [`${name}/dist/${manifestFileName}`]: JSON.stringify({
        name: name.replace(/-/g, '_'),
        metaData: { remoteEntry: { name: 'remoteEntry.js' } },
        exposes: [{ name: '.' }],
      }),
    });
  };

  // A fake provider whose frontend plugins the test controls. Like the real
  // manager, it returns the same plugin objects until the test replaces them.
  const createProvider = () => {
    const state = {
      plugins: [] as FrontendDynamicPlugin[],
    };
    // Called once per plugin each time the router rebuilds its remotes.
    const getScannedPackage = jest.fn(
      (plugin: FrontendDynamicPlugin): ScannedPluginPackage => ({
        location: url.pathToFileURL(mockDir.resolve(plugin.name)),
        manifest: {
          name: plugin.name,
          version: plugin.version,
          main: 'dist/index.cjs.js',
          backstage: { role: plugin.role },
        },
      }),
    );
    const provider: DynamicPluginProvider = {
      frontendPlugins: () => state.plugins,
      backendPlugins: () => [],
      plugins: () => state.plugins,
      getScannedPackage,
    };
    return { provider, state, getScannedPackage };
  };

  const resolvers: FrontendRemoteResolvers = {
    default: {
      assetsPathFromPackage: 'dist',
      manifestFileName,
      getRemoteEntryType: () => 'manifest',
    },
  };

  async function createApp(provider: DynamicPluginProvider) {
    const router = await createRouter({
      logger: new MockedLogger(),
      config: new ConfigReader({
        backend: { baseUrl: 'http://localhost:7007' },
      }),
      dynamicPlugins: provider,
      resolvers,
    });
    return express().use(router);
  }

  const remoteNames = async (app: express.Express) => {
    const response = await request(app).get('/remotes');
    expect(response.status).toBe(200);
    return (response.body as { packageName: string }[]).map(r => r.packageName);
  };

  it('should rebuild the remotes only when the plugin objects change', async () => {
    writePluginAssets('plugin-a');
    writePluginAssets('plugin-b');
    const { provider, state, getScannedPackage } = createProvider();
    const pluginA = frontendPlugin('plugin-a');
    state.plugins = [pluginA];

    const app = await createApp(provider);
    expect(getScannedPackage).toHaveBeenCalledTimes(1);

    expect(await remoteNames(app)).toEqual(['plugin-a']);
    expect(await remoteNames(app)).toEqual(['plugin-a']);
    const assetA = await request(app).get(
      `/remotes/plugin-a/${manifestFileName}`,
    );
    expect(assetA.status).toBe(200);
    // The same plugin objects, even in a new array, are not rebuilt.
    state.plugins = [pluginA];
    expect(await remoteNames(app)).toEqual(['plugin-a']);
    expect(getScannedPackage).toHaveBeenCalledTimes(1);

    // New plugin objects are picked up on the next request, once.
    state.plugins = [frontendPlugin('plugin-b')];
    expect(await remoteNames(app)).toEqual(['plugin-b']);
    expect(await remoteNames(app)).toEqual(['plugin-b']);
    expect(getScannedPackage).toHaveBeenCalledTimes(2);

    const assetB = await request(app).get(
      `/remotes/plugin-b/${manifestFileName}`,
    );
    expect(assetB.status).toBe(200);
    const removedAssetA = await request(app).get(
      `/remotes/plugin-a/${manifestFileName}`,
    );
    expect(removedAssetA.status).toBe(404);
  });

  it('should build the remotes once while the plugin objects never change', async () => {
    writePluginAssets('plugin-a');
    const { provider, state, getScannedPackage } = createProvider();
    state.plugins = [frontendPlugin('plugin-a')];

    const app = await createApp(provider);

    expect(await remoteNames(app)).toEqual(['plugin-a']);
    expect(await remoteNames(app)).toEqual(['plugin-a']);
    expect(getScannedPackage).toHaveBeenCalledTimes(1);
  });
});
