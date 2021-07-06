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
  errorHandler,
  getVoidLogger,
  PluginEndpointDiscovery,
} from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';
import { NotFoundError, NotModifiedError } from '@backstage/errors';
import {
  GeneratorBuilder,
  PreparerBuilder,
  PublisherBase,
} from '@backstage/techdocs-common';
import express, { Response } from 'express';
import request from 'supertest';
import { DocsSynchronizer, DocsSynchronizerSyncOpts } from './DocsSynchronizer';
import { createEventStream, createHttpResponse, createRouter } from './router';

jest.mock('./DocsSynchronizer');

const MockDocsSynchronizer = DocsSynchronizer as jest.MockedClass<
  typeof DocsSynchronizer
>;

describe('createRouter', () => {
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

    const router = await createRouter({
      preparers,
      generators,
      publisher,
      config: new ConfigReader({}),
      logger: getVoidLogger(),
      discovery,
    });

    router.use(errorHandler());
    app = express();
    app.use(router);
  });

  describe('GET /sync/:namespace/:kind/:name', () => {
    describe('accept application/json', () => {
      it('should execute synchronization', async () => {
        MockDocsSynchronizer.prototype.doSync.mockImplementation(
          async handler => handler().finish({ updated: true }),
        );

        await request(app).get('/sync/default/Component/test').send();

        expect(MockDocsSynchronizer.prototype.doSync).toBeCalledTimes(1);
        expect(MockDocsSynchronizer.prototype.doSync).toBeCalledWith(
          expect.any(Function),
          {
            kind: 'Component',
            name: 'test',
            namespace: 'default',
            token: undefined,
          },
        );
      });

      it('should return on updated', async () => {
        MockDocsSynchronizer.prototype.doSync.mockImplementation(
          async handler => {
            const { log, finish } = handler();

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

      it('should return error', async () => {
        MockDocsSynchronizer.prototype.doSync.mockImplementation(
          async handler => {
            const { log, error } = handler();

            log('Some log');

            error(new Error('Some Error'));
          },
        );

        const response = await request(app)
          .get('/sync/default/Component/test')
          .send();

        expect(response.status).toBe(500);
        expect(response.text).toMatch(/Some Error/);
      });

      it('should return not found', async () => {
        MockDocsSynchronizer.prototype.doSync.mockRejectedValue(
          new NotFoundError(),
        );

        const response = await request(app)
          .get('/sync/default/Component/test')
          .send();

        expect(response.status).toBe(404);
      });
    });

    describe('accept text/event-stream', () => {
      it('should execute synchronization', async () => {
        MockDocsSynchronizer.prototype.doSync.mockImplementation(
          async handler => handler().finish({ updated: true }),
        );

        await request(app)
          .get('/sync/default/Component/test')
          .set('accept', 'text/event-stream')
          .send();

        expect(MockDocsSynchronizer.prototype.doSync).toBeCalledTimes(1);
        expect(MockDocsSynchronizer.prototype.doSync).toBeCalledWith(
          expect.any(Function),
          {
            kind: 'Component',
            name: 'test',
            namespace: 'default',
            token: undefined,
          },
        );
      });

      it('should return an event-stream', async () => {
        MockDocsSynchronizer.prototype.doSync.mockImplementation(
          async handler => {
            const { log, finish } = handler();

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

      it('should return error', async () => {
        MockDocsSynchronizer.prototype.doSync.mockImplementation(
          async handler => {
            const { log, error } = handler();

            log('Some log');

            error(new Error('Some Error'));
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

event: error
data: "Some Error"

`,
        );
      });

      it('should return not found', async () => {
        MockDocsSynchronizer.prototype.doSync.mockRejectedValue(
          new NotFoundError(),
        );

        const response = await request(app)
          .get('/sync/default/Component/test')
          .set('accept', 'text/event-stream')
          .send();

        expect(response.status).toBe(404);
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
