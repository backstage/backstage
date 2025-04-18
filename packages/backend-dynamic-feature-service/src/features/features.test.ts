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
  startTestBackend,
  mockServices,
  createMockDirectory,
} from '@backstage/backend-test-utils';
import { dynamicPluginsFeatureLoader } from './features';
import { DynamicPlugin, dynamicPluginsServiceRef } from '../manager';
import path, { resolve as resolvePath } from 'path';
import {
  BackendFeature,
  createBackendPlugin,
} from '@backstage/backend-plugin-api';
import {
  CommonJSModuleLoader,
  CommonJSModuleLoaderOptions,
} from '../loader/CommonJSModuleLoader';
import * as winston from 'winston';
import * as url from 'url';
import { MESSAGE } from 'triple-beam';
import { overridePackagePathResolution } from '@backstage/backend-plugin-api/testUtils';
import { ScannedPluginPackage } from '../scanner';
import {
  dynamicPluginsFrontendServiceRef,
  FrontendRemoteResolverProvider,
} from '../server/frontendRemotesServer';

// these can get a bit slow in CI
jest.setTimeout(60_000);

async function jestFreeTypescriptAwareModuleLoader(
  options: CommonJSModuleLoaderOptions & {
    dontBootstrap?: boolean;
  },
) {
  const loader = new CommonJSModuleLoader(options);
  (loader as any).module = await loader.load('node:module');
  loader.load(path.resolve(__dirname, '../../../cli/config/nodeTransform.cjs'));
  if (options.dontBootstrap) {
    loader.bootstrap = async () => {};
  }
  return loader;
}

class MockedTransport extends winston.transports.Console {
  readonly logs: string[] = [];

  public log(info: any, callback: () => void) {
    if (!info[MESSAGE]?.includes('info: Plugin initialization ')) {
      this.logs.push(info[MESSAGE]);
    }
    super.log!(info, callback);
  }
  public logv(info: any, callback: () => void) {
    if (!info[MESSAGE]?.includes('info: Plugin initialization ')) {
      this.logs.push(info[MESSAGE]);
    }
    super.log!(info, callback);
  }
}

class DynamicPluginLister {
  readonly loadedPlugins: DynamicPlugin[] = [];
  getScannedPackage?: (plugin: DynamicPlugin) => ScannedPluginPackage;

  feature(): BackendFeature {
    // eslint-disable-next-line consistent-this
    const that = this;
    return createBackendPlugin({
      pluginId: 'dynamicPluginsLister',
      register(reg) {
        reg.registerInit({
          deps: {
            dynamicPlugins: dynamicPluginsServiceRef,
          },
          async init({ dynamicPlugins }) {
            that.getScannedPackage = plugin =>
              dynamicPlugins.getScannedPackage(plugin);
            that.loadedPlugins.push(
              ...dynamicPlugins.plugins({ includeFailed: true }),
            );
          },
        });
      },
    });
  }
}

