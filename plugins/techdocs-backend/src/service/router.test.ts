/*
 * Copyright 2021 The Backstage Authors
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
  DocsBuildStrategy,
  GeneratorBuilder,
  PreparerBuilder,
  Publisher,
  PublisherBase,
} from '@backstage/plugin-techdocs-node';
import express, { Response } from 'express';
import request from 'supertest';
import { once } from 'node:events';
import { request as httpRequest } from 'node:http';
import { AddressInfo } from 'node:net';
import { Readable } from 'node:stream';
import { DocsSynchronizer, DocsSynchronizerSyncOpts } from './DocsSynchronizer';
import { CachedEntityLoader } from './CachedEntityLoader';
import { createEventStream, createRouter, RouterOptions } from './router';
import { TechDocsCache } from '../cache';
import {
  mockCredentials,
  mockErrorHandler,
  mockServices,
} from '@backstage/backend-test-utils';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { techDocsEntityReadPermission } from '@backstage/plugin-techdocs-common';

jest.mock('./CachedEntityLoader');
jest.mock('./DocsSynchronizer');
jest.mock('../cache/TechDocsCache');

const MockDocsSynchronizer = DocsSynchronizer as jest.MockedClass<
  typeof DocsSynchronizer
>;
const MockCachedEntityLoader = CachedEntityLoader as jest.MockedClass<
  typeof CachedEntityLoader
>;
const MockTechDocsCache = {
  get: jest.fn(),
  set: jest.fn(),
} as unknown as jest.Mocked<TechDocsCache>;
TechDocsCache.fromConfig = () => MockTechDocsCache;

const createApp = async (options: RouterOptions) => {
  const app = express();
  app.use(await createRouter(options));
  app.use(mockErrorHandler());
  return app;
};

const requestRawPath = async (app: express.Express, path: string) => {
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');

  try {
    const { port } = server.address() as AddressInfo;
    return await new Promise<number>((resolve, reject) => {
      const req = httpRequest({ host: '127.0.0.1', port, path }, res => {
        res.resume();
        res.on('end', () => resolve(res.statusCode ?? 0));
      });
      req.on('error', reject);
      req.end();
    });
  } finally {
    await new Promise<void>((resolve, reject) => {
      server.close(error => (error ? reject(error) : resolve()));
    });
  }
};

describe('createRouter', () => {
  const entity = {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      uid: '0',
      name: 'test',
    },
  };
  const entityWithoutMetadata = {
    ...entity,
    metadata: {
      ...entity.metadata,
      uid: undefined,
    },
  };

  const preparers: jest.Mocked<PreparerBuilder> = {
    register: jest.fn(),
    get: jest.fn(),
  };
  const generators: jest.Mocked<GeneratorBuilder> = {
    register: jest.fn(),
    get: jest.fn(),
  };
  const publisher: jest.Mocked<PublisherBase> = {
    docsRouter: jest.fn(),
    fetchTechDocsMetadata: jest.fn(),
    getReadiness: jest.fn(),
    hasDocsBeenGenerated: jest.fn(),
    publish: jest.fn(),
  };
  const discovery = mockServices.discovery.mock();

  const docsBuildStrategy: jest.Mocked<DocsBuildStrategy> = {
    shouldBuild: jest.fn(),
  };
  const mockCatalogService = catalogServiceMock();
  // Default permissions mock that allows all requests
  const defaultPermissionsMock = mockServices.permissions.mock({
    authorize: jest.fn().mockResolvedValue([{ result: AuthorizeResult.ALLOW }]),
    authorizeConditional: jest
      .fn()
      .mockResolvedValue([{ result: AuthorizeResult.ALLOW }]),
  });
  const techDocsPermissionsConfig = new ConfigReader({
    permission: { enabled: true },
    techdocs: { experimentalTechdocsPermissions: true },
  });
  const outOfTheBoxOptions = {
    preparers,
    generators,
    publisher,
    config: new ConfigReader({
      techdocs: {
        cache: {
          ttl: 1,
        },
      },
    }),
    logger: mockServices.logger.mock(),
    discovery,
    cache: mockServices.cache.mock(),
    docsBuildStrategy,
    auth: mockServices.auth(),
    httpAuth: mockServices.httpAuth(),
    permissions: defaultPermissionsMock,
    catalog: mockCatalogService,
  };
  const recommendedOptions = {
    publisher,
    config: new ConfigReader({}),
    logger: mockServices.logger.mock(),
    discovery,
    cache: mockServices.cache.mock(),
    docsBuildStrategy,
    auth: mockServices.auth(),
    httpAuth: mockServices.httpAuth(),
    permissions: defaultPermissionsMock,
    catalog: mockCatalogService,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  beforeEach(async () => {
    defaultPermissionsMock.authorize.mockResolvedValue([
      { result: AuthorizeResult.ALLOW },
    ]);
    publisher.docsRouter.mockReturnValue(() => {});
    discovery.getBaseUrl.mockImplementation(async type => {
      return `http://backstage.local/api/${type}`;
    });
    MockTechDocsCache.get.mockResolvedValue(undefined);
    MockTechDocsCache.set.mockResolvedValue();
  });

  describe('GET /sync/:namespace/:kind/:name', () => {
    describe('accept text/event-stream', () => {
      it('should return not found if entity is not found', async () => {
        const app = await createApp(outOfTheBoxOptions);

        MockCachedEntityLoader.prototype.load.mockResolvedValue(undefined);

        const response = await request(app)
          .get('/sync/default/Component/test')
          .set('accept', 'text/event-stream')
          .send();

        expect(response.status).toBe(404);
      });

      it('should return not found if entity has no uid', async () => {
        const app = await createApp(outOfTheBoxOptions);

        MockCachedEntityLoader.prototype.load.mockResolvedValue(
          entityWithoutMetadata,
        );

        const response = await request(app)
          .get('/sync/default/Component/test')
          .set('accept', 'text/event-stream')
          .send();

        expect(response.status).toBe(404);
      });

      it('should not check for an update when shouldBuild returns false', async () => {
        const app = await createApp(outOfTheBoxOptions);

        docsBuildStrategy.shouldBuild.mockResolvedValue(false);
        MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);
        MockDocsSynchronizer.prototype.doCacheSync.mockImplementation(
          async ({ responseHandler }) =>
            responseHandler.finish({ updated: false }),
        );

        const response = await request(app)
          .get('/sync/default/Component/test')
          .set('accept', 'text/event-stream')
          .send();

        expect(response.status).toBe(200);
        expect(response.get('content-type')).toBe('text/event-stream');
        expect(response.text).toEqual(
          `event: finish
data: {"updated":false}

`,
        );
      });

      it('should error if build is required and is missing preparer', async () => {
        const app = await createApp(recommendedOptions);

        docsBuildStrategy.shouldBuild.mockResolvedValue(true);
        MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);

        const response = await request(app)
          .get('/sync/default/Component/test')
          .set('accept', 'text/event-stream')
          .send();

        expect(response.status).toBe(200);
        expect(response.get('content-type')).toBe('text/event-stream');
        expect(response.text).toEqual(
          `event: error
data: "Invalid configuration. docsBuildStrategy.shouldBuild returned 'true', but no 'preparer' was provided to the router initialization."

`,
        );

        expect(MockDocsSynchronizer.prototype.doSync).toHaveBeenCalledTimes(0);
      });

      it('should execute synchronization', async () => {
        const app = await createApp(outOfTheBoxOptions);

        docsBuildStrategy.shouldBuild.mockResolvedValue(true);
        MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);
        MockDocsSynchronizer.prototype.doSync.mockImplementation(
          async ({ responseHandler }) =>
            responseHandler.finish({ updated: true }),
        );

        await request(app)
          .get('/sync/default/Component/test')
          .set('accept', 'text/event-stream')
          .send();

        expect(MockDocsSynchronizer.prototype.doSync).toHaveBeenCalledTimes(1);
        expect(MockDocsSynchronizer.prototype.doSync).toHaveBeenCalledWith({
          responseHandler: {
            log: expect.any(Function),
            error: expect.any(Function),
            finish: expect.any(Function),
          },
          entity,
          generators,
          preparers,
        });
      });

      it('should return an event-stream', async () => {
        const app = await createApp(outOfTheBoxOptions);

        docsBuildStrategy.shouldBuild.mockResolvedValue(true);
        MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);
        MockDocsSynchronizer.prototype.doSync.mockImplementation(
          async ({ responseHandler }) => {
            const { log, finish } = responseHandler;

            log('Some log');
            log('Another log');

            finish({ updated: true });
          },
        );

        const response = await request(app)
          .get('/sync/default/Component/test')
          .set('accept', 'text/event-stream')
          .send();

        expect(response.status).toBe(200);
        expect(response.get('content-type')).toBe('text/event-stream');
        expect(response.text).toEqual(
          `event: log
data: "Some log"

event: log
data: "Another log"

event: finish
data: {"updated":true}

`,
        );
      });

      it('should deny access when TechDocs permission is denied', async () => {
        const permissions = mockServices.permissions.mock({
          authorize: jest
            .fn()
            .mockResolvedValue([{ result: AuthorizeResult.DENY }]),
        });

        const app = await createApp({
          ...outOfTheBoxOptions,
          permissions,
          config: techDocsPermissionsConfig,
        });

        MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);

        const response = await request(app)
          .get('/sync/default/Component/test')
          .set('accept', 'text/event-stream')
          .send();

        expect(response.status).toBe(403);
      });

      it('should authorize and sync when TechDocs permission is allowed', async () => {
        const permissions = mockServices.permissions.mock({
          authorize: jest
            .fn()
            .mockResolvedValue([{ result: AuthorizeResult.ALLOW }]),
        });

        const app = await createApp({
          ...outOfTheBoxOptions,
          permissions,
          config: techDocsPermissionsConfig,
        });

        docsBuildStrategy.shouldBuild.mockResolvedValue(true);
        MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);
        MockDocsSynchronizer.prototype.doSync.mockImplementation(
          async ({ responseHandler }) =>
            responseHandler.finish({ updated: true }),
        );

        const response = await request(app)
          .get('/sync/default/Component/test')
          .set('accept', 'text/event-stream')
          .send();

        expect(response.status).toBe(200);
        expect(permissions.authorize).toHaveBeenCalled();
        expect(MockDocsSynchronizer.prototype.doSync).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('GET /static/docs', () => {
    it('should delegate to the publisher handler', async () => {
      const docsRouter = jest.fn((_req, res) => res.sendStatus(200));
      publisher.docsRouter.mockReturnValue(docsRouter);

      MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);

      const app = await createApp(outOfTheBoxOptions);

      const response = await request(app)
        .get('/static/docs/default/component/test')
        .send();

      expect(response.status).toBe(200);
      expect(docsRouter).toHaveBeenCalled();
    });

    it('should return assets from cache', async () => {
      MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);

      const entries = new Map<string, Buffer>();
      MockTechDocsCache.get.mockImplementation(async path => entries.get(path));
      MockTechDocsCache.set.mockImplementation(async (path, value) => {
        entries.set(path, value);
      });
      const docsRouter = jest.fn((_req, res) => res.send('content'));
      publisher.docsRouter.mockReturnValue(docsRouter);
      const app = await createApp(outOfTheBoxOptions);

      await request(app)
        .get('/static/docs/default/component/test')
        .expect(200, 'content');
      await new Promise(resolve => setTimeout(resolve, 0));

      await request(app)
        .get('/static/docs/default/component/test')
        .expect(200, 'content');

      expect(MockTechDocsCache.get).toHaveBeenCalledTimes(2);
      expect(MockTechDocsCache.set).toHaveBeenCalledTimes(1);
      expect(docsRouter).toHaveBeenCalledTimes(1);
    });

    it('should check entity access and TechDocs permission', async () => {
      const docsRouter = jest.fn((_req, res) => res.sendStatus(200));
      publisher.docsRouter.mockReturnValue(docsRouter);

      const permissions = mockServices.permissions.mock({
        authorize: jest
          .fn()
          .mockResolvedValue([{ result: AuthorizeResult.ALLOW }]),
      });

      const app = await createApp({
        ...outOfTheBoxOptions,
        permissions,
        config: techDocsPermissionsConfig,
      });

      MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);

      const response = await request(app)
        .get('/static/docs/default/component/test')
        .send();

      expect(response.status).toBe(200);
      expect(MockCachedEntityLoader.prototype.load).toHaveBeenCalled();
      expect(permissions.authorize).toHaveBeenCalled();
    });

    it('should deny access when TechDocs permission is denied', async () => {
      const docsRouter = jest.fn((_req, res) => res.sendStatus(200));
      publisher.docsRouter.mockReturnValue(docsRouter);

      const permissions = mockServices.permissions.mock({
        authorize: jest
          .fn()
          .mockResolvedValue([{ result: AuthorizeResult.DENY }]),
      });

      const app = await createApp({
        ...outOfTheBoxOptions,
        permissions,
        config: techDocsPermissionsConfig,
      });

      MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);

      const response = await request(app)
        .get('/static/docs/default/component/test')
        .send();

      expect(response.status).toBe(403);
    });

    it('should return 404 when entity is not found', async () => {
      const app = await createApp({
        ...outOfTheBoxOptions,
        config: techDocsPermissionsConfig,
      });

      MockCachedEntityLoader.prototype.load.mockResolvedValue(undefined);

      const response = await request(app)
        .get('/static/docs/default/component/test')
        .send();

      expect(response.status).toBe(404);
    });

    it('should only serve paths contained within the permission-checked entity', async () => {
      const docsRouter = jest.fn((_req, res) => res.sendStatus(200));
      publisher.docsRouter.mockReturnValue(docsRouter);

      const app = await createApp({
        ...outOfTheBoxOptions,
        config: new ConfigReader({
          permission: {
            enabled: true,
          },
        }),
      });

      MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);

      const containedStatus = await requestRawPath(
        app,
        '/static/docs/default/component/entity-a/dir/%2e%2e/index.html',
      );

      expect(containedStatus).toBe(200);
      expect(docsRouter).toHaveBeenCalledTimes(1);

      docsRouter.mockClear();

      const traversingStatus = await requestRawPath(
        app,
        '/static/docs/default/component/entity-a/%2e%2e/entity-b/index.html',
      );

      expect(traversingStatus).toBe(404);
      expect(docsRouter).not.toHaveBeenCalled();
    });

    it('should reject paths outside the authorized entity', async () => {
      const docsRouter = jest.fn((_req, res) => res.sendStatus(200));
      publisher.docsRouter.mockReturnValue(docsRouter);

      const app = await createApp({
        ...outOfTheBoxOptions,
        config: new ConfigReader({
          permission: {
            enabled: true,
          },
        }),
      });

      MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);

      const status = await requestRawPath(
        app,
        '/static/docs/default/component/test/../private/index.html',
      );

      expect(status).toBe(404);
    });

    it('should reject encoded separators that the publisher would decode', async () => {
      const docsRouter = jest.fn((_req, res) => res.sendStatus(200));
      publisher.docsRouter.mockReturnValue(docsRouter);

      const app = await createApp({
        ...outOfTheBoxOptions,
        config: new ConfigReader({
          permission: {
            enabled: true,
          },
        }),
      });

      MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);

      for (const rawPath of [
        '/static/docs/default/component/test/%2e%2e%2fprivate/index.html',
        '/static/docs/default/component/test/%2E%2E%2Fprivate/index.html',
        '/static/docs/default/component/test/%2fbad%ff',
      ]) {
        expect(await requestRawPath(app, rawPath)).toBe(404);
      }

      expect(docsRouter).not.toHaveBeenCalled();
    });

    it('should reject paths with empty segments before the publisher collapses them', async () => {
      const docsRouter = jest.fn((_req, res) => res.sendStatus(200));
      publisher.docsRouter.mockReturnValue(docsRouter);

      const permissions = mockServices.permissions.mock({
        authorize: jest
          .fn()
          .mockResolvedValue([{ result: AuthorizeResult.DENY }]),
      });

      const app = await createApp({
        ...outOfTheBoxOptions,
        permissions,
        config: techDocsPermissionsConfig,
      });

      MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);

      const status = await requestRawPath(
        app,
        '/static/docs/default//component/private/index.html',
      );

      expect(status).toBe(404);
      expect(docsRouter).not.toHaveBeenCalled();
    });

    it('should reject encoded Windows path separators outside the authorized entity', async () => {
      const config = new ConfigReader({
        permission: {
          enabled: true,
        },
        techdocs: {
          publisher: {
            type: 'azureBlobStorage',
            azureBlobStorage: {
              credentials: {
                accountName: 'example',
                accountKey: 'YWNjb3VudEtleQ==',
              },
              containerName: 'techdocs',
            },
          },
        },
      });
      const azurePublisher = await Publisher.fromConfig(config, {
        logger: outOfTheBoxOptions.logger,
        discovery,
      });
      const storageClient = Reflect.get(azurePublisher, 'storageClient') as {
        getContainerClient(name: string): {
          getBlockBlobClient(name: string): {
            readonly url: string;
            download(): Promise<{ readableStreamBody?: Readable }>;
          };
        };
      };
      const containerClient = storageClient.getContainerClient('techdocs');
      const getBlockBlobClient =
        containerClient.getBlockBlobClient.bind(containerClient);
      jest
        .spyOn(storageClient, 'getContainerClient')
        .mockReturnValue(containerClient);
      jest
        .spyOn(containerClient, 'getBlockBlobClient')
        .mockImplementation(name => {
          const blobClient = getBlockBlobClient(name);
          jest.spyOn(blobClient, 'download').mockImplementation(async () => {
            if (
              blobClient.url !==
              'https://example.blob.core.windows.net/techdocs/default/component/private/index.html'
            ) {
              throw new Error('File Not Found');
            }
            return { readableStreamBody: Readable.from('private content') };
          });
          return blobClient;
        });

      const app = await createApp({
        ...outOfTheBoxOptions,
        config,
        publisher: azurePublisher,
      });

      MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);

      const status = await requestRawPath(
        app,
        '/static/docs/default/component/test/..%5Cprivate/index.html',
      );

      expect(status).toBe(404);
    });

    it('should allow nested paths within the authorized entity', async () => {
      const docsRouter = jest.fn((_req, res) => res.sendStatus(200));
      publisher.docsRouter.mockReturnValue(docsRouter);

      const app = await createApp({
        ...outOfTheBoxOptions,
        config: new ConfigReader({
          permission: {
            enabled: true,
          },
        }),
      });

      MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);

      const response = await request(app)
        .get('/static/docs/default/component/test/assets/main.css')
        .send();

      expect(response.status).toBe(200);
    });
  });

  describe('GET /metadata/techdocs', () => {
    it('should return techdocs metadata when permission is allowed', async () => {
      const permissions = mockServices.permissions.mock({
        authorize: jest
          .fn()
          .mockResolvedValue([{ result: AuthorizeResult.ALLOW }]),
      });

      const app = await createApp({
        ...outOfTheBoxOptions,
        permissions,
        config: techDocsPermissionsConfig,
      });

      MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);
      publisher.fetchTechDocsMetadata.mockResolvedValue({
        site_name: 'Test',
        site_description: 'Test description',
        etag: 'abc123',
        build_timestamp: 1704067200,
      });

      const response = await request(app)
        .get('/metadata/techdocs/default/Component/test')
        .send();

      expect(response.status).toBe(200);
      expect(permissions.authorize).toHaveBeenCalled();
    });

    it('should deny access when TechDocs permission is denied', async () => {
      const permissions = mockServices.permissions.mock({
        authorize: jest
          .fn()
          .mockResolvedValue([{ result: AuthorizeResult.DENY }]),
      });

      const app = await createApp({
        ...outOfTheBoxOptions,
        permissions,
        config: techDocsPermissionsConfig,
      });

      MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);

      const response = await request(app)
        .get('/metadata/techdocs/default/Component/test')
        .send();

      expect(response.status).toBe(403);
    });
  });

  describe('GET /metadata/entity', () => {
    it('should check TechDocs permission before returning entity metadata', async () => {
      const permissions = mockServices.permissions.mock({
        authorize: jest
          .fn()
          .mockResolvedValue([{ result: AuthorizeResult.ALLOW }]),
      });

      const app = await createApp({
        ...outOfTheBoxOptions,
        permissions,
        config: techDocsPermissionsConfig,
      });

      MockCachedEntityLoader.prototype.load.mockResolvedValue({
        ...entity,
        metadata: {
          ...entity.metadata,
          annotations: {
            'backstage.io/techdocs-ref':
              'url:https://github.com/backstage/backstage',
          },
        },
      });

      const response = await request(app)
        .get('/metadata/entity/default/Component/test')
        .send();

      expect(response.status).toBe(200);
      expect(permissions.authorize).toHaveBeenCalled();
    });

    it('should deny access when TechDocs permission is denied', async () => {
      const permissions = mockServices.permissions.mock({
        authorize: jest
          .fn()
          .mockResolvedValue([{ result: AuthorizeResult.DENY }]),
      });

      const app = await createApp({
        ...outOfTheBoxOptions,
        permissions,
        config: techDocsPermissionsConfig,
      });

      MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);

      const response = await request(app)
        .get('/metadata/entity/default/Component/test')
        .send();

      expect(response.status).toBe(403);
    });
  });

  describe('techdocs.experimentalTechdocsPermissions', () => {
    it('should deny access for any result other than ALLOW', async () => {
      const permissions = mockServices.permissions.mock({
        // Not reachable through the typed authorize() contract, but the check
        // must stay fail-closed rather than allowing unrecognized results.
        authorize: jest
          .fn()
          .mockResolvedValue([{ result: AuthorizeResult.CONDITIONAL }]),
      });

      const app = await createApp({
        ...outOfTheBoxOptions,
        permissions,
        config: techDocsPermissionsConfig,
      });

      MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);

      const response = await request(app)
        .get('/metadata/techdocs/default/Component/test')
        .send();

      expect(response.status).toBe(403);
      expect(publisher.fetchTechDocsMetadata).not.toHaveBeenCalled();
    });

    it('should not authorize techdocs.entity.read while the flag is off', async () => {
      const permissions = mockServices.permissions.mock({
        authorize: jest
          .fn()
          .mockResolvedValue([{ result: AuthorizeResult.DENY }]),
      });

      const app = await createApp({
        ...outOfTheBoxOptions,
        permissions,
        config: new ConfigReader({ permission: { enabled: true } }),
      });

      MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);
      publisher.fetchTechDocsMetadata.mockResolvedValue({
        site_name: 'Test',
        site_description: 'Test description',
        etag: 'abc123',
        build_timestamp: 1704067200,
      });

      const response = await request(app)
        .get('/metadata/techdocs/default/Component/test')
        .send();

      // A denied techdocs.entity.read has no effect, and the entity is still
      // loaded with the caller's credentials so the catalog enforces
      // catalog.entity.read as before.
      expect(response.status).toBe(200);
      expect(permissions.authorize).not.toHaveBeenCalled();
      expect(MockCachedEntityLoader.prototype.load).toHaveBeenCalledWith(
        mockCredentials.user(),
        expect.objectContaining({ name: 'test' }),
      );
    });

    it('should serve documentation on catalog access alone while the flag is off', async () => {
      const docsRouter = jest.fn((_req, res) => res.sendStatus(200));
      publisher.docsRouter.mockReturnValue(docsRouter);

      const permissions = mockServices.permissions.mock({
        authorize: jest
          .fn()
          .mockResolvedValue([{ result: AuthorizeResult.DENY }]),
      });

      const app = await createApp({
        ...outOfTheBoxOptions,
        permissions,
        config: new ConfigReader({ permission: { enabled: true } }),
      });

      MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);

      const response = await request(app)
        .get('/static/docs/default/component/test/index.html')
        .send();

      expect(response.status).toBe(200);
      expect(permissions.authorize).not.toHaveBeenCalled();
      expect(MockCachedEntityLoader.prototype.load).toHaveBeenCalledWith(
        mockCredentials.user(),
        expect.objectContaining({ name: 'test' }),
      );

      // Without the permission framework the entity check is skipped entirely,
      // as it was before the flag existed.
      const defaultApp = await createApp({
        ...outOfTheBoxOptions,
        permissions,
      });

      expect(
        (await request(defaultApp).get('/static/docs/default/component/test'))
          .status,
      ).toBe(200);
      expect(permissions.authorize).not.toHaveBeenCalled();
    });

    it('should make techdocs.entity.read the only gate while the flag is on', async () => {
      const permissions = mockServices.permissions.mock({
        authorize: jest
          .fn()
          .mockResolvedValue([{ result: AuthorizeResult.ALLOW }]),
      });

      const app = await createApp({
        ...outOfTheBoxOptions,
        permissions,
        config: techDocsPermissionsConfig,
      });

      publisher.fetchTechDocsMetadata.mockResolvedValue({
        site_name: 'Test',
        site_description: 'Test description',
        etag: 'abc123',
        build_timestamp: 1704067200,
      });

      const response = await request(app)
        .get('/metadata/techdocs/default/Component/test')
        .send();

      expect(response.status).toBe(200);
      expect(permissions.authorize).toHaveBeenCalledWith(
        [
          {
            permission: techDocsEntityReadPermission,
            resourceRef: 'component:default/test',
          },
        ],
        { credentials: mockCredentials.user() },
      );
      // The entity content is not used on this route, so the catalog is not
      // queried at all once techdocs.entity.read authorizes the request.
      expect(MockCachedEntityLoader.prototype.load).not.toHaveBeenCalled();
    });

    it('should load the entity with the plugin credentials on routes that use it', async () => {
      const permissions = mockServices.permissions.mock({
        authorize: jest
          .fn()
          .mockResolvedValue([{ result: AuthorizeResult.ALLOW }]),
      });

      const app = await createApp({
        ...outOfTheBoxOptions,
        permissions,
        config: techDocsPermissionsConfig,
      });

      docsBuildStrategy.shouldBuild.mockResolvedValue(false);
      MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);

      const response = await request(app)
        .get('/sync/default/Component/test')
        .set('accept', 'text/event-stream')
        .send();

      expect(response.status).toBe(200);
      // This route needs the entity content, and access is already gated by
      // techdocs.entity.read, so the catalog lookup carries the plugin's own
      // credentials rather than the caller's.
      expect(MockCachedEntityLoader.prototype.load).toHaveBeenCalledWith(
        mockCredentials.service('plugin:test'),
        expect.objectContaining({ name: 'test' }),
      );
    });

    it('should keep catalog.entity.read on the entity metadata route', async () => {
      const permissions = mockServices.permissions.mock({
        authorize: jest
          .fn()
          .mockResolvedValue([{ result: AuthorizeResult.ALLOW }]),
      });

      const app = await createApp({
        ...outOfTheBoxOptions,
        permissions,
        config: techDocsPermissionsConfig,
      });

      MockCachedEntityLoader.prototype.load.mockResolvedValue({
        ...entity,
        metadata: {
          ...entity.metadata,
          annotations: {
            'backstage.io/techdocs-ref':
              'url:https://github.com/backstage/backstage',
          },
        },
      });

      const response = await request(app)
        .get('/metadata/entity/default/Component/test')
        .send();

      expect(response.status).toBe(200);
      // This route returns the entity itself, so it must still be looked up
      // with the caller's credentials rather than the plugin's.
      expect(MockCachedEntityLoader.prototype.load).toHaveBeenCalledWith(
        mockCredentials.user(),
        expect.objectContaining({ name: 'test' }),
      );
    });

    it('should warn and fall back to catalog access when the permission framework is disabled', async () => {
      const logger = mockServices.logger.mock();
      const permissions = mockServices.permissions.mock({
        authorize: jest
          .fn()
          .mockResolvedValue([{ result: AuthorizeResult.DENY }]),
      });

      const app = await createApp({
        ...outOfTheBoxOptions,
        logger,
        permissions,
        config: new ConfigReader({
          techdocs: { experimentalTechdocsPermissions: true },
        }),
      });

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('permission framework is disabled'),
      );

      MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);
      publisher.fetchTechDocsMetadata.mockResolvedValue({
        site_name: 'Test',
        site_description: 'Test description',
        etag: 'abc123',
        build_timestamp: 1704067200,
      });

      // The flag has no effect: techdocs.entity.read is not authorized and the
      // entity is still loaded with the caller's credentials so the catalog
      // enforces catalog.entity.read as before.
      const response = await request(app)
        .get('/metadata/techdocs/default/Component/test')
        .send();

      expect(response.status).toBe(200);
      expect(permissions.authorize).not.toHaveBeenCalled();
      expect(MockCachedEntityLoader.prototype.load).toHaveBeenCalledWith(
        mockCredentials.user(),
        expect.objectContaining({ name: 'test' }),
      );
    });

    it('should warn when documentation is served straight from storage', async () => {
      const logger = mockServices.logger.mock();

      await createApp({
        ...outOfTheBoxOptions,
        logger,
        config: new ConfigReader({
          permission: { enabled: true },
          techdocs: {
            experimentalTechdocsPermissions: true,
            storageUrl: 'https://example.com/docs',
          },
        }),
      });

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('techdocs.storageUrl'),
      );
    });
  });
});

describe('createEventStream', () => {
  const res: jest.Mocked<Response> = {
    writeHead: jest.fn(),
    write: jest.fn(),
    end: jest.fn(),
  } as any;

  let handlers: DocsSynchronizerSyncOpts;

  beforeEach(() => {
    handlers = createEventStream(res);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return correct event stream', async () => {
    // called in beforeEach

    expect(res.writeHead).toHaveBeenCalledTimes(1);
    expect(res.writeHead).toHaveBeenCalledWith(200, {
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    });
  });

  it('should flush after write if defined', async () => {
    res.flush = jest.fn();

    handlers.log('A Message');

    expect(res.write).toHaveBeenCalledTimes(1);
    expect(res.write).toHaveBeenCalledWith(`event: log
data: "A Message"

`);
    expect(res.flush).toHaveBeenCalledTimes(1);
  });

  it('should write log', async () => {
    handlers.log('A Message');

    expect(res.write).toHaveBeenCalledTimes(1);
    expect(res.write).toHaveBeenCalledWith(`event: log
data: "A Message"

`);
    expect(res.end).toHaveBeenCalledTimes(0);
  });

  it('should write error and end the connection', async () => {
    handlers.error(new Error('Some Error'));

    expect(res.write).toHaveBeenCalledTimes(1);
    expect(res.write).toHaveBeenCalledWith(`event: error
data: "Some Error"

`);
    expect(res.end).toHaveBeenCalledTimes(1);
  });

  it('should finish and end the connection', async () => {
    handlers.finish({ updated: true });

    expect(res.write).toHaveBeenCalledTimes(1);
    expect(res.write).toHaveBeenCalledWith(`event: finish
data: {"updated":true}

`);

    expect(res.end).toHaveBeenCalledTimes(1);
  });
});
