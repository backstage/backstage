/*
 * Copyright 2025 The Backstage Authors
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

import { ConfigReader } from '@backstage/config';
import {
  AuthService,
  DiscoveryService,
  LoggerService,
  RootSystemMetadataService,
} from '@backstage/backend-plugin-api';
import { EntityProviderConnection } from '@backstage/plugin-catalog-node';
import { InternalOpenApiDocumentationProvider } from './InternalOpenApiDocumentationProvider';

jest.mock('cross-fetch', () => jest.fn());

const mockFetch = jest.requireMock('cross-fetch') as jest.Mock;

function makeLogger(): LoggerService {
  return {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    debug: jest.fn(),
    child: jest.fn().mockReturnThis(),
  } as unknown as LoggerService;
}

function makeDiscovery(baseUrl = 'http://localhost:7007'): DiscoveryService {
  return {
    getBaseUrl: jest.fn().mockResolvedValue(baseUrl),
    getExternalBaseUrl: jest.fn().mockResolvedValue(baseUrl),
  };
}

function makeAuth(): AuthService {
  return {
    getOwnServiceCredentials: jest.fn().mockResolvedValue({}),
    getPluginRequestToken: jest
      .fn()
      .mockResolvedValue({ token: 'mock-token', expiresAt: new Date() }),
    authenticate: jest.fn(),
    getLimitedUserToken: jest.fn(),
    listPublicServiceKeys: jest.fn(),
    isPrincipal: jest.fn(),
  } as unknown as AuthService;
}

function makeConnection(): EntityProviderConnection {
  return {
    applyMutation: jest.fn().mockResolvedValue(undefined),
    refresh: jest.fn(),
  };
}

function makeSystemMetadata(
  plugins: string[],
): jest.Mocked<RootSystemMetadataService> {
  return {
    getInstalledPlugins: jest
      .fn()
      .mockResolvedValue(plugins.map(pluginId => ({ pluginId }))),
  };
}

/** A minimal valid OpenAPI spec that openapi-merge will accept. */
const minimalSpec = {
  openapi: '3.0.3' as const,
  info: { title: 'Test', version: '1' },
  paths: {},
};

describe('InternalOpenApiDocumentationProvider', () => {
  let logger: LoggerService;
  let discovery: DiscoveryService;
  let auth: AuthService;
  let connection: EntityProviderConnection;

  beforeEach(() => {
    jest.clearAllMocks();
    logger = makeLogger();
    discovery = makeDiscovery();
    auth = makeAuth();
    connection = makeConnection();

    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => minimalSpec,
      text: async () => JSON.stringify(minimalSpec),
      status: 200,
      body: true,
      statusText: 'OK',
    });
  });

  function makeProvider(
    configData: Record<string, unknown>,
    systemMetadata: RootSystemMetadataService,
  ) {
    const config = new ConfigReader({
      backend: { baseUrl: 'http://localhost:7007' },
      ...configData,
    });
    const taskRunner = {
      run: jest.fn(async ({ fn }: { fn: () => Promise<void> }) => fn()),
    };
    const scheduler = {
      createScheduledTaskRunner: jest.fn().mockReturnValue(taskRunner),
    } as any;
    return InternalOpenApiDocumentationProvider.fromConfig(config, {
      discovery,
      schedule: scheduler,
      logger,
      auth,
      rootSystemMetadata: systemMetadata,
    });
  }

  describe('plugin discovery', () => {
    it('uses getInstalledPlugins() when no explicit plugins config is set', async () => {
      const systemMetadata = makeSystemMetadata(['catalog', 'scaffolder']);
      const provider = makeProvider({}, systemMetadata);
      await provider.connect(connection);

      expect(systemMetadata.getInstalledPlugins).toHaveBeenCalled();
      expect(discovery.getBaseUrl).toHaveBeenCalledWith('catalog');
      expect(discovery.getBaseUrl).toHaveBeenCalledWith('scaffolder');
    });

    it('uses explicit plugins config when set (deprecated override)', async () => {
      const systemMetadata = makeSystemMetadata(['should-not-be-used']);
      const provider = makeProvider(
        {
          catalog: {
            providers: {
              backstageOpenapi: { plugins: ['explicit-plugin'] },
            },
          },
        },
        systemMetadata,
      );
      await provider.connect(connection);

      expect(systemMetadata.getInstalledPlugins).not.toHaveBeenCalled();
      expect(discovery.getBaseUrl).toHaveBeenCalledWith('explicit-plugin');
      expect(discovery.getBaseUrl).not.toHaveBeenCalledWith(
        'should-not-be-used',
      );
    });

    it('emits the catalog entity after a successful refresh', async () => {
      const systemMetadata = makeSystemMetadata(['catalog']);
      const provider = makeProvider({}, systemMetadata);
      await provider.connect(connection);

      expect(connection.applyMutation).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'full',
          entities: expect.arrayContaining([
            expect.objectContaining({
              entity: expect.objectContaining({ kind: 'API' }),
            }),
          ]),
        }),
      );
    });
  });
});
