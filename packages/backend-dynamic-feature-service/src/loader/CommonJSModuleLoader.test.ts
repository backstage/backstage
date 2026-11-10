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
import fs from 'node:fs';
import path from 'node:path';
import { CommonJSModuleLoader } from './CommonJSModuleLoader';

// This is the copy of the module that Jest gives to tests, so changes to it
// do not affect how Node.js resolves modules
const nodeModule = require('node:module');

describe('CommonJSModuleLoader', () => {
  const originalNodeModulePaths = nodeModule._nodeModulePaths;
  const originalResolveFilename = nodeModule._resolveFilename;
  const originalGlobalPaths = nodeModule.globalPaths;
  const main = require.main!;
  const mainFilename = main.filename;
  const argv = process.argv;

  afterEach(() => {
    nodeModule._nodeModulePaths = originalNodeModulePaths;
    nodeModule._resolveFilename = originalResolveFilename;
    nodeModule.globalPaths = originalGlobalPaths;
    main.filename = mainFilename;
    process.argv = argv;
    jest.restoreAllMocks();
  });

  it('searches the root node_modules and the global folders before the host for dynamic plugins', async () => {
    const backstageRoot = path.resolve(__dirname, '../../../..');
    // The host is found through the main module, the script path, the
    // working directory, and the location of the loader itself. An entry
    // point in an installed package, such as a process manager that starts
    // the backend, is not the backend package.
    const wrapperEntry = path.join(
      backstageRoot,
      'node_modules/typescript/lib/tsc.js',
    );
    const backendEntry = path.join(
      backstageRoot,
      'packages/backend/src/index.ts',
    );
    const workingDir = path.join(
      backstageRoot,
      'packages/backend-dynamic-feature-service/src/scanner',
    );
    for (const startPath of [wrapperEntry, backendEntry, workingDir]) {
      expect(fs.existsSync(startPath)).toBe(true);
    }
    main.filename = wrapperEntry;
    process.argv = [argv[0], backendEntry];
    jest.spyOn(process, 'cwd').mockReturnValue(workingDir);
    const hostNodeModules = [
      path.join(backstageRoot, 'packages/backend/src/node_modules'),
      path.join(
        backstageRoot,
        'packages/backend-dynamic-feature-service/src/scanner/node_modules',
      ),
      path.join(__dirname, 'node_modules'),
    ];
    const wrapperNodeModules = [
      path.join(backstageRoot, 'node_modules/typescript/lib/node_modules'),
      path.join(backstageRoot, 'node_modules/typescript/node_modules'),
    ];
    const rootNodeModules = path.join(backstageRoot, 'node_modules');
    const customNodeModules = path.resolve(
      backstageRoot,
      '../custom/node_modules',
    );
    const pluginDir = path.resolve(
      backstageRoot,
      'dynamic-plugins-root/my-plugin',
    );
    // Dynamic plugins outside of the root reach the root through NODE_PATH
    const outsidePluginDir = path.resolve(
      backstageRoot,
      '../outside-dynamic-plugins/my-plugin',
    );
    const hostDir = path.resolve(backstageRoot, 'packages/other/src');
    // The global folders start with the NODE_PATH entries
    nodeModule.globalPaths = [customNodeModules, rootNodeModules];

    const loader = new CommonJSModuleLoader({
      logger: mockServices.logger.mock(),
    });
    await loader.bootstrap(
      backstageRoot,
      [pluginDir, outsidePluginDir],
      new Map(),
    );

    const pluginPaths: string[] = nodeModule._nodeModulePaths(
      path.resolve(pluginDir, 'dist'),
    );
    expect(pluginPaths.slice(0, 3)).toEqual([
      path.resolve(pluginDir, 'node_modules'),
      rootNodeModules,
      customNodeModules,
    ]);
    const outsidePluginPaths: string[] = nodeModule._nodeModulePaths(
      path.resolve(outsidePluginDir, 'dist'),
    );
    expect(outsidePluginPaths.slice(0, 3)).toEqual([
      path.resolve(outsidePluginDir, 'node_modules'),
      customNodeModules,
      rootNodeModules,
    ]);
    for (const paths of [pluginPaths, outsidePluginPaths]) {
      expect(paths).toEqual(expect.arrayContaining(hostNodeModules));
      for (const wrapperPath of wrapperNodeModules) {
        expect(paths).not.toContain(wrapperPath);
      }
      expect(paths.filter(p => p === rootNodeModules)).toHaveLength(1);
      expect(paths.slice(3).every(p => p.startsWith(backstageRoot))).toBe(true);
    }

    // Modules outside of the dynamic plugins keep the regular search paths
    expect(nodeModule._nodeModulePaths(hostDir)).toEqual(
      originalNodeModulePaths(hostDir),
    );
  });

  it('uses the main module as the backend package and searches the root after the global folders', async () => {
    const backstageRoot = path.resolve(__dirname, '../../../..');
    // A process manager can set the script path to its own entry point, which
    // leaves the main module as the only way to find the backend package
    const backendEntry = path.join(
      backstageRoot,
      'packages/backend/src/index.ts',
    );
    const wrapperEntry = path.join(
      backstageRoot,
      'node_modules/typescript/lib/tsc.js',
    );
    for (const startPath of [backendEntry, wrapperEntry]) {
      expect(fs.existsSync(startPath)).toBe(true);
    }
    main.filename = backendEntry;
    process.argv = [argv[0], wrapperEntry];
    jest.spyOn(process, 'cwd').mockReturnValue(backstageRoot);
    const rootNodeModules = path.join(backstageRoot, 'node_modules');
    const customNodeModules = path.resolve(
      backstageRoot,
      '../custom/node_modules',
    );
    const outsidePluginDir = path.resolve(
      backstageRoot,
      '../outside-dynamic-plugins/my-plugin',
    );
    // NODE_PATH does not include the root
    nodeModule.globalPaths = [customNodeModules];

    const loader = new CommonJSModuleLoader({
      logger: mockServices.logger.mock(),
    });
    await loader.bootstrap(backstageRoot, [outsidePluginDir], new Map());

    const paths: string[] = nodeModule._nodeModulePaths(
      path.resolve(outsidePluginDir, 'dist'),
    );
    expect(paths.slice(0, 4)).toEqual([
      path.resolve(outsidePluginDir, 'node_modules'),
      customNodeModules,
      rootNodeModules,
      path.join(backstageRoot, 'packages/backend/src/node_modules'),
    ]);
    expect(paths).not.toContain(
      path.join(backstageRoot, 'node_modules/typescript/lib/node_modules'),
    );
  });

  it('resolves the modules of dynamic plugins through Node.js', async () => {
    const pluginSource =
      'exports.resolve = request => require.resolve(request);';
    const mockDir = createMockDirectory({
      content: {
        'project/node_modules/test-root-only/index.js': '',
        'project/node_modules/test-shared/index.js': '',
        'project/packages/backend/node_modules/test-shared/index.js': '',
        'project/packages/backend/node_modules/test-backend-only/index.js': '',
        'project/dynamic-plugins-root/plugin/index.js': pluginSource,
        'outside/plugin/index.js': pluginSource,
        'custom/node_modules/test-shared/index.js': '',
        // A dynamic plugin with its own copy of @backstage/backend-plugin-api,
        // and a static copy of the same plugin in the backend package
        'project/dynamic-plugins-root/test-plugin-dynamic/package.json':
          JSON.stringify({ name: 'test-plugin-dynamic' }),
        'project/dynamic-plugins-root/test-plugin-dynamic/node_modules/@backstage/backend-plugin-api/index.js':
          'exports.resolvePackageJson = name => require.resolve(`${name}/package.json`);',
        'project/packages/backend/node_modules/test-plugin/package.json': '{}',
        'project/packages/backend/node_modules/test-backend-only/package.json':
          '{}',
      },
    });
    const baseDir = fs.realpathSync(mockDir.path);
    const backstageRoot = path.join(baseDir, 'project');
    const rootNodeModules = path.join(backstageRoot, 'node_modules');
    const backendNodeModules = path.join(
      backstageRoot,
      'packages/backend/node_modules',
    );
    const customNodeModules = path.join(baseDir, 'custom/node_modules');
    const pluginDir = path.join(backstageRoot, 'dynamic-plugins-root/plugin');
    const outsidePluginDir = path.join(baseDir, 'outside/plugin');
    const testPluginDir = path.join(
      backstageRoot,
      'dynamic-plugins-root/test-plugin-dynamic',
    );

    jest
      .spyOn(process, 'cwd')
      .mockReturnValue(path.join(backstageRoot, 'packages/backend'));

    const loader = new CommonJSModuleLoader({
      logger: mockServices.logger.mock(),
    });
    // Use the module that Node.js resolves with, and restore it afterwards
    const realNodeModule = await loader.load('node:module');
    const realNodeModulePaths = realNodeModule._nodeModulePaths;
    const realResolveFilename = realNodeModule._resolveFilename;
    const realGlobalPaths = realNodeModule.globalPaths;
    (loader as any).module = realNodeModule;
    try {
      realNodeModule.globalPaths = [customNodeModules, rootNodeModules];
      await loader.bootstrap(
        backstageRoot,
        [pluginDir, outsidePluginDir, testPluginDir],
        new Map([[testPluginDir, { name: 'test-plugin-dynamic' } as any]]),
      );
      const plugin = await loader.load(pluginDir);
      const outsidePlugin = await loader.load(outsidePluginDir);
      const bundledBackendPluginApi = await loader.load(
        path.join(testPluginDir, 'node_modules/@backstage/backend-plugin-api'),
      );

      // The root comes first, then the global folders, and the backend
      // package last
      expect(plugin.resolve('test-shared')).toBe(
        path.join(rootNodeModules, 'test-shared/index.js'),
      );
      expect(outsidePlugin.resolve('test-shared')).toBe(
        path.join(customNodeModules, 'test-shared/index.js'),
      );
      for (const p of [plugin, outsidePlugin]) {
        expect(p.resolve('test-root-only')).toBe(
          path.join(rootNodeModules, 'test-root-only/index.js'),
        );
        expect(p.resolve('test-backend-only')).toBe(
          path.join(backendNodeModules, 'test-backend-only/index.js'),
        );
        expect(() => p.resolve('test-missing')).toThrow(
          expect.objectContaining({ code: 'MODULE_NOT_FOUND' }),
        );
      }

      // A bundled copy of @backstage/backend-plugin-api finds the dynamic
      // plugin package before the host, and only then the host
      expect(bundledBackendPluginApi.resolvePackageJson('test-plugin')).toBe(
        path.join(testPluginDir, 'package.json'),
      );
      expect(
        bundledBackendPluginApi.resolvePackageJson('test-backend-only'),
      ).toBe(path.join(backendNodeModules, 'test-backend-only/package.json'));
      expect(() =>
        bundledBackendPluginApi.resolvePackageJson('test-missing'),
      ).toThrow(expect.objectContaining({ code: 'MODULE_NOT_FOUND' }));
    } finally {
      realNodeModule._nodeModulePaths = realNodeModulePaths;
      realNodeModule._resolveFilename = realResolveFilename;
      realNodeModule.globalPaths = realGlobalPaths;
    }
  });
});
