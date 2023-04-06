/*
 * Copyright 2020 The Backstage Authors
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
  getVoidLogger,
  UrlReader,
  UrlReaders,
} from '@backstage/backend-common';
import { setupRequestMockHandlers } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  CatalogProcessorCache,
  CatalogProcessorEntityResult,
  CatalogProcessorErrorResult,
  CatalogProcessorRefreshKeysResult,
  CatalogProcessorResult,
} from '@backstage/plugin-catalog-node';
import { defaultEntityDataParser } from '../util/parse';
import { UrlReaderProcessor } from './UrlReaderProcessor';

describe('UrlReaderProcessor', () => {
  const mockApiOrigin = 'http://localhost';
  const mockCache: jest.Mocked<CatalogProcessorCache> = {
    get: jest.fn(),
    set: jest.fn(),
  };
  const server = setupServer();
  setupRequestMockHandlers(server);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should load from url', async () => {
    const logger = getVoidLogger();
    const reader = UrlReaders.default({
      logger,
      config: new ConfigReader({
        backend: { reading: { allow: [{ host: 'localhost' }] } },
      }),
    });
    const processor = new UrlReaderProcessor({ reader, logger });
    const spec = {
      type: 'url',
      target: `${mockApiOrigin}/component.yaml`,
    };

    server.use(
      rest.get(`${mockApiOrigin}/component.yaml`, (_, res, ctx) =>
        res(
          ctx.set({ ETag: 'my-etag' }),
          ctx.json({
            kind: 'component',
            metadata: { name: 'mock-url-entity' },
          }),
        ),
      ),
    );

    const emitted = new Array<CatalogProcessorResult>();
    await processor.readLocation(
      spec,
      false,
      result => emitted.push(result),
      defaultEntityDataParser,
      mockCache,
    );

    expect(emitted.length).toBe(2);
    expect(emitted[0]).toEqual({
      type: 'entity',
      location: spec,
      entity: { kind: 'component', metadata: { name: 'mock-url-entity' } },
    });
    expect(emitted[1]).toEqual({
      type: 'refresh',
      key: 'url:http://localhost/component.yaml',
    });
    expect(mockCache.set).toHaveBeenCalledWith('v1', {
      etag: 'my-etag',
      value: [
        {
          type: 'entity',
          location: spec,
          entity: { kind: 'component', metadata: { name: 'mock-url-entity' } },
        },
      ],
    });
    expect(mockCache.set).toHaveBeenCalledTimes(1);
  });

  it('should use cached data when available', async () => {
    const logger = getVoidLogger();
    const reader = UrlReaders.default({
      logger,
      config: new ConfigReader({
        backend: { reading: { allow: [{ host: 'localhost' }] } },
      }),
    });
    server.use(
      rest.get(`${mockApiOrigin}/component.yaml`, (_, res, ctx) =>
        res(ctx.status(304)),
      ),
    );
    const spec = {
      type: 'url',
      target: `${mockApiOrigin}/component.yaml`,
    };
    const cacheItem = {
      etag: 'my-etag',
      value: [{ type: 'entity', location: spec, entity: { mock: 'entity' } }],
    };
    mockCache.get.mockResolvedValue(cacheItem);
    const processor = new UrlReaderProcessor({ reader, logger });

    const emitted = new Array<CatalogProcessorResult>();
    await processor.readLocation(
      spec,
      false,
      r => emitted.push(r),
      defaultEntityDataParser,
      mockCache,
    );

    const entity = emitted[0] as CatalogProcessorEntityResult;
    const refresh = emitted[1] as CatalogProcessorRefreshKeysResult;

    expect(entity.type).toBe('entity');
    expect(entity.location).toEqual(spec);
    expect(entity.entity).toEqual({ mock: 'entity' });

    expect(refresh.type).toBe('refresh');
    expect(refresh.key).toBe('url:http://localhost/component.yaml');

    expect(mockCache.get).toHaveBeenCalledWith('v1');
    expect(mockCache.get).toHaveBeenCalledTimes(1);
    expect(mockCache.set).toHaveBeenCalledTimes(0);
  });

  it('should fail load from url with error', async () => {
    const logger = getVoidLogger();
    const reader = UrlReaders.default({
      logger,
      config: new ConfigReader({
        backend: { reading: { allow: [{ host: 'localhost' }] } },
      }),
    });
    const processor = new UrlReaderProcessor({ reader, logger });
    const spec = {
      type: 'url',
      target: `${mockApiOrigin}/component-notfound.yaml`,
    };

    server.use(
      rest.get(`${mockApiOrigin}/component-notfound.yaml`, (_, res, ctx) => {
        return res(ctx.status(404));
      }),
    );

    const generated = (await new Promise<CatalogProcessorResult>(emit =>
      processor.readLocation(
        spec,
        false,
        emit,
        defaultEntityDataParser,
        mockCache,
      ),
    )) as CatalogProcessorErrorResult;

    expect(generated.type).toBe('error');
    expect(generated.location).toBe(spec);
    expect(generated.error.name).toBe('NotFoundError');
    expect(generated.error.message).toBe(
      `Unable to read url, NotFoundError: could not read ${mockApiOrigin}/component-notfound.yaml, 404 Not Found`,
    );
  });

  it('uses search when there are globs', async () => {
    const logger = getVoidLogger();

    const reader: jest.Mocked<UrlReader> = {
      readUrl: jest.fn(),
      readTree: jest.fn(),
      search: jest.fn().mockImplementation(async () => []),
    };

    const processor = new UrlReaderProcessor({ reader, logger });

    const emit = jest.fn();

    await processor.readLocation(
      { type: 'url', target: 'https://github.com/a/b/blob/x/**/b.yaml' },
      false,
      emit,
      defaultEntityDataParser,
      mockCache,
    );

    expect(reader.search).toHaveBeenCalledTimes(1);
  });
});
