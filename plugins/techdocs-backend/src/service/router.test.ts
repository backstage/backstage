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
import {
  GeneratorBuilder,
  PreparerBuilder,
  PublisherBase,
} from '@backstage/techdocs-common';
import express from 'express';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import request from 'supertest';
import { DocsBuilder, shouldCheckForUpdate } from '../DocsBuilder';
import { createRouter } from './router';

jest.mock('@backstage/config');
jest.mock('../DocsBuilder');

const MockedConfigReader = ConfigReader as jest.MockedClass<
  typeof ConfigReader
>;
const MockedDocsBuilder = DocsBuilder as jest.MockedClass<typeof DocsBuilder>;

const server = setupServer();

describe('createRouter', () => {
  // the calls from supertest should not be handled by msw so we only warn onUnhandledRequest
  beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
  afterAll(() => server.close());
  afterEach(() => server.resetHandlers());

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
    it('should execute an update', async () => {
      (shouldCheckForUpdate as jest.Mock).mockReturnValue(true);
      MockedConfigReader.prototype.getString.mockReturnValue('local');

      const entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          uid: '0',
          name: 'test',
          namespace: 'default',
          annotations: {
            'sda.se/release-notes-location':
              'github-releases:https://github.com/backstage/backstage',
          },
        },
      };

      server.use(
        rest.get(
          'http://backstage.local/api/catalog/entities/by-name/Component/default/test',
          (_req, res, ctx) => {
            return res(ctx.json(entity));
          },
        ),
      );

      MockedDocsBuilder.prototype.build.mockImplementation(async () => {
        // extract the logStream from the constructor call
        const logStream = MockedDocsBuilder.mock.calls[0][0].logStream;

        logStream?.write('Some log');
        logStream?.write('Another log');

        return true;
      });

      publisher.hasDocsBeenGenerated.mockResolvedValue(true);

      const response = await request(app)
        .get('/sync/default/Component/test')
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

      expect(shouldCheckForUpdate).toBeCalledTimes(1);
      expect(MockedConfigReader.prototype.getString).toBeCalledTimes(1);
      expect(DocsBuilder.prototype.build).toBeCalledTimes(1);
    });

    it('should not check for an update too often', async () => {
      (shouldCheckForUpdate as jest.Mock).mockReturnValue(false);

      const entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          uid: '0',
          name: 'test',
          namespace: 'default',
          annotations: {
            'sda.se/release-notes-location':
              'github-releases:https://github.com/backstage/backstage',
          },
        },
      };

      server.use(
        rest.get(
          'http://backstage.local/api/catalog/entities/by-name/Component/default/test',
          (_req, res, ctx) => {
            return res(ctx.json(entity));
          },
        ),
      );

      const response = await request(app)
        .get('/sync/default/Component/test')
        .send();

      expect(response.status).toBe(200);
      expect(response.get('content-type')).toBe('text/event-stream');
      expect(response.text).toEqual(
        `event: finish
data: {"updated":false}

`,
      );

      expect(shouldCheckForUpdate).toBeCalledTimes(1);
      expect(MockedConfigReader.prototype.getString).toBeCalledTimes(0);
      expect(DocsBuilder.prototype.build).toBeCalledTimes(0);
    });

    it('should not check for an update without local builder', async () => {
      (shouldCheckForUpdate as jest.Mock).mockReturnValue(true);
      MockedConfigReader.prototype.getString.mockReturnValue('external');

      const entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          uid: '0',
          name: 'test',
          namespace: 'default',
          annotations: {
            'sda.se/release-notes-location':
              'github-releases:https://github.com/backstage/backstage',
          },
        },
      };

      server.use(
        rest.get(
          'http://backstage.local/api/catalog/entities/by-name/Component/default/test',
          (_req, res, ctx) => {
            return res(ctx.json(entity));
          },
        ),
      );

      const response = await request(app)
        .get('/sync/default/Component/test')
        .send();

      expect(response.status).toBe(200);
      expect(response.get('content-type')).toBe('text/event-stream');
      expect(response.text).toEqual(
        `event: finish
data: {"updated":false}

`,
      );

      expect(shouldCheckForUpdate).toBeCalledTimes(1);
      expect(MockedConfigReader.prototype.getString).toBeCalledTimes(1);
      expect(DocsBuilder.prototype.build).toBeCalledTimes(0);
    });

    it('rejects when entity is not found', async () => {
      server.use(
        rest.get(
          'http://backstage.local/api/catalog/entities/by-name/Component/default/test',
          (_req, res, ctx) => {
            return res(ctx.status(404));
          },
        ),
      );

      const response = await request(app)
        .get('/sync/default/Component/test')
        .send();

      expect(response.status).toBe(404);
    });
  });
});
