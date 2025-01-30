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

import {
  PluginCacheManager,
  loggerToWinstonLogger,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import {
  DocsBuildStrategy,
  GeneratorBuilder,
  PreparerBuilder,
  PublisherBase,
} from '@backstage/plugin-techdocs-node';
import express, { Response } from 'express';
import request from 'supertest';
import { DocsSynchronizer, DocsSynchronizerSyncOpts } from './DocsSynchronizer';
import { CachedEntityLoader } from './CachedEntityLoader';
import { createEventStream, createRouter, RouterOptions } from './router';
import { TechDocsCache } from '../cache';
import { mockErrorHandler, mockServices } from '@backstage/backend-test-utils';

jest.mock('@backstage/catalog-client');
jest.mock('@backstage/config');
jest.mock('./CachedEntityLoader');
jest.mock('./DocsSynchronizer');
jest.mock('../cache/TechDocsCache');

const MockedConfigReader = ConfigReader as jest.MockedClass<
  typeof ConfigReader
>;
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

const getMockHttpResponseFor = (content: string): Buffer => {
  return Buffer.from(
    [
      'HTTP/1.1 200 OK',
      'Content-Type: text/plain; charset=utf-8',
      'Accept-Ranges: bytes',
      'Cache-Control: public, max-age=0',
      'Last-Modified: Sat, 1 Jul 2021 12:00:00 GMT',
      'Date: Sat, 1 Jul 2021 12:00:00 GMT',
      'Connection: close',
      `Content-Length: ${content.length}`,
      '',
      content,
    ].join('\r\n'),
  );
};

const createApp = async (options: RouterOptions) => {
  const app = express();
  app.use(await createRouter(options));
  app.use(mockErrorHandler());
  return app;
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
  const cache: jest.Mocked<PluginCacheManager> = {
    getClient: jest.fn(),
  };
  const docsBuildStrategy: jest.Mocked<DocsBuildStrategy> = {
    shouldBuild: jest.fn(),
  };
  const outOfTheBoxOptions = {
    preparers,
    generators,
    publisher,
    config: new ConfigReader({}),
    logger: loggerToWinstonLogger(mockServices.logger.mock()),
    discovery,
    cache,
    docsBuildStrategy,
  };
  const recommendedOptions = {
    publisher,
    config: new ConfigReader({}),
    logger: loggerToWinstonLogger(mockServices.logger.mock()),
    discovery,
    cache,
    docsBuildStrategy,
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  beforeEach(async () => {
    publisher.docsRouter.mockReturnValue(() => {});
    discovery.getBaseUrl.mockImplementation(async type => {
      return `http://backstage.local/api/${type}`;
    });
    MockedConfigReader.prototype.getOptionalNumber.mockImplementation(key =>
      key === 'techdocs.cache.ttl' ? 1 : undefined,
    );
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
    });
  });

  describe('GET /static/docs', () => {
    it('should delegate to the publisher handler', async () => {
      const docsRouter = jest.fn((_req, res) => res.sendStatus(200));
      publisher.docsRouter.mockReturnValue(docsRouter);

      const app = await createApp(outOfTheBoxOptions);

      const response = await request(app)
        .get('/static/docs/default/component/test')
        .send();

      expect(response.status).toBe(200);
      expect(docsRouter).toHaveBeenCalled();
    });

    it('should return assets from cache', async () => {
      const app = await createApp(outOfTheBoxOptions);

      MockTechDocsCache.get.mockResolvedValue(
        getMockHttpResponseFor('content'),
      );

      const response = await request(app)
        .get('/static/docs/default/component/test')
        .send();

      expect(response.status).toBe(200);
      expect(MockTechDocsCache.get).toHaveBeenCalled();
    });

    it('should check entity access when permissions are enabled', async () => {
      MockedConfigReader.prototype.getOptionalBoolean.mockImplementation(key =>
        key === 'permission.enabled' ? true : undefined,
      );
      const docsRouter = jest.fn((_req, res) => res.sendStatus(200));
      publisher.docsRouter.mockReturnValue(docsRouter);

      const app = await createApp(outOfTheBoxOptions);

      MockCachedEntityLoader.prototype.load.mockResolvedValue(entity);

      const response = await request(app)
        .get('/static/docs/default/component/test')
        .send();

      expect(response.status).toBe(200);
      expect(MockCachedEntityLoader.prototype.load).toHaveBeenCalled();
    });

    it('should not return assets without corresponding entity access', async () => {
      MockedConfigReader.prototype.getOptionalBoolean.mockImplementation(key =>
        key === 'permission.enabled' ? true : undefined,
      );

      const app = await createApp(outOfTheBoxOptions);

      MockCachedEntityLoader.prototype.load.mockResolvedValue(undefined);

      const response = await request(app)
        .get('/static/docs/default/component/test')
        .send();

      expect(response.status).toBe(404);
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
