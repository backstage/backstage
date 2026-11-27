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
  openapi: '3.1.0' as const,
  info: { title: 'Test', version: '1' },
  paths: {},
};

/**
 * Build an OpenAPI spec declaring a single trivial GET path, parameterised
 * by the version and path so tests can set up multiple plugins whose outputs
 * can be told apart in the merged document.
 */
function makeSpec(args: {
  openapi: string;
  path: string;
  securitySchemes?: Record<string, unknown>;
}) {
  return {
    openapi: args.openapi,
    info: { title: 'Test', version: '1' },
    paths: {
      [args.path]: {
        get: {
          responses: {
            '200': { description: 'ok' },
          },
        },
      },
    },
    ...(args.securitySchemes
      ? { components: { securitySchemes: args.securitySchemes } }
      : {}),
  };
}

/**
 * Program the shared mockFetch so each pluginId resolves to its own spec.
 * The discovery service hands out `http://localhost:7007/<pluginId>` and the
 * provider appends `/openapi.json`, so matching on `/<pluginId>/openapi.json`
 * is enough to route each call.
 */
function mockPluginSpecs(specsByPluginId: Record<string, unknown>) {
  mockFetch.mockImplementation(async (url: string) => {
    const match = Object.keys(specsByPluginId).find(pluginId =>
      url.includes(`/${pluginId}/openapi.json`),
    );
    if (!match) {
      return {
        ok: false,
        status: 404,
        statusText: 'Not Found',
        body: false,
        text: async () => 'Not Found',
        json: async () => ({}),
      };
    }
    const spec = specsByPluginId[match];
    return {
      ok: true,
      status: 200,
      statusText: 'OK',
      body: true,
      text: async () => JSON.stringify(spec),
      json: async () => spec,
    };
  });
}