describe('dynamicPluginsFeatureLoader', () => {
  const dynamicPluginsRootDirectory = resolvePath(
    __dirname,
    '__fixtures__/dynamic-plugins-root',
  );

  // A dummy `@backstage/backend-plugin-api` package which throws an error is available inside the test fixtures,
  // in a `node_modules` folder which is a sibling of the `dynamic-plugins-root`.
  // This test demonstrates how, without the skipping logic implemented in the {@link CommonJSModelLoader},
  // this dummy package would be loaded by the backend dynamic plugins instead of the one of the backstage root.
  it('should fail because the model loader is not skipping modules living in unexpected locations.', async () => {
    const dynamicPLuginsLister = new DynamicPluginLister();
    const mockedTransport = new MockedTransport();
    await startTestBackend({
      features: [
        mockServices.rootConfig.factory({
          data: {
            dynamicPlugins: {
              rootDirectory: dynamicPluginsRootDirectory,
            },
            backend: {
              baseUrl: `http://localhost:0`,
            },
          },
        }),
        dynamicPluginsFeatureLoader({
          moduleLoader: logger =>
            jestFreeTypescriptAwareModuleLoader({
              logger,
              dontBootstrap: true,
            }),
          logger: () => ({
            transports: [mockedTransport],
            format: winston.format.simple(),
          }),
        }),
        dynamicPLuginsLister.feature(),
      ],
    });
    expect(mockedTransport.logs).toContainEqual(
      expect.stringMatching(
        "error: an error occurred while loading dynamic backend plugin 'plugin-test-backend-dynamic' from '.*/packages/backend-dynamic-feature-service/src/features/__fixtures__/dynamic-plugins-root/test-backend-dynamic",
      ),
    );
    expect(dynamicPLuginsLister.loadedPlugins).toMatchObject([
      {
        name: 'plugin-test-backend-dynamic',
        platform: 'node',
        role: 'backend-plugin',
        version: '0.0.0',
        failure:
          'Error: False @backstage/backend-plugin-api package which should be skipped by the CommonJSModuleLoader',
      },
      expect.anything(),
    ]);
  });

  it('should fail on resolvePackagePath because -dynamic suffix is not allowed for dynamic plugin packages.', async () => {
    const dynamicPLuginsLister = new DynamicPluginLister();
    const mockedTransport = new MockedTransport();
    await startTestBackend({
      features: [
        mockServices.rootConfig.factory({
          data: {
            dynamicPlugins: {
              rootDirectory: dynamicPluginsRootDirectory,
            },
            backend: {
              baseUrl: `http://localhost:0`,
            },
          },
        }),
        dynamicPluginsFeatureLoader({
          moduleLoader: logger =>
            jestFreeTypescriptAwareModuleLoader({
              logger,
              dynamicPluginPackageNameSuffixes: [],
            }),
          logger: () => ({
            transports: [mockedTransport],
            format: winston.format.simple(),
          }),
        }),
        dynamicPLuginsLister.feature(),
      ],
    });
    expect(mockedTransport.logs).toContainEqual(
      expect.stringMatching(
        "error: an error occurred while loading dynamic backend plugin 'plugin-test-backend-dynamic' from '.*/packages/backend-dynamic-feature-service/src/features/__fixtures__/dynamic-plugins-root/test-backend-dynamic",
      ),
    );
    expect(dynamicPLuginsLister.loadedPlugins).toMatchObject([
      {
        name: 'plugin-test-backend-dynamic',
        platform: 'node',
        role: 'backend-plugin',
        version: '0.0.0',
        failure:
          expect.stringMatching(`Error: Cannot find module 'plugin-test-backend/package.json'
Require stack:
- .*/packages/backend-plugin-api/src/paths.ts
- .*/packages/backend-plugin-api/src/index.ts
- .*/packages/backend-dynamic-feature-service/src/manager/plugin-manager.ts
- .*/packages/backend-dynamic-feature-service/src/manager/index.ts
- .*/packages/backend-dynamic-feature-service/src/features/__fixtures__/dynamic-plugins-root/test-backend-dynamic/dist/index.cjs.js
`),
      },
      expect.anything(),
    ]);
  });

  it('should load and show the 2 dynamic plugins in a list of dynamic plugins returned by a static backend plugin', async () => {
    const dynamicPLuginsLister = new DynamicPluginLister();
    await startTestBackend({
      features: [
        mockServices.rootConfig.factory({
          data: {
            dynamicPlugins: {
              rootDirectory: dynamicPluginsRootDirectory,
            },
            backend: {
              baseUrl: `http://localhost:0`,
            },
          },
        }),
        dynamicPluginsFeatureLoader({
          moduleLoader: logger =>
            jestFreeTypescriptAwareModuleLoader({ logger }),
        }),
        dynamicPLuginsLister.feature(),
      ],
    });

    expect(dynamicPLuginsLister.loadedPlugins).toMatchObject([
      {
        installer: {
          kind: 'new',
        },
        name: 'plugin-test-backend-dynamic',
        platform: 'node',
        role: 'backend-plugin',
        version: '0.0.0',
      },
      {
        name: 'plugin-test-dynamic',
        platform: 'web',
        role: 'frontend-dynamic-container',
        version: '0.0.0',
      },
    ]);
  });

  it('should allow overriding logger options based on config', async () => {
    const mockedTransport = new MockedTransport();
    await startTestBackend({
      features: [
        mockServices.rootConfig.factory({
          data: {
            dynamicPlugins: {
              rootDirectory: dynamicPluginsRootDirectory,
            },
            customLogLabel: 'a very nice label',
            backend: {
              baseUrl: `http://localhost:0`,
            },
          },
        }),
        dynamicPluginsFeatureLoader({
          moduleLoader: logger =>
            jestFreeTypescriptAwareModuleLoader({ logger }),
          logger: config => {
            const label = config?.getString('customLogLabel') ?? 'no-label';
            return {
              transports: [mockedTransport],
              format: winston.format.combine(
                winston.format.label({
                  label,
                  message: true,
                }),
                winston.format.simple(),
              ),
            };
          },
        }),
      ],
    });

    expect(mockedTransport.logs).toContainEqual(
      'info: [a very nice label] Found 0 new secrets in config that will be redacted {"service":"backstage"}',
    );
  });

  it('should redact the secret config values of dynamic plugin config schemas in logs', async () => {
    const mockedTransport = new MockedTransport();
    await startTestBackend({
      features: [
        mockServices.rootConfig.factory({
          data: {
            dynamicPlugins: {
              rootDirectory: dynamicPluginsRootDirectory,
            },
            'test-backend': {
              secretValue: 'AVerySecretValue',
            },
            backend: {
              baseUrl: `http://localhost:0`,
            },
          },
        }),
        dynamicPluginsFeatureLoader({
          moduleLoader: logger =>
            jestFreeTypescriptAwareModuleLoader({ logger }),
          logger: () => ({
            transports: [mockedTransport],
            format: winston.format.simple(),
          }),
        }),
      ],
    });

    expect(mockedTransport.logs).toContainEqual(
      'info: Found 1 new secrets in config that will be redacted {"service":"backstage"}',
    );

    expect(mockedTransport.logs).toContainEqual(
      'info: This secret value should be hidden by the dynamic-plugin-aware logger: *** {"service":"backstage"}',
    );
  });

  const mockAppDir = createMockDirectory();
  overridePackagePathResolution({
    packageName: 'app',
    path: mockAppDir.path,
  });

  it('should inject frontend config values of dynamic frontend plugin config schemas to the frontend application', async () => {
    mockAppDir.setContent({
      'package.json': '{}',
      dist: {
        static: {},
        'index.html.tmpl': '<head></head>',
        '.config-schema.json': `
{
  "backstageConfigSchemaVersion": 1,
  "schemas": []
}
`,
      },
    });

    const { server } = await startTestBackend({
      features: [
        mockServices.rootConfig.factory({
          data: {
            dynamicPlugins: {
              rootDirectory: dynamicPluginsRootDirectory,
            },
            'test-frontend': {
              frontendValue: 'AFrontendValue',
            },
            backend: {
              baseUrl: `http://localhost:0`,
            },
          },
        }),
        dynamicPluginsFeatureLoader({
          moduleLoader: logger =>
            jestFreeTypescriptAwareModuleLoader({ logger }),
        }),
        import('@backstage/plugin-app-backend'),
      ],
    });

    await expect(
      fetch(`http://localhost:${server.port()}`).then(res => res.text()),
    ).resolves.toBe(`<head>
<script type="backstage.io/config">
[
  {
    "context": "app",
    "deprecatedKeys": [],
    "data": {
      "test-frontend": {
        "frontendValue": "AFrontendValue"
      }
    }
  }
]
</script>
</head>`);
  });

  it('should load a backend plugin from the alpha package first', async () => {
    const dynamicPLuginsLister = new DynamicPluginLister();
    const mockedTransport = new MockedTransport();
    const dynamicPluginsRootForAlpha = resolvePath(
      __dirname,
      '__fixtures__/dynamic-plugins-root-for-alpha',
    );
    await startTestBackend({
      features: [
        mockServices.rootConfig.factory({
          data: {
            dynamicPlugins: {
              rootDirectory: dynamicPluginsRootForAlpha,
            },
            backend: {
              baseUrl: `http://localhost:0`,
            },
          },
        }),
        dynamicPluginsFeatureLoader({
          moduleLoader: logger =>
            jestFreeTypescriptAwareModuleLoader({ logger }),
          logger: () => ({
            transports: [mockedTransport],
            format: winston.format.simple(),
          }),
        }),
        dynamicPLuginsLister.feature(),
      ],
    });

    expect(mockedTransport.logs).toContainEqual(
      'info: This plugin has been loaded from the alpha package. {"service":"backstage"}',
    );

    const loadedPlugins = dynamicPLuginsLister.loadedPlugins;
    expect(loadedPlugins).toMatchObject([
      {
        installer: {
          kind: 'new',
        },
        name: 'plugin-test-backend-alpha-dynamic',
        platform: 'node',
        role: 'backend-plugin',
        version: '0.0.0',
      },
    ]);
    expect(
      dynamicPLuginsLister.getScannedPackage?.(loadedPlugins[0]),
    ).toMatchObject({
      location: url.pathToFileURL(
        path.resolve(dynamicPluginsRootForAlpha, 'test-backend-alpha-dynamic'),
      ),
      manifest: {
        name: 'plugin-test-backend-alpha-dynamic',
        version: '0.0.0',
        description: 'A test dynamic backend module that exposes alpha API.',
        backstage: {
          role: 'backend-plugin',
          pluginId: 'test-alpha',
          pluginPackages: ['plugin-test-backend-alpha'],
        },
        keywords: ['backstage', 'dynamic'],
      },
      alphaManifest: {
        name: 'plugin-test-backend-alpha-dynamic__alpha',
        version: '0.0.0',
        main: '../dist/alpha.cjs.js',
      },
    });
  });

  describe('module federation support', () => {
    const createRemoteProviderPlugin = (
      provider: FrontendRemoteResolverProvider,
    ) =>
      createBackendPlugin({
        pluginId: 'test-remote-provider',
        register(reg) {
          reg.registerInit({
            deps: {
              frontendRemotes: dynamicPluginsFrontendServiceRef,
            },
            async init({ frontendRemotes }) {
              frontendRemotes.setResolverProvider(provider);
            },
          });
        },
      });

    it('should access the module federation assets of the frontend plugin through the backend plugin', async () => {
      const { server } = await startTestBackend({
        features: [
          mockServices.rootConfig.factory({
            data: {
              dynamicPlugins: {
                rootDirectory: dynamicPluginsRootDirectory,
              },
              backend: {
                baseUrl: `http://localhost:0`,
              },
            },
          }),
          dynamicPluginsFeatureLoader({
            moduleLoader: logger =>
              jestFreeTypescriptAwareModuleLoader({ logger }),
          }),
        ],
      });

      const list = await fetch(
        `http://localhost:${server.port()}/.backstage/dynamic-features/remotes`,
      );
      expect(list.ok).toBe(true);
      expect(await list.json()).toEqual([
        {
          packageName: 'plugin-test-dynamic',
          exposedModules: ['.', 'alpha'],
          remoteInfo: {
            name: 'backstage__plugin_test',
            entry:
              'http://localhost:0/.backstage/dynamic-features/remotes/plugin-test-dynamic/mf-manifest.json',
          },
        },
      ]);

      const manifest = await fetch(
        `http://localhost:${server.port()}/.backstage/dynamic-features/remotes/plugin-test-dynamic/mf-manifest.json`,
      );
      expect(manifest.ok).toBe(true);
      expect(await manifest.json()).toMatchObject({
        exposes: [{ name: '.' }, { name: 'alpha' }],
        id: 'backstage__plugin_test',
        name: 'backstage__plugin_test',
        metaData: {
          buildInfo: {
            buildName: '@backstage/plugin-test',
            buildVersion: '0.0.0',
          },
          globalName: 'backstage__plugin_test',
          name: 'backstage__plugin_test',
          pluginVersion: '0.0.0',
          publicPath: 'auto',
        },
      });
    });

    it('should allow overriding the module federation assets folder, return the Javascript remote entry, the exposed modules and additional remote intry info fields', async () => {
      const mockedTransport = new MockedTransport();
      const { server } = await startTestBackend({
        features: [
          mockServices.rootConfig.factory({
            data: {
              dynamicPlugins: {
                rootDirectory: dynamicPluginsRootDirectory,
              },
              backend: {
                baseUrl: `http://localhost:0`,
              },
            },
          }),
          createRemoteProviderPlugin({
            for: () => ({
              assetsPathFromPackage: 'dist-alternate',
              getRemoteEntryType: () => 'javascript',
              getAdditionalRemoteInfo: manifest => ({
                type: (manifest as any).metaData.remoteEntry.type,
              }),
              overrideExposedModules: exposedModules =>
                exposedModules.filter(name => name !== 'alpha'),
            }),
          }),
          dynamicPluginsFeatureLoader({
            moduleLoader: logger =>
              jestFreeTypescriptAwareModuleLoader({ logger }),
            logger: () => ({
              transports: [mockedTransport],
              format: winston.format.simple(),
            }),
          }),
        ],
      });

      const list = await fetch(
        `http://localhost:${server.port()}/.backstage/dynamic-features/remotes`,
      );
      expect(list.ok).toBe(true);
      expect(await list.json()).toEqual([
        {
          exposedModules: ['.'],
          packageName: 'plugin-test-dynamic',
          remoteInfo: {
            entry:
              'http://localhost:0/.backstage/dynamic-features/remotes/plugin-test-dynamic/remoteEntry.js',
            name: 'backstage__plugin_test',
            type: 'global',
          },
        },
      ]);
      expect(mockedTransport.logs).toContainEqual(
        expect.stringMatching(
          `Exposed dynamic frontend plugin 'plugin-test-dynamic' from '.*/dist-alternate' `,
        ),
      );
    });

    it('should allow customizing the module federation manifest when returning it as the remote entry', async () => {
      const mockedTransport = new MockedTransport();
      const { server } = await startTestBackend({
        features: [
          mockServices.rootConfig.factory({
            data: {
              dynamicPlugins: {
                rootDirectory: dynamicPluginsRootDirectory,
              },
              backend: {
                baseUrl: `http://localhost:0`,
              },
            },
          }),
          createRemoteProviderPlugin({
            for: () => ({
              customizeManifest(manifest) {
                (manifest as any).metaData.publicPath =
                  'https://some-cdn-url-where-module-federation-assets-are-mirrored';
                return manifest;
              },
            }),
          }),
          dynamicPluginsFeatureLoader({
            moduleLoader: logger =>
              jestFreeTypescriptAwareModuleLoader({ logger }),
            logger: () => ({
              transports: [mockedTransport],
              format: winston.format.simple(),
            }),
          }),
        ],
      });

      const list = await fetch(
        `http://localhost:${server.port()}/.backstage/dynamic-features/remotes`,
      );
      expect(list.ok).toBe(true);
      expect(await list.json()).toEqual([
        {
          packageName: 'plugin-test-dynamic',
          exposedModules: ['.', 'alpha'],
          remoteInfo: {
            name: 'backstage__plugin_test',
            entry:
              'http://localhost:0/.backstage/dynamic-features/remotes/plugin-test-dynamic/mf-manifest.json',
          },
        },
      ]);
      const manifest = await fetch(
        `http://localhost:${server.port()}/.backstage/dynamic-features/remotes/plugin-test-dynamic/mf-manifest.json`,
      );
      expect(manifest.ok).toBe(true);
      expect(await manifest.json()).toMatchObject({
        exposes: [{ name: '.' }, { name: 'alpha' }],
        id: 'backstage__plugin_test',
        name: 'backstage__plugin_test',
        metaData: {
          buildInfo: {
            buildName: '@backstage/plugin-test',
            buildVersion: '0.0.0',
          },
          globalName: 'backstage__plugin_test',
          name: 'backstage__plugin_test',
          pluginVersion: '0.0.0',
          publicPath:
            'https://some-cdn-url-where-module-federation-assets-are-mirrored',
        },
      });

      expect(mockedTransport.logs).toContainEqual(
        expect.stringMatching(
          `Exposed dynamic frontend plugin 'plugin-test-dynamic' from '.*/dist' `,
        ),
      );
    });

    it('should log an error and skip the plugin if the module federation manifest does not contain a valid name', async () => {
      const mockedTransport = new MockedTransport();
      const { server } = await startTestBackend({
        features: [
          mockServices.rootConfig.factory({
            data: {
              dynamicPlugins: {
                rootDirectory: dynamicPluginsRootDirectory,
              },
              backend: {
                baseUrl: `http://localhost:0`,
              },
            },
          }),
          createRemoteProviderPlugin({
            for: () => ({
              manifestFileName: 'mf-manifest-without-name.json',
            }),
          }),
          dynamicPluginsFeatureLoader({
            moduleLoader: logger =>
              jestFreeTypescriptAwareModuleLoader({ logger }),
            logger: () => ({
              transports: [mockedTransport],
              format: winston.format.simple(),
            }),
          }),
        ],
      });

      const list = await fetch(
        `http://localhost:${server.port()}/.backstage/dynamic-features/remotes`,
      );
      expect(list.ok).toBe(true);
      expect(await list.json()).toEqual([]);
      expect(mockedTransport.logs).toContainEqual(
        expect.stringMatching(
          "error: Error in manifest '.*' for plugin .*@.*: module name not found",
        ),
      );
    });

    it('should log an error and skip the plugin if a resolver provider triggers an error', async () => {
      const mockedTransport = new MockedTransport();
      const { server } = await startTestBackend({
        features: [
          mockServices.rootConfig.factory({
            data: {
              dynamicPlugins: {
                rootDirectory: dynamicPluginsRootDirectory,
              },
              backend: {
                baseUrl: `http://localhost:0`,
              },
            },
          }),
          createRemoteProviderPlugin({
            for() {
              throw new Error('Resolver provider error');
            },
          }),
          dynamicPluginsFeatureLoader({
            moduleLoader: logger =>
              jestFreeTypescriptAwareModuleLoader({ logger }),
            logger: () => ({
              transports: [mockedTransport],
              format: winston.format.simple(),
            }),
          }),
        ],
      });

      const list = await fetch(
        `http://localhost:${server.port()}/.backstage/dynamic-features/remotes`,
      );
      expect(list.ok).toBe(true);
      expect(await list.json()).toEqual([]);
      expect(mockedTransport.logs).toContainEqual(
        expect.stringMatching(
          "error: Unexpected error when exposing dynamic frontend plugin 'plugin-test-dynamic@0.0.0' Resolver provider error",
        ),
      );
    });

    it('should log an error and skip the plugin if the module federation manifest is not found', async () => {
      const mockedTransport = new MockedTransport();
      const { server } = await startTestBackend({
        features: [
          mockServices.rootConfig.factory({
            data: {
              dynamicPlugins: {
                rootDirectory: dynamicPluginsRootDirectory,
              },
              backend: {
                baseUrl: `http://localhost:0`,
              },
            },
          }),
          createRemoteProviderPlugin({
            for: () => ({
              manifestFileName: 'mf-manifest-not-found.json',
            }),
          }),
          dynamicPluginsFeatureLoader({
            moduleLoader: logger =>
              jestFreeTypescriptAwareModuleLoader({ logger }),
            logger: () => ({
              transports: [mockedTransport],
              format: winston.format.simple(),
            }),
          }),
        ],
      });

      const list = await fetch(
        `http://localhost:${server.port()}/.backstage/dynamic-features/remotes`,
      );
      expect(list.ok).toBe(true);
      expect(await list.json()).toEqual([]);
      expect(mockedTransport.logs).toContainEqual(
        expect.stringMatching(
          "error: Could not find manifest '.*/dist/mf-manifest-not-found.json' for frontend plugin plugin-test-dynamic@0.0.0",
        ),
      );
    });

    it('should log an error and skip the plugin if the module federation remote entry asset is not found', async () => {
      const mockedTransport = new MockedTransport();
      const { server } = await startTestBackend({
        features: [
          mockServices.rootConfig.factory({
            data: {
              dynamicPlugins: {
                rootDirectory: dynamicPluginsRootDirectory,
              },
              backend: {
                baseUrl: `http://localhost:0`,
              },
            },
          }),
          createRemoteProviderPlugin({
            for: () => ({
              manifestFileName: 'mf-manifest-with-wrong-remote-entry.json',
              getRemoteEntryType: () => 'javascript',
            }),
          }),
          dynamicPluginsFeatureLoader({
            moduleLoader: logger =>
              jestFreeTypescriptAwareModuleLoader({ logger }),
            logger: () => ({
              transports: [mockedTransport],
              format: winston.format.simple(),
            }),
          }),
        ],
      });

      const list = await fetch(
        `http://localhost:${server.port()}/.backstage/dynamic-features/remotes`,
      );
      expect(list.ok).toBe(true);
      expect(await list.json()).toEqual([]);
      expect(mockedTransport.logs).toContainEqual(
        expect.stringMatching(
          "error: Could not find remote entry asset '.*/dist/remoteEntry-not-found.js' for frontend plugin plugin-test-dynamic@0.0.0",
        ),
      );
    });
  });
});
