/*
 * Copyright 2023 The Backstage Authors
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
  DynamicPluginManager,
  dynamicPluginsServiceFactory,
} from './plugin-manager';
import {
  BackendFeature,
  coreServices,
  createServiceFactory,
} from '@backstage/backend-plugin-api';
import * as path from 'path';
import * as url from 'url';
import fs from 'fs';
import {
  BackendDynamicPlugin,
  BaseDynamicPlugin,
  DynamicPlugin,
  LegacyBackendPluginInstaller,
  NewBackendPluginInstaller,
  LegacyPluginEnvironment,
} from './types';
import { ScannedPluginManifest, ScannedPluginPackage } from '../scanner/types';
import { randomUUID } from 'crypto';
import { TemplateAction } from '@backstage/plugin-scaffolder-node';
import {
  createSpecializedBackend,
  rootLifecycleServiceFactory,
} from '@backstage/backend-app-api';
import { ConfigSources } from '@backstage/config-loader';
import { Logs, MockedLogger, LogContent } from '../__testUtils__/testUtils';
import { PluginScanner } from '../scanner/plugin-scanner';
import { findPaths } from '@backstage/cli-common';
import { createMockDirectory } from '@backstage/backend-test-utils';

describe('backend-dynamic-feature-service', () => {
  const mockDir = createMockDirectory();

  describe('loadPlugins', () => {
    afterEach(() => {
      jest.resetModules();
    });

    type TestCase = {
      name: string;
      packageManifest: ScannedPluginManifest;
      indexFile?: {
        relativePath: string[];
        content: string;
      };
      expectedLogs?(location: URL): {
        errors?: LogContent[];
        warns?: LogContent[];
        infos?: LogContent[];
        debugs?: LogContent[];
      };
      checkLoadedPlugins: (loadedPlugins: BaseDynamicPlugin[]) => void;
    };

    it.each<TestCase>([
      {
        name: 'should successfully load a new backend plugin',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin',
          },
          main: 'dist/index.cjs.js',
        },
        indexFile: {
          relativePath: ['dist', 'index.cjs.js'],
          content:
            'exports.dynamicPluginInstaller={ kind: "new", install: () => [] }',
        },
        expectedLogs(location) {
          return {
            infos: [
              {
                message: `loaded dynamic backend plugin 'backend-dynamic-plugin-test' from '${location}'`,
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([
            {
              name: 'backend-dynamic-plugin-test',
              version: '0.0.0',
              role: 'backend-plugin',
              platform: 'node',
              installer: {
                kind: 'new',
              },
            },
          ]);
          const installer: NewBackendPluginInstaller = (
            plugins[0] as BackendDynamicPlugin
          ).installer as NewBackendPluginInstaller;
          expect(installer.install()).toEqual<
            BackendFeature | BackendFeature[]
          >([]);
        },
      },
      {
        name: 'should successfully load a new backend plugin by the default BackendFeature',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin',
          },
          main: 'dist/index.cjs.js',
        },
        indexFile: {
          relativePath: ['dist', 'index.cjs.js'],
          content: `const alpha = { $$type: '@backstage/BackendFeature' }; exports["default"] = alpha;`,
        },
        expectedLogs(location) {
          return {
            infos: [
              {
                message: `loaded dynamic backend plugin 'backend-dynamic-plugin-test' from '${location}'`,
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([
            {
              name: 'backend-dynamic-plugin-test',
              version: '0.0.0',
              role: 'backend-plugin',
              platform: 'node',
              installer: {
                kind: 'new',
              },
            },
          ]);
          const installer: NewBackendPluginInstaller = (
            plugins[0] as BackendDynamicPlugin
          ).installer as NewBackendPluginInstaller;
          expect((installer.install() as BackendFeature).$$type).toEqual(
            '@backstage/BackendFeature',
          );
        },
      },
      {
        name: 'should successfully load a new backend plugin by the default BackendFeatureFactory',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin',
          },
          main: 'dist/index.cjs.js',
        },
        indexFile: {
          relativePath: ['dist', 'index.cjs.js'],
          content: `const alpha = () => { return { $$type: '@backstage/BackendFeature' } };
             alpha.$$type = '@backstage/BackendFeatureFactory';
             exports["default"] = alpha;`,
        },
        expectedLogs(location) {
          return {
            infos: [
              {
                message: `loaded dynamic backend plugin 'backend-dynamic-plugin-test' from '${location}'`,
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([
            {
              name: 'backend-dynamic-plugin-test',
              version: '0.0.0',
              role: 'backend-plugin',
              platform: 'node',
              installer: {
                kind: 'new',
              },
            },
          ]);
          const installer: NewBackendPluginInstaller = (
            plugins[0] as BackendDynamicPlugin
          ).installer as NewBackendPluginInstaller;
          expect((installer.install() as BackendFeature).$$type).toEqual(
            '@backstage/BackendFeature',
          );
        },
      },
      {
        name: 'should successfully load a new backend plugin module',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin-module',
          },
          main: 'dist/index.cjs.js',
        },
        indexFile: {
          relativePath: ['dist', 'index.cjs.js'],
          content:
            'exports.dynamicPluginInstaller={ kind: "new", install: () => [] }',
        },
        expectedLogs(location) {
          return {
            infos: [
              {
                message: `loaded dynamic backend plugin 'backend-dynamic-plugin-test' from '${location}'`,
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([
            {
              name: 'backend-dynamic-plugin-test',
              version: '0.0.0',
              role: 'backend-plugin-module',
              platform: 'node',
              installer: {
                kind: 'new',
              },
            },
          ]);
          const installer: NewBackendPluginInstaller = (
            plugins[0] as BackendDynamicPlugin
          ).installer as NewBackendPluginInstaller;
          expect(installer.install()).toEqual<
            BackendFeature | BackendFeature[]
          >([]);
        },
      },
      {
        name: 'should fail when no index file',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin',
          },
          main: 'dist/index.cjs.js',
        },
        expectedLogs(location) {
          return {
            errors: [
              {
                message: `an error occurred while loading dynamic backend plugin 'backend-dynamic-plugin-test' from '${location}'`,
                meta: {
                  name: 'Error',
                  message: expect.stringContaining(
                    `Cannot find module '${path.resolve(
                      url.fileURLToPath(location),
                      'dist/index.cjs.js',
                    )}' from `,
                  ),
                  _originalMessage: expect.stringContaining(
                    `Cannot find module '${path.resolve(
                      url.fileURLToPath(location),
                      'dist/index.cjs.js',
                    )}' from `,
                  ),
                  code: 'MODULE_NOT_FOUND',
                  hint: '',
                  moduleName: `${path.resolve(
                    url.fileURLToPath(location),
                    'dist/index.cjs.js',
                  )}`,
                  siblingWithSimilarExtensionFound: false,
                  requireStack: undefined,
                },
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([]);
        },
      },
      {
        name: 'should fail when the expected entry point is not in the index file',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin',
          },
          main: 'dist/index.cjs.js',
        },
        indexFile: {
          relativePath: ['dist', 'index.cjs.js'],
          content: '',
        },
        expectedLogs(location) {
          return {
            errors: [
              {
                message: `dynamic backend plugin 'backend-dynamic-plugin-test' could not be loaded from '${location}': the module should either export a 'BackendFeature' or 'BackendFeatureFactory' as default export, or export a 'const dynamicPluginInstaller: BackendDynamicPluginInstaller' field as dynamic loading entrypoint.`,
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([]);
        },
      },
      {
        name: 'should fail when the expected entry point is not of the expected type',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin',
          },
          main: 'dist/index.cjs.js',
        },
        indexFile: {
          relativePath: ['dist', 'index.cjs.js'],
          content:
            'exports.dynamicPluginInstaller={ something: "else", unexpectedMethod() {} }',
        },
        expectedLogs(location) {
          return {
            errors: [
              {
                message: `dynamic backend plugin 'backend-dynamic-plugin-test' could not be loaded from '${location}': the module should either export a 'BackendFeature' or 'BackendFeatureFactory' as default export, or export a 'const dynamicPluginInstaller: BackendDynamicPluginInstaller' field as dynamic loading entrypoint.`,
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([]);
        },
      },
      {
        name: 'should fail when the index file has a syntax error',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin',
          },
          main: 'dist/index.cjs.js',
        },
        indexFile: {
          relativePath: ['dist', 'index.cjs.js'],
          content: 'strange text with syntax error',
        },
        expectedLogs(location) {
          return {
            errors: [
              {
                message: `an error occurred while loading dynamic backend plugin 'backend-dynamic-plugin-test' from '${location}'`,
                meta: {
                  message: expect.stringContaining('Unexpected identifier'),
                  name: 'SyntaxError',
                },
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([]);
        },
      },
      {
        name: 'should successfully load a legacy backend plugin',
        packageManifest: {
          name: 'backend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'backend-plugin',
          },
          main: 'dist/index.cjs.js',
        },
        indexFile: {
          relativePath: ['dist', 'index.cjs.js'],
          content:
            'exports.dynamicPluginInstaller={ kind: "legacy", scaffolder: (env)=>[] }',
        },
        expectedLogs(location) {
          return {
            infos: [
              {
                message: `loaded dynamic backend plugin 'backend-dynamic-plugin-test' from '${location}'`,
              },
            ],
          };
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([
            {
              name: 'backend-dynamic-plugin-test',
              version: '0.0.0',
              role: 'backend-plugin',
              platform: 'node',
              installer: {
                kind: 'legacy',
              },
            },
          ]);
          const installer = (plugins[0] as BackendDynamicPlugin)
            .installer as LegacyBackendPluginInstaller;
          expect(installer.scaffolder!({} as LegacyPluginEnvironment)).toEqual<
            TemplateAction<any>[]
          >([]);
        },
      },
      {
        name: 'should successfully load a frontend plugin',
        packageManifest: {
          name: 'frontend-dynamic-plugin-test',
          version: '0.0.0',
          backstage: {
            role: 'frontend-plugin',
          },
          main: 'dist/index.esm.js',
        },
        checkLoadedPlugins(plugins) {
          expect(plugins).toMatchObject([
            {
              name: 'frontend-dynamic-plugin-test',
              version: '0.0.0',
              role: 'frontend-plugin',
              platform: 'web',
            },
          ]);
        },
      },
    ])('$name', async (tc: TestCase): Promise<void> => {
      const plugin: ScannedPluginPackage = {
        location: url.pathToFileURL(mockDir.resolve(randomUUID())),
        manifest: tc.packageManifest,
      };

      const mockedFiles = {
        [path.join(url.fileURLToPath(plugin.location), 'package.json')]:
          JSON.stringify(plugin),
      };
      if (tc.indexFile) {
        mockedFiles[
          path.join(
            url.fileURLToPath(plugin.location),
            ...tc.indexFile.relativePath,
          )
        ] = tc.indexFile.content;
      }
      mockDir.setContent(mockedFiles);

      const logger = new MockedLogger();
      const pluginManager = new (DynamicPluginManager as any)(
        logger,
        [plugin],
        {
          logger,
          async bootstrap(_: string, __: string[]): Promise<void> {},
          load: async (packagePath: string) =>
            await require(/* webpackIgnore: true */ packagePath),
        },
      );

      const loadedPlugins: DynamicPlugin[] = await pluginManager.loadPlugins();

      const expectedLogs = tc.expectedLogs
        ? tc.expectedLogs(plugin.location)
        : {};
      expect(logger.logs).toEqual<Logs>(expectedLogs);

      tc.checkLoadedPlugins(loadedPlugins);
    });
  });

  describe('backendPlugins', () => {
    it('should return only backend plugins and modules', async () => {
      const logger = new MockedLogger();
      const pluginManager = new (DynamicPluginManager as any)(
        logger,
        [],
      ) as DynamicPluginManager;
      const plugins: BaseDynamicPlugin[] = [
        {
          name: 'a-frontend-plugin',
          platform: 'web',
          role: 'frontend-plugin',
          version: '0.0.0',
        },
        {
          name: 'a-backend-plugin',
          platform: 'node',
          role: 'backend-plugin',
          version: '0.0.0',
        },
        {
          name: 'a-backend-module',
          platform: 'node',
          role: 'backend-plugin-module',
          version: '0.0.0',
        },
      ];
      (pluginManager as any)._plugins = plugins;
      expect(pluginManager.backendPlugins()).toEqual([
        {
          name: 'a-backend-plugin',
          platform: 'node',
          role: 'backend-plugin',
          version: '0.0.0',
        },
        {
          name: 'a-backend-module',
          platform: 'node',
          role: 'backend-plugin-module',
          version: '0.0.0',
        },
      ]);
    });
  });

  describe('frontendPlugins', () => {
    it('should return only frontend plugins', async () => {
      const logger = new MockedLogger();
      const pluginManager = new (DynamicPluginManager as any)(
        logger,
        [],
      ) as DynamicPluginManager;
      const plugins: BaseDynamicPlugin[] = [
        {
          name: 'a-frontend-plugin',
          platform: 'web',
          role: 'frontend-plugin',
          version: '0.0.0',
        },
        {
          name: 'a-frontend-module',
          platform: 'web',
          role: 'frontend-plugin-module',
          version: '0.0.0',
        },
        {
          name: 'a-backend-plugin',
          platform: 'node',
          role: 'backend-plugin',
          version: '0.0.0',
        },
        {
          name: 'a-backend-module',
          platform: 'node',
          role: 'backend-plugin-module',
          version: '0.0.0',
        },
      ];
      (pluginManager as any)._plugins = plugins;
      expect(pluginManager.frontendPlugins()).toEqual([
        {
          name: 'a-frontend-plugin',
          platform: 'web',
          role: 'frontend-plugin',
          version: '0.0.0',
        },
        {
          name: 'a-frontend-module',
          platform: 'web',
          role: 'frontend-plugin-module',
          version: '0.0.0',
        },
      ]);
    });
  });

  describe('dynamicPluginsServiceFactory', () => {
    const otherMockDir = createMockDirectory();

    afterEach(() => {
      mockDir.clear();
      otherMockDir.clear();
      jest.resetModules();
    });

    it('should call PluginManager.fromConfig', async () => {
      const logger = new MockedLogger();
      const rootLogger = new MockedLogger();

      mockDir.setContent({
        'package.json': fs.readFileSync(
          findPaths(__dirname).resolveTargetRoot('package.json'),
        ),
        'dynamic-plugins-root': {},
        'dynamic-plugins-root/a-dynamic-plugin': ctx =>
          ctx.symlink(otherMockDir.resolve('a-dynamic-plugin')),
      });
      otherMockDir.setContent({
        'a-dynamic-plugin': {},
      });

      const fromConfigSpier = jest.spyOn(DynamicPluginManager, 'create');
      const applyConfigSpier = jest
        .spyOn(PluginScanner.prototype as any, 'applyConfig')
        .mockImplementation(() => {});
      const scanRootSpier = jest
        .spyOn(PluginScanner.prototype, 'scanRoot')
        .mockImplementation(async () => ({
          packages: [
            {
              location: url.pathToFileURL(
                mockDir.resolve('dynamic-plugins-root/a-dynamic-plugin'),
              ),
              manifest: {
                name: 'test',
                version: '0.0.0',
                main: 'dist/index.cjs.js',
                backstage: {
                  role: 'backend-plugin',
                },
              },
            },
          ],
        }));
      const mockedModuleLoader = {
        logger,
        bootstrap: jest.fn(),
        load: jest.fn(),
      };

      const backend = createSpecializedBackend({
        defaultServiceFactories: [
          rootLifecycleServiceFactory(),
          createServiceFactory({
            service: coreServices.rootConfig,
            deps: {},
            async factory({}) {
              return await ConfigSources.toConfig({
                async *readConfigData() {
                  yield {
                    configs: [
                      {
                        context: 'test',
                        data: {},
                      },
                    ],
                  };
                },
              });
            },
          }),
          createServiceFactory({
            service: coreServices.logger,
            deps: {},
            async factory({}) {
              return logger;
            },
          }),
          createServiceFactory({
            service: coreServices.rootLogger,
            deps: {},
            async factory({}) {
              return rootLogger;
            },
          }),
          dynamicPluginsServiceFactory({
            moduleLoader: _ => mockedModuleLoader,
          }),
        ],
      });

      await backend.start();
      expect(fromConfigSpier).toHaveBeenCalled();
      expect(applyConfigSpier).toHaveBeenCalled();
      expect(scanRootSpier).toHaveBeenCalled();
      expect(mockedModuleLoader.bootstrap).toHaveBeenCalledWith(
        findPaths(__dirname).targetRoot,
        [fs.realpathSync(otherMockDir.resolve('a-dynamic-plugin'))],
      );
      expect(mockedModuleLoader.load).toHaveBeenCalledWith(
        mockDir.resolve(
          'dynamic-plugins-root/a-dynamic-plugin/dist/index.cjs.js',
        ),
      );
    });
  });
});
