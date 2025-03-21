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
import { ScmIntegrations } from '@backstage/integration';
import {
  GeneratorBuilder,
  PreparerBuilder,
  PublisherBase,
} from '@backstage/plugin-techdocs-node';
import { PassThrough } from 'stream';
import * as winston from 'winston';
import { TechDocsCache } from '../cache';
import { DocsBuilder, shouldCheckForUpdate } from '../DocsBuilder';
import { DocsSynchronizer, DocsSynchronizerSyncOpts } from './DocsSynchronizer';
import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';

jest.mock('../DocsBuilder');
jest.useFakeTimers();

const MockedDocsBuilder = DocsBuilder as jest.MockedClass<typeof DocsBuilder>;

describe('DocsSynchronizer', () => {
  const worker = setupServer();
  registerMswTestHooks(worker);

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
  const cache: jest.Mocked<TechDocsCache> = {
    get: jest.fn(),
    set: jest.fn(),
    invalidate: jest.fn(),
    invalidateMultiple: jest.fn(),
  } as unknown as jest.Mocked<TechDocsCache>;

  let docsSynchronizer: DocsSynchronizer;

  const mockResponseHandler: jest.Mocked<DocsSynchronizerSyncOpts> = {
    log: jest.fn(),
    finish: jest.fn(),
    error: jest.fn(),
  };

  const mockBuildLogTransport = new winston.transports.Stream({
    stream: new PassThrough(),
  });

  beforeEach(async () => {
    publisher.docsRouter.mockReturnValue(() => {});
    discovery.getBaseUrl.mockImplementation(async type => {
      return `http://backstage.local/api/${type}`;
    });

    docsSynchronizer = new DocsSynchronizer({
      publisher,
      config: new ConfigReader({}),
      logger: mockServices.logger.mock(),
      buildLogTransport: mockBuildLogTransport,
      scmIntegrations: ScmIntegrations.fromConfig(new ConfigReader({})),
      cache,
    });

    worker.use(
      http.get(
        'http://backstage.local/api/techdocs/static/docs/default/component/test/techdocs_metadata.json',
        () => HttpResponse.json({ build_timestamp: 123 }),
      ),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('doSync', () => {
    it('should execute an update', async () => {
      (shouldCheckForUpdate as jest.Mock).mockReturnValue(true);

      const entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          uid: '0',
          name: 'test',
          namespace: 'default',
        },
      };

      MockedDocsBuilder.prototype.build.mockImplementation(async () => {
        // extract the logStream from the constructor call
        const logStream = MockedDocsBuilder.mock.calls[0][0].logStream;

        logStream?.write('Some log');
        logStream?.write('Another log');

        const logger = MockedDocsBuilder.mock.calls[0][0].logger;

        jest.advanceTimersByTime(10001);

        logger.info('Some more log');

        return true;
      });

      publisher.hasDocsBeenGenerated.mockResolvedValue(true);

      await docsSynchronizer.doSync({
        responseHandler: mockResponseHandler,
        entity,
        preparers,
        generators,
      });

      expect(mockResponseHandler.log).toHaveBeenCalledTimes(4);
      expect(mockResponseHandler.log).toHaveBeenCalledWith('Some log');
      expect(mockResponseHandler.log).toHaveBeenCalledWith('Another log');
      expect(mockResponseHandler.log).toHaveBeenCalledWith(
        expect.stringMatching(/info.*Some more log/),
      );

      expect(mockResponseHandler.log).toHaveBeenCalledWith(
        expect.stringMatching(
          /info.*The docs building process is taking a little bit longer to process this entity. Please bear with us/,
        ),
      );

      expect(mockResponseHandler.finish).toHaveBeenCalledWith({
        updated: true,
      });

      expect(mockResponseHandler.error).toHaveBeenCalledTimes(0);

      expect(shouldCheckForUpdate).toHaveBeenCalledTimes(1);
      expect(DocsBuilder.prototype.build).toHaveBeenCalledTimes(1);
    });

    it('should limit concurrent updates', async () => {
      // Given a build implementation that runs long...
      MockedDocsBuilder.prototype.build.mockImplementation(
        () => new Promise(() => {}),
      );
      (shouldCheckForUpdate as jest.Mock).mockReturnValue(true);
      const entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          uid: '0',
          name: 'test',
          namespace: 'default',
        },
      };

      // When more than 10 syncs are attempted...
      for (let i = 0; i < 12; i++) {
        docsSynchronizer.doSync({
          responseHandler: mockResponseHandler,
          entity,
          preparers,
          generators,
        });
      }

      // Then still only 10 builds should have been triggered.
      await new Promise<void>(resolve => resolve());
      expect(DocsBuilder.prototype.build).toHaveBeenCalledTimes(10);
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
        },
      };

      await docsSynchronizer.doSync({
        responseHandler: mockResponseHandler,
        entity,
        preparers,
        generators,
      });

      expect(mockResponseHandler.finish).toHaveBeenCalledWith({
        updated: false,
      });

      expect(mockResponseHandler.log).toHaveBeenCalledTimes(0);
      expect(mockResponseHandler.error).toHaveBeenCalledTimes(0);

      expect(shouldCheckForUpdate).toHaveBeenCalledTimes(1);
      expect(DocsBuilder.prototype.build).toHaveBeenCalledTimes(0);
    });

    it('should forward build errors', async () => {
      (shouldCheckForUpdate as jest.Mock).mockReturnValue(true);

      const entity = {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          uid: '0',
          name: 'test',
          namespace: 'default',
        },
      };

      const error = new Error('Some random error');
      MockedDocsBuilder.prototype.build.mockRejectedValue(error);

      await docsSynchronizer.doSync({
        responseHandler: mockResponseHandler,
        entity,
        preparers,
        generators,
      });

      expect(mockResponseHandler.log).toHaveBeenCalledTimes(1);
      expect(mockResponseHandler.log).toHaveBeenCalledWith(
        expect.stringMatching(
          /error.*: Failed to build the docs page for entity component:default\/test: Some random error/,
        ),
      );
      expect(mockResponseHandler.finish).toHaveBeenCalledTimes(0);
      expect(mockResponseHandler.error).toHaveBeenCalledTimes(1);
      expect(mockResponseHandler.error).toHaveBeenCalledWith(error);
    });
  });

  describe('doCacheSync', () => {
    const entity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        uid: '0',
        name: 'test',
        namespace: 'default',
      },
    };

    it('should not check metadata too often', async () => {
      (shouldCheckForUpdate as jest.Mock).mockReturnValue(false);

      await docsSynchronizer.doCacheSync({
        responseHandler: mockResponseHandler,
        discovery,
        token: undefined,
        entity,
      });

      expect(mockResponseHandler.finish).toHaveBeenCalledWith({
        updated: false,
      });
      expect(shouldCheckForUpdate).toHaveBeenCalledTimes(1);
    });

    it('should do nothing if source/cached metadata matches', async () => {
      (shouldCheckForUpdate as jest.Mock).mockReturnValue(true);
      (publisher.fetchTechDocsMetadata as jest.Mock).mockResolvedValue({
        build_timestamp: 123,
      });

      await docsSynchronizer.doCacheSync({
        responseHandler: mockResponseHandler,
        discovery,
        token: undefined,
        entity,
      });

      expect(mockResponseHandler.finish).toHaveBeenCalledWith({
        updated: false,
      });
    });

    it('should invalidate expected files when source/cached metadata differ', async () => {
      (shouldCheckForUpdate as jest.Mock).mockReturnValue(true);
      (publisher.fetchTechDocsMetadata as jest.Mock).mockResolvedValue({
        build_timestamp: 456,
        files: ['index.html'],
      });

      await docsSynchronizer.doCacheSync({
        responseHandler: mockResponseHandler,
        discovery,
        token: undefined,
        entity,
      });

      expect(mockResponseHandler.finish).toHaveBeenCalledWith({
        updated: true,
      });
      expect(cache.invalidateMultiple).toHaveBeenCalledWith([
        'default/component/test/index.html',
      ]);
    });

    it('should invalidate expected files when source/cached metadata differ with legacy casing', async () => {
      (shouldCheckForUpdate as jest.Mock).mockReturnValue(true);
      (publisher.fetchTechDocsMetadata as jest.Mock).mockResolvedValue({
        build_timestamp: 456,
        files: ['index.html'],
      });

      const docsSynchronizerWithLegacy = new DocsSynchronizer({
        publisher,
        config: new ConfigReader({
          techdocs: { legacyUseCaseSensitiveTripletPaths: true },
        }),
        logger: mockServices.logger.mock(),
        buildLogTransport: new winston.transports.Stream({
          stream: new PassThrough(),
        }),
        scmIntegrations: ScmIntegrations.fromConfig(new ConfigReader({})),
        cache,
      });

      await docsSynchronizerWithLegacy.doCacheSync({
        responseHandler: mockResponseHandler,
        discovery,
        token: undefined,
        entity,
      });

      expect(mockResponseHandler.finish).toHaveBeenCalledWith({
        updated: true,
      });
      expect(cache.invalidateMultiple).toHaveBeenCalledWith([
        'default/Component/test/index.html',
      ]);
    });

    it('should gracefully handle errors', async () => {
      (shouldCheckForUpdate as jest.Mock).mockReturnValue(true);
      (publisher.fetchTechDocsMetadata as jest.Mock).mockRejectedValue(
        new Error(),
      );

      await docsSynchronizer.doCacheSync({
        responseHandler: mockResponseHandler,
        discovery,
        token: undefined,
        entity,
      });

      expect(mockResponseHandler.finish).toHaveBeenCalledWith({
        updated: false,
      });
    });

    it("adds the build log transport to the logger's list of transports", async () => {
      let logger: winston.Logger;
      MockedDocsBuilder.prototype.build.mockImplementation(async () => {
        logger = MockedDocsBuilder.mock.calls[0][0].logger;
        expect(logger.transports).toContain(mockBuildLogTransport);

        return true;
      });

      await docsSynchronizer.doSync({
        responseHandler: mockResponseHandler,
        entity,
        preparers,
        generators,
      });
    });
  });
});
