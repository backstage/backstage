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

import { createBackendModule } from '@backstage/backend-plugin-api';
import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { searchEngineRegistryExtensionPoint } from '@backstage/plugin-search-backend-node/alpha';
import {
  opensearchAuthExtensionPoint,
  type OpenSearchAuthProvider,
} from './auth';
import { OpenSearchSearchEngine } from './engines/OpenSearchSearchEngine';
import searchModuleOpensearch from './module';
import {
  opensearchProviderExtensionPoint,
  type OpenSearchProvider,
} from './providers';

const config = (data: object) => mockServices.rootConfig.factory({ data });

const searchEngineRegistry = {
  setSearchEngine: jest.fn(),
};

describe('searchModuleOpensearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers an OpenSearch search engine when configuration is present', async () => {
    await startTestBackend({
      extensionPoints: [
        [searchEngineRegistryExtensionPoint, searchEngineRegistry],
      ],
      features: [
        searchModuleOpensearch,
        config({
          search: {
            opensearch: { node: 'http://localhost:9200' },
          },
        }),
      ],
    });

    expect(searchEngineRegistry.setSearchEngine).toHaveBeenCalledTimes(1);
    expect(searchEngineRegistry.setSearchEngine).toHaveBeenCalledWith(
      expect.any(OpenSearchSearchEngine),
    );
  });

  it('skips initialization and warns when no OpenSearch configuration is present', async () => {
    const logger = mockServices.logger.mock();

    await startTestBackend({
      extensionPoints: [
        [searchEngineRegistryExtensionPoint, searchEngineRegistry],
      ],
      features: [searchModuleOpensearch, logger.factory, config({})],
    });

    expect(searchEngineRegistry.setSearchEngine).not.toHaveBeenCalled();
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining(
        'No configuration found under "search.opensearch"',
      ),
    );
  });

  it('passes a custom authentication provider to the engine', async () => {
    const authProvider: OpenSearchAuthProvider = {
      getAuthHeaders: jest
        .fn()
        .mockResolvedValue({ Authorization: 'Bearer x' }),
    };
    const authModule = createBackendModule({
      pluginId: 'search',
      moduleId: 'test-opensearch-auth',
      register(env) {
        env.registerInit({
          deps: { opensearchAuth: opensearchAuthExtensionPoint },
          async init({ opensearchAuth }) {
            opensearchAuth.setAuthProvider(authProvider);
          },
        });
      },
    });
    const fromConfig = jest.spyOn(OpenSearchSearchEngine, 'fromConfig');

    await startTestBackend({
      extensionPoints: [
        [searchEngineRegistryExtensionPoint, searchEngineRegistry],
      ],
      features: [
        searchModuleOpensearch,
        authModule,
        config({ search: { opensearch: { node: 'http://localhost:9200' } } }),
      ],
    });

    expect(fromConfig).toHaveBeenCalledWith(
      expect.objectContaining({ authProvider }),
    );
    fromConfig.mockRestore();
  });

  it('uses a provider registered through the provider extension point', async () => {
    const createClientOptions = jest
      .fn()
      .mockResolvedValue({ node: 'http://custom:9200' });
    const provider: OpenSearchProvider = {
      id: 'managed-opensearch',
      createClientOptions,
    };
    const providerModule = createBackendModule({
      pluginId: 'search',
      moduleId: 'test-opensearch-provider',
      register(env) {
        env.registerInit({
          deps: { opensearchProviders: opensearchProviderExtensionPoint },
          async init({ opensearchProviders }) {
            opensearchProviders.addProvider(provider);
          },
        });
      },
    });

    await startTestBackend({
      extensionPoints: [
        [searchEngineRegistryExtensionPoint, searchEngineRegistry],
      ],
      features: [
        searchModuleOpensearch,
        providerModule,
        config({
          search: {
            opensearch: {
              provider: 'managed-opensearch',
              node: 'http://unused:9200',
            },
          },
        }),
      ],
    });

    expect(createClientOptions).toHaveBeenCalledTimes(1);
    expect(searchEngineRegistry.setSearchEngine).toHaveBeenCalledTimes(1);
  });

  it('rejects duplicate provider registrations and duplicate auth providers', async () => {
    const provider: OpenSearchProvider = {
      id: 'duplicate',
      createClientOptions: jest.fn().mockResolvedValue({ node: 'http://x' }),
    };
    const duplicateProviderModule = createBackendModule({
      pluginId: 'search',
      moduleId: 'test-duplicate-provider',
      register(env) {
        env.registerInit({
          deps: { opensearchProviders: opensearchProviderExtensionPoint },
          async init({ opensearchProviders }) {
            opensearchProviders.addProvider(provider);
            opensearchProviders.addProvider(provider);
          },
        });
      },
    });

    await expect(
      startTestBackend({
        extensionPoints: [
          [searchEngineRegistryExtensionPoint, searchEngineRegistry],
        ],
        features: [searchModuleOpensearch, duplicateProviderModule],
      }),
    ).rejects.toThrow(/was already registered/);
  });

  it('fails clearly for an unsupported provider', async () => {
    await expect(
      startTestBackend({
        extensionPoints: [
          [searchEngineRegistryExtensionPoint, searchEngineRegistry],
        ],
        features: [
          searchModuleOpensearch,
          config({
            search: { opensearch: { provider: 'unknown', node: 'http://x' } },
          }),
        ],
      }),
    ).rejects.toThrow(/Unsupported OpenSearch provider 'unknown'/);
  });
});
