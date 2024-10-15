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
  LoggerService,
} from '@backstage/backend-plugin-api';
import { CommonJSModuleLoader } from '../loader/CommonJSModuleLoader';
import * as winston from 'winston';
import * as url from 'url';
import { MESSAGE } from 'triple-beam';
import { overridePackagePathResolution } from '@backstage/backend-plugin-api/testUtils';
import { ScannedPluginPackage } from '../scanner';

// these can get a bit slow in CI
jest.setTimeout(60_000);

async function jestFreeTypescriptAwareModuleLoader(
  logger: LoggerService,
  dontBootstrap: boolean = false,
) {
  const loader = new CommonJSModuleLoader(logger);
  (loader as any).module = await loader.load('node:module');
  loader.load(path.resolve(__dirname, '../../../cli/config/nodeTransform.cjs'));
  if (dontBootstrap) {
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
          },
        }),
        dynamicPluginsFeatureLoader({
          moduleLoader: logger =>
            jestFreeTypescriptAwareModuleLoader(logger, true),
          transports: [mockedTransport],
          format: winston.format.simple(),
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

  it('should load and show the 2 dynamic plugins in a list of dynamic plugins returned by a static backend plugin', async () => {
    const dynamicPLuginsLister = new DynamicPluginLister();
    await startTestBackend({
      features: [
        mockServices.rootConfig.factory({
          data: {
            dynamicPlugins: {
              rootDirectory: dynamicPluginsRootDirectory,
            },
          },
        }),
        dynamicPluginsFeatureLoader({
          moduleLoader: jestFreeTypescriptAwareModuleLoader,
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
          },
        }),
        dynamicPluginsFeatureLoader({
          moduleLoader: jestFreeTypescriptAwareModuleLoader,
          transports: [mockedTransport],
          format: winston.format.simple(),
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
          },
        }),
        dynamicPluginsFeatureLoader({
          moduleLoader: jestFreeTypescriptAwareModuleLoader,
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

  it('should access the module federation assets of the frontend plugin through the backend plugin', async () => {
    const { server } = await startTestBackend({
      features: [
        mockServices.rootConfig.factory({
          data: {
            dynamicPlugins: {
              rootDirectory: dynamicPluginsRootDirectory,
            },
          },
        }),
        dynamicPluginsFeatureLoader({
          moduleLoader: jestFreeTypescriptAwareModuleLoader,
        }),
      ],
    });

    const list = await fetch(
      `http://localhost:${server.port()}/api/test/frontend-plugins`,
    );
    expect(list.ok).toBe(true);
    expect(await list.json()).toEqual({
      'plugin-test-dynamic': `http://localhost:${server.port()}/api/test/frontend-plugins/plugin-test-dynamic/mf-manifest.json`,
    });

    const manifest = await fetch(
      `http://localhost:${server.port()}/api/test/frontend-plugins/plugin-test-dynamic/mf-manifest.json`,
    );
    expect(manifest.ok).toBe(true);
    expect(await manifest.json()).toMatchObject({
      exposes: [],
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
          },
        }),
        dynamicPluginsFeatureLoader({
          moduleLoader: jestFreeTypescriptAwareModuleLoader,
          transports: [mockedTransport],
          format: winston.format.simple(),
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
});
