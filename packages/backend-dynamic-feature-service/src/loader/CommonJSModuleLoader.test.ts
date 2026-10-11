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

import { mockServices } from '@backstage/backend-test-utils';
import path from 'node:path';
import { CommonJSModuleLoader } from './CommonJSModuleLoader';

const nodeModule = require('node:module');

describe('CommonJSModuleLoader', () => {
  const originalNodeModulePaths = nodeModule._nodeModulePaths;
  const originalResolveFilename = nodeModule._resolveFilename;

  afterEach(() => {
    nodeModule._nodeModulePaths = originalNodeModulePaths;
    nodeModule._resolveFilename = originalResolveFilename;
  });

  it('searches the backend package node_modules after the root for dynamic plugins', async () => {
    // The main module of the test process lives in this package, which plays
    // the role of the backend package here.
    const backstageRoot = path.resolve(__dirname, '../../../..');
    const backendNodeModules = path.resolve(__dirname, '../../node_modules');
    const rootNodeModules = `${backstageRoot}/node_modules`;
    const pluginDir = path.resolve(
      backstageRoot,
      'dynamic-plugins-root/my-plugin',
    );
    const hostDir = path.resolve(backstageRoot, 'packages/other/src');

    const loader = new CommonJSModuleLoader({
      logger: mockServices.logger.mock(),
    });
    await loader.bootstrap(backstageRoot, [pluginDir], new Map());

    const pluginPaths: string[] = nodeModule._nodeModulePaths(
      path.resolve(pluginDir, 'dist'),
    );
    expect(pluginPaths.slice(0, 2)).toEqual([
      path.resolve(pluginDir, 'node_modules'),
      rootNodeModules,
    ]);
    expect(pluginPaths).toContain(backendNodeModules);
    expect(pluginPaths.filter(p => p === rootNodeModules)).toHaveLength(1);
    expect(pluginPaths.every(p => p.startsWith(backstageRoot))).toBe(true);

    // Modules outside of the dynamic plugins keep the regular search paths
    expect(nodeModule._nodeModulePaths(hostDir)).toEqual(
      originalNodeModulePaths(hostDir),
    );
  });
});
