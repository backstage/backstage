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

import {
  createMockDirectory,
  mockServices,
} from '@backstage/backend-test-utils';
import express from 'express';
import { AddressInfo } from 'node:net';
import { createAppRemotes } from './appRemotes';

describe('createAppRemotes', () => {
  const mockDir = createMockDirectory();

  it('lists and serves the remotes of the app, reading them again when they change', async () => {
    const logger = mockServices.logger.mock();
    const appRemotes = createAppRemotes({
      remotesDir: mockDir.resolve('remotes'),
      externalBaseUrl: 'http://localhost:7007/dynamic-features',
      logger,
    });
    const app = express().use(appRemotes.router);
    const server = app.listen(0);
    const { port } = server.address() as AddressInfo;
    const get = (path: string) =>
      fetch(`http://localhost:${port}/remotes/${path}`);

    try {
      // The app hasn't been built yet
      expect(appRemotes.list()).toEqual([]);

      const manifest = { pluginId: 'x', deferrable: true };
      mockDir.setContent({
        remotes: {
          'test-plugin-x': {
            'mf-manifest.json': JSON.stringify({
              name: 'test__plugin_x',
              exposes: [{ name: '.', path: '.' }],
            }),
            'backstage-manifest.json': JSON.stringify({
              manifestVersion: 1,
              packageName: '@test/plugin-x',
              role: 'frontend-plugin',
              frontend: { exposedModules: { '.': manifest } },
            }),
            'remoteEntry.js': 'remote entry',
          },
          broken: { 'mf-manifest.json': '{}' },
        },
      });

      // Assets are served even if they are requested before the remotes
      // are listed
      await expect(
        get('@test/plugin-x/remoteEntry.js').then(r => r.text()),
      ).resolves.toBe('remote entry');

      expect(appRemotes.list()).toEqual([
        {
          packageName: '@test/plugin-x',
          remoteInfo: {
            name: 'test__plugin_x',
            entry:
              'http://localhost:7007/dynamic-features/remotes/@test/plugin-x/mf-manifest.json',
          },
          exposedModules: ['.'],
          frontendManifest: {
            manifestVersion: 1,
            exposedModules: { '.': manifest },
          },
        },
      ]);
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('Ignoring the app remote in'),
      );
      await expect(get('@test/plugin-other/remoteEntry.js')).resolves.toEqual(
        expect.objectContaining({ status: 404 }),
      );

      // A remote that is removed by a later build is no longer listed
      mockDir.setContent({ remotes: {} });
      expect(appRemotes.list()).toEqual([]);
    } finally {
      server.close();
    }
  });
});
