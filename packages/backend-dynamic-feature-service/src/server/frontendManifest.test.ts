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
import { readFrontendManifest } from './frontendManifest';

describe('readFrontendManifest', () => {
  const mockDir = createMockDirectory();

  it('should key the manifests by exposed module, and ignore missing or invalid files', () => {
    const logger = mockServices.logger.mock();
    const read = () =>
      readFrontendManifest({
        assetsPath: mockDir.path,
        mfManifest: {
          exposes: [
            { name: '.', path: '.' },
            { name: 'alpha', path: './alpha' },
            { name: 'beta' },
            { name: 'other', path: './other' },
          ],
        },
        logger,
        pluginName: 'plugin-test',
      });

    mockDir.setContent({});
    expect(read()).toBeUndefined();

    mockDir.setContent({
      'frontend-manifest.json': JSON.stringify({
        manifestVersion: 1,
        entryPoints: {
          '.': { pluginId: 'root' },
          './alpha': { pluginId: 'alpha' },
          './beta': { pluginId: 'beta' },
          './unexposed': { pluginId: 'unexposed' },
        },
      }),
    });
    expect(read()).toEqual({
      manifestVersion: 1,
      exposedModules: {
        '.': { pluginId: 'root' },
        alpha: { pluginId: 'alpha' },
        beta: { pluginId: 'beta' },
      },
    });

    mockDir.setContent({ 'frontend-manifest.json': '{' });
    expect(read()).toBeUndefined();
    mockDir.setContent({
      'frontend-manifest.json': JSON.stringify({ entryPoints: [] }),
    });
    expect(read()).toBeUndefined();
    expect(logger.warn).toHaveBeenCalledTimes(2);
  });
});
