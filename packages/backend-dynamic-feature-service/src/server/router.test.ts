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

  // A fake provider whose frontend plugins and generation the test controls.
  const createProvider = (options: { withGeneration: boolean }) => {
    const state = {
      plugins: [] as FrontendDynamicPlugin[],
      generation: 0,
    };
    const frontendPlugins = jest.fn(() => state.plugins);
    const provider: DynamicPluginProvider = {
      frontendPlugins,
      backendPlugins: () => [],
      plugins: () => state.plugins,
      getScannedPackage: (plugin): ScannedPluginPackage => ({
        location: url.pathToFileURL(mockDir.resolve(plugin.name)),
        manifest: {
          name: plugin.name,
          version: plugin.version,
          main: 'dist/index.cjs.js',
          backstage: { role: plugin.role },
        },
      }),
    };
    if (options.withGeneration) {
      Object.defineProperty(provider, 'frontendPluginsGeneration', {
        get: () => state.generation,
      });
    }
    return { provider, state, frontendPlugins };
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

  it('should rebuild the remotes only when the generation changes', async () => {
    writePluginAssets('plugin-a');
    writePluginAssets('plugin-b');
    const { provider, state, frontendPlugins } = createProvider({
      withGeneration: true,
    });
    state.plugins = [frontendPlugin('plugin-a')];

    const app = await createApp(provider);
    expect(frontendPlugins).toHaveBeenCalledTimes(1);

    expect(await remoteNames(app)).toEqual(['plugin-a']);
    expect(await remoteNames(app)).toEqual(['plugin-a']);
    const assetA = await request(app).get(
      `/remotes/plugin-a/${manifestFileName}`,
    );
    expect(assetA.status).toBe(200);
    expect(frontendPlugins).toHaveBeenCalledTimes(1);

    // A changed plugin list is not picked up until the generation changes.
    state.plugins = [frontendPlugin('plugin-b')];
    expect(await remoteNames(app)).toEqual(['plugin-a']);
    expect(frontendPlugins).toHaveBeenCalledTimes(1);

    state.generation++;
    expect(await remoteNames(app)).toEqual(['plugin-b']);
    expect(await remoteNames(app)).toEqual(['plugin-b']);
    expect(frontendPlugins).toHaveBeenCalledTimes(2);

    const assetB = await request(app).get(
      `/remotes/plugin-b/${manifestFileName}`,
    );
    expect(assetB.status).toBe(200);
    const removedAssetA = await request(app).get(
      `/remotes/plugin-a/${manifestFileName}`,
    );
    expect(removedAssetA.status).toBe(404);
  });

  it('should build the remotes once for a provider without a generation', async () => {
    writePluginAssets('plugin-a');
    const { provider, state, frontendPlugins } = createProvider({
      withGeneration: false,
    });
    state.plugins = [frontendPlugin('plugin-a')];

    const app = await createApp(provider);
    state.plugins = [];

    expect(await remoteNames(app)).toEqual(['plugin-a']);
    expect(await remoteNames(app)).toEqual(['plugin-a']);
    expect(frontendPlugins).toHaveBeenCalledTimes(1);
  });
});
