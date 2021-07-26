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
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either expressed or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  errorHandler,
  getVoidLogger,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import { CatalogClient } from '@backstage/catalog-client';
import { ConfigReader } from '@backstage/config';
import { NotModifiedError } from '@backstage/errors';
import {
  GeneratorBuilder,
  PreparerBuilder,
  PublisherBase,
} from '@backstage/techdocs-common';
import express, { Response } from 'express';
import request from 'supertest';
import { DocsSynchronizer, DocsSynchronizerSyncOpts } from './DocsSynchronizer';
import { createEventStream, createHttpResponse, createRouter } from './router';

jest.mock('@backstage/catalog-client');
jest.mock('@backstage/config');
jest.mock('./DocsSynchronizer');

const MockedConfigReader = ConfigReader as jest.MockedClass<
  typeof ConfigReader
>;
const MockCatalogClient = CatalogClient as jest.MockedClass<
  typeof CatalogClient
>;
const MockDocsSynchronizer = DocsSynchronizer as jest.MockedClass<
  typeof DocsSynchronizer
>;

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
  const discovery: jest.Mocked<PluginEndpointDiscovery> = {
    getBaseUrl: jest.fn(),
    getExternalBaseUrl: jest.fn(),
  };

  let app: express.Express;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  beforeEach(async () => {
    publisher.docsRouter.mockReturnValue(() => {});
    discovery.getBaseUrl.mockImplementation(async type => {
      return `http://backstage.local/api/${type}`;
    });

    const outOfTheBoxRouter = await createRouter({
      preparers,
      generators,
      publisher,
      config: new ConfigReader({}),
      logger: getVoidLogger(),
      discovery,
    });
    const recommendedRouter = await createRouter({
      publisher,
      config: new ConfigReader({}),
      logger: getVoidLogger(),
      discovery,
    });

    app = express();
    app.use(outOfTheBoxRouter);
    app.use('/recommended', recommendedRouter);
    app.use(errorHandler());
  });

  describe('GET /sync/:namespace/:kind/:name', () => {
    describe('accept application/json', () => {
      it('should return not found if entity is not found', async () => {
        MockCatalogClient.prototype.getEntityByName.mockResolvedValue(
          undefined,
        );

        const response = await request(app)
          .get('/sync/default/Component/test')
          .send();

        expect(response.status).toBe(404);
      });

      it('should return not found if entity has no uid', async () => {
        MockCatalogClient.prototype.getEntityByName.mockResolvedValue(
          entityWithoutMetadata,
        );

        const response = await request(app)
          .get('/sync/default/Component/test')
          .send();

        expect(response.status).toBe(404);
      });

      it('should not check for an update without local builder', async () => {
        MockedConfigReader.prototype.getString.mockReturnValue('external');
        MockCatalogClient.prototype.getEntityByName.mockResolvedValue(entity);

        const response = await request(app)
          .get('/sync/default/Component/test')
          .send();

        expect(response.status).toBe(304);
      });

      it('should error if missing builder', async () => {
        MockedConfigReader.prototype.getString.mockReturnValue('local');
        MockCatalogClient.prototype.getEntityByName.mockResolvedValue(entity);

        const response = await request(app)
          .get('/recommended/sync/default/Component/test')
          .send();

        expect(response.status).toBe(500);
        expect(response.text).toMatch(
          /Invalid configuration\. 'techdocs\.builder' was set to 'local' but no 'preparer' was provided to the router initialization/,
        );

        expect(MockDocsSynchronizer.prototype.doSync).toBeCalledTimes(0);
      });

      it('should execute synchronization', async () => {
        MockedConfigReader.prototype.getString.mockReturnValue('local');
        MockCatalogClient.prototype.getEntityByName.mockResolvedValue(entity);
        MockDocsSynchronizer.prototype.doSync.mockImplementation(
          async ({ responseHandler }) =>
            responseHandler.finish({ updated: true }),
        );

        await request(app).get('/sync/default/Component/test').send();

        expect(MockDocsSynchronizer.prototype.doSync).toBeCalledTimes(1);
        expect(MockDocsSynchronizer.prototype.doSync).toBeCalledWith({
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

      it('should return on updated', async () => {
        MockedConfigReader.prototype.getString.mockReturnValue('local');
        MockCatalogClient.prototype.getEntityByName.mockResolvedValue(entity);
        MockDocsSynchronizer.prototype.doSync.mockImplementation(
          async ({ responseHandler }) => {
            const { log, finish } = responseHandler;

            log('Some log');

            finish({ updated: true });
          },
        );

        const response = await request(app)
          .get('/sync/default/Component/test')
          .send();

        expect(response.status).toBe(201);
        expect(response.get('content-type')).toMatch(/application\/json/);
        expect(response.text).toEqual(
          '{"message":"Docs updated or did not need updating"}',
        );
      });
    });

    describe('accept text/event-stream', () => {
      it('should return not found if entity is not found', async () => {
        MockCatalogClient.prototype.getEntityByName.mockResolvedValue(
          undefined,
        );

        const response = await request(app)
          .get('/sync/default/Component/test')
          .set('accept', 'text/event-stream')
          .send();

        expect(response.status).toBe(404);
      });

      it('should return not found if entity has no uid', async () => {
        MockCatalogClient.prototype.getEntityByName.mockResolvedValue(
          entityWithoutMetadata,
        );

        const response = await request(app)
          .get('/sync/default/Component/test')
          .set('accept', 'text/event-stream')
          .send();

        expect(response.status).toBe(404);
      });

      it('should not check for an update without local builder', async () => {
        MockedConfigReader.prototype.getString.mockReturnValue('external');
        MockCatalogClient.prototype.getEntityByName.mockResolvedValue(entity);

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

      it('should error if missing builder', async () => {
        MockedConfigReader.prototype.getString.mockReturnValue('local');
        MockCatalogClient.prototype.getEntityByName.mockResolvedValue(entity);

        const response = await request(app)
          .get('/recommended/sync/default/Component/test')
          .set('accept', 'text/event-stream')
          .send();

        expect(response.status).toBe(200);
        expect(response.get('content-type')).toBe('text/event-stream');
        expect(response.text).toEqual(
          `event: error
data: "Invalid configuration. 'techdocs.builder' was set to 'local' but no 'preparer' was provided to the router initialization."

`,
        );

        expect(MockDocsSynchronizer.prototype.doSync).toBeCalledTimes(0);
      });

      it('should execute synchronization', async () => {
        MockedConfigReader.prototype.getString.mockReturnValue('local');
        MockCatalogClient.prototype.getEntityByName.mockResolvedValue(entity);
        MockDocsSynchronizer.prototype.doSync.mockImplementation(
          async ({ responseHandler }) =>
            responseHandler.finish({ updated: true }),
        );

        await request(app)
          .get('/sync/default/Component/test')
          .set('accept', 'text/event-stream')
          .send();

        expect(MockDocsSynchronizer.prototype.doSync).toBeCalledTimes(1);
        expect(MockDocsSynchronizer.prototype.doSync).toBeCalledWith({
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
        MockedConfigReader.prototype.getString.mockReturnValue('local');
        MockCatalogClient.prototype.getEntityByName.mockResolvedValue(entity);
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

    expect(res.writeHead).toBeCalledTimes(1);
    expect(res.writeHead).toBeCalledWith(200, {
      'Cache-Control': 'no-cache',
      Connection: 'keep-alive',
      'Content-Type': 'text/event-stream',
    });
  });

  it('should flush after write if defined', async () => {
    res.flush = jest.fn();

    handlers.log('A Message');

    expect(res.write).toBeCalledTimes(1);
    expect(res.write).toBeCalledWith(`event: log
data: "A Message"

`);
    expect(res.flush).toBeCalledTimes(1);
  });

  it('should write log', async () => {
    handlers.log('A Message');

    expect(res.write).toBeCalledTimes(1);
    expect(res.write).toBeCalledWith(`event: log
data: "A Message"

`);
    expect(res.end).toBeCalledTimes(0);
  });

  it('should write error and end the connection', async () => {
    handlers.error(new Error('Some Error'));

    expect(res.write).toBeCalledTimes(1);
    expect(res.write).toBeCalledWith(`event: error
data: "Some Error"

`);
    expect(res.end).toBeCalledTimes(1);
  });

  it('should finish and end the connection', async () => {
    handlers.finish({ updated: true });

    expect(res.write).toBeCalledTimes(1);
    expect(res.write).toBeCalledWith(`event: finish
data: {"updated":true}

`);

    expect(res.end).toBeCalledTimes(1);
  });
});

describe('createHttpResponse', () => {
  const res: jest.Mocked<Response> = {
    status: jest.fn(),
    json: jest.fn(),
  } as any;

  let handlers: DocsSynchronizerSyncOpts;

  beforeEach(() => {
    res.status.mockImplementation(() => res);
    handlers = createHttpResponse(res);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return CREATED if updated', async () => {
    handlers.finish({ updated: true });

    expect(res.status).toBeCalledTimes(1);
    expect(res.status).toBeCalledWith(201);

    expect(res.json).toBeCalledTimes(1);
    expect(res.json).toBeCalledWith({
      message: 'Docs updated or did not need updating',
    });
  });

  it('should return NOT_MODIFIED if not updated', async () => {
    expect(() => handlers.finish({ updated: false })).toThrowError(
      NotModifiedError,
    );
  });

  it('should throw custom error', async () => {
    expect(() => handlers.error(new Error('Some Error'))).toThrowError(
      /Some Error/,
    );
  });

  it('should ignore logs', async () => {
    expect(() => handlers.log('Some Message')).not.toThrow();
  });
});