function makePerPluginDiscovery(baseUrl = 'http://localhost:7007') {
  return {
    getBaseUrl: jest
      .fn()
      .mockImplementation(async (pluginId: string) => `${baseUrl}/${pluginId}`),
    getExternalBaseUrl: jest.fn().mockResolvedValue(baseUrl),
  } as unknown as DiscoveryService;
}

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

  describe('mixed OpenAPI versions', () => {
    beforeEach(() => {
      discovery = makePerPluginDiscovery();
    });

    it('skips specs whose OpenAPI minor version does not match the seed', async () => {
      mockPluginSpecs({
        'plugin-a': makeSpec({ openapi: '3.1.0', path: '/a' }),
        'plugin-b': makeSpec({ openapi: '3.0.3', path: '/b' }),
      });
      const systemMetadata = makeSystemMetadata(['plugin-a', 'plugin-b']);
      const provider = makeProvider({}, systemMetadata);

      await provider.connect(connection);

      expect(connection.applyMutation).toHaveBeenCalledTimes(1);
      const call = (connection.applyMutation as jest.Mock).mock.calls[0][0];
      const definition = JSON.parse(call.entities[0].entity.spec.definition);
      expect(Object.keys(definition.paths)).toContain('/a');
      expect(Object.keys(definition.paths)).not.toContain('/b');
    });

    it('logs an error naming the plugin whose spec was skipped', async () => {
      mockPluginSpecs({
        'plugin-a': makeSpec({ openapi: '3.1.0', path: '/a' }),
        'plugin-b': makeSpec({ openapi: '3.0.3', path: '/b' }),
      });
      const systemMetadata = makeSystemMetadata(['plugin-a', 'plugin-b']);
      const provider = makeProvider({}, systemMetadata);

      await provider.connect(connection);

      const errorCalls = (logger.error as jest.Mock).mock.calls.map(
        c => `${String(c[0])} ${JSON.stringify(c.slice(1))}`,
      );
      const match = errorCalls.find(
        line => line.includes('plugin-b') && line.includes('3.0.3'),
      );
      expect(match).toBeDefined();
    });

    it('still emits the entity when some specs are skipped', async () => {
      mockPluginSpecs({
        'plugin-a': makeSpec({ openapi: '3.1.0', path: '/a' }),
        'plugin-b': makeSpec({ openapi: '3.0.3', path: '/b' }),
      });
      const systemMetadata = makeSystemMetadata(['plugin-a', 'plugin-b']);
      const provider = makeProvider({}, systemMetadata);

      await provider.connect(connection);

      expect(connection.applyMutation).toHaveBeenCalled();
    });

    it('skips specs missing an OpenAPI version with a distinct error log', async () => {
      const specWithoutVersion = {
        info: { title: 'no-version', version: '1' },
        paths: {
          '/b': { get: { responses: { '200': { description: 'ok' } } } },
        },
      };
      mockPluginSpecs({
        'plugin-a': makeSpec({ openapi: '3.1.0', path: '/a' }),
        'plugin-b': specWithoutVersion,
      });
      const systemMetadata = makeSystemMetadata(['plugin-a', 'plugin-b']);
      const provider = makeProvider({}, systemMetadata);

      await provider.connect(connection);

      const errorCalls = (logger.error as jest.Mock).mock.calls.map(c =>
        String(c[0]),
      );
      const match = errorCalls.find(
        line =>
          line.includes('plugin-b') && line.includes('no OpenAPI version'),
      );
      expect(match).toBeDefined();
    });

    it('skips specs with an unparseable OpenAPI version string', async () => {
      mockPluginSpecs({
        'plugin-a': makeSpec({ openapi: '3.1.0', path: '/a' }),
        'plugin-b': makeSpec({ openapi: 'not-a-version', path: '/b' }),
      });
      const systemMetadata = makeSystemMetadata(['plugin-a', 'plugin-b']);
      const provider = makeProvider({}, systemMetadata);

      await provider.connect(connection);

      const errorCalls = (logger.error as jest.Mock).mock.calls.map(c =>
        String(c[0]),
      );
      const match = errorCalls.find(
        line =>
          line.includes('plugin-b') &&
          line.includes("unsupported OpenAPI version 'not-a-version'"),
      );
      expect(match).toBeDefined();
    });
  });

  describe('securitySchemes conflicts', () => {
    beforeEach(() => {
      discovery = makePerPluginDiscovery();
    });

    it('fails the refresh naming both conflicting plugins', async () => {
      mockPluginSpecs({
        'plugin-a': makeSpec({
          openapi: '3.1.0',
          path: '/a',
          securitySchemes: {
            JWT: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
          },
        }),
        'plugin-b': makeSpec({
          openapi: '3.1.0',
          path: '/b',
          securitySchemes: {
            JWT: { type: 'apiKey', in: 'header', name: 'X-API-Key' },
          },
        }),
      });
      const systemMetadata = makeSystemMetadata(['plugin-a', 'plugin-b']);
      const provider = makeProvider({}, systemMetadata);

      await expect(provider.connect(connection)).rejects.toThrow(
        /plugin-a[\s\S]*plugin-b|plugin-b[\s\S]*plugin-a/,
      );
    });
  });

  describe('non-security component conflicts', () => {
    beforeEach(() => {
      discovery = makePerPluginDiscovery();
    });

    it('auto-renames a conflicting schema with the plugin id prefix instead of failing', async () => {
      // Two plugins declare `components.schemas.Config` with different shapes.
      // The merge should resolve this via the dispute prefix (`<pluginId>-`)
      // rather than throw, because operations do not reference schemas by
      // bare name externally the way they reference security schemes.
      const specA = {
        openapi: '3.1.0',
        info: { title: 'a', version: '1' },
        paths: {
          '/a': { get: { responses: { '200': { description: 'ok' } } } },
        },
        components: {
          schemas: {
            Config: { type: 'object', properties: { x: { type: 'string' } } },
          },
        },
      };
      const specB = {
        openapi: '3.1.0',
        info: { title: 'b', version: '1' },
        paths: {
          '/b': { get: { responses: { '200': { description: 'ok' } } } },
        },
        components: {
          schemas: {
            Config: { type: 'object', properties: { y: { type: 'integer' } } },
          },
        },
      };
      mockPluginSpecs({ 'plugin-a': specA, 'plugin-b': specB });
      const systemMetadata = makeSystemMetadata(['plugin-a', 'plugin-b']);
      const provider = makeProvider({}, systemMetadata);

      await provider.connect(connection);

      expect(connection.applyMutation).toHaveBeenCalledTimes(1);
      const call = (connection.applyMutation as jest.Mock).mock.calls[0][0];
      const definition = JSON.parse(call.entities[0].entity.spec.definition);
      // Both schema definitions survive — the losing input is prefixed, not
      // dropped.
      const schemaNames = Object.keys(definition.components.schemas);
      expect(schemaNames).toContain('Config');
      expect(schemaNames.some(n => n.endsWith('-Config'))).toBe(true);
    });
  });
});
