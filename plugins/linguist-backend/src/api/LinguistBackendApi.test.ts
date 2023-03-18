/*
 * Copyright 2023 The Backstage Authors
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
  PluginEndpointDiscovery,
  ReadTreeResponse,
  ServerTokenManager,
  UrlReader,
} from '@backstage/backend-common';
import { GetEntitiesResponse } from '@backstage/catalog-client';
import { Results } from 'linguist-js/dist/types';
import { DateTime } from 'luxon';
import { LinguistBackendStore } from '../db';
import { kindOrDefault, LinguistBackendApi } from './LinguistBackendApi';
import fs from 'fs-extra';

const linguistResultMock = Promise.resolve({
  files: {
    count: 4,
    bytes: 6010,
    results: {
      '/src/index.ts': 'TypeScript',
      '/src/cli.js': 'JavaScript',
      '/readme.md': 'Markdown',
      '/no-lang': null,
    },
  },
  languages: {
    count: 3,
    bytes: 6000,
    results: {
      JavaScript: { type: 'programming', bytes: 1000, color: '#f1e05a' },
      TypeScript: { type: 'programming', bytes: 2000, color: '#2b7489' },
      Markdown: { type: 'prose', bytes: 3000, color: '#083fa1' },
    },
  },
  unknown: {
    count: 1,
    bytes: 10,
    filenames: {
      'no-lang': 10,
    },
    extensions: {},
  },
} as Results);

describe('kindOrDefault', () => {
  it('should return default kind when undefined', () => {
    expect(kindOrDefault()).toEqual(['API', 'Component', 'Template']);
  });
  it('should return the default kind when empty', () => {
    expect(kindOrDefault([])).toEqual(['API', 'Component', 'Template']);
  });
  it('should return provided kind when not empty', () => {
    expect(kindOrDefault(['API'])).toEqual(['API']);
  });
});

describe('Linguist backend API', () => {
  const getEntitiesMock = jest.fn();
  jest.mock('@backstage/catalog-client', () => {
    return {
      CatalogClient: jest
        .fn()
        .mockImplementation(() => ({ getEntities: getEntitiesMock })),
    };
  });

  const logger = getVoidLogger();

  const store: jest.Mocked<LinguistBackendStore> = {
    insertEntityResults: jest.fn(),
    insertNewEntity: jest.fn(),
    getEntityResults: jest.fn(),
    getProcessedEntities: jest.fn(),
    getUnprocessedEntities: jest.fn(),
  };

  const urlReader: jest.Mocked<UrlReader> = {
    readTree: jest.fn(),
    search: jest.fn(),
    readUrl: jest.fn(),
  };

  const discovery: jest.Mocked<PluginEndpointDiscovery> = {
    getBaseUrl: jest.fn(),
    getExternalBaseUrl: jest.fn(),
  };

  const tokenManager = ServerTokenManager.noop();

  const api = new LinguistBackendApi(
    logger,
    store,
    urlReader,
    discovery,
    tokenManager,
  );

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should get languages for an entity', async () => {
    store.getEntityResults.mockResolvedValue({
      languageCount: 1,
      totalBytes: 2205,
      processedDate: '2023-02-15T20:10:21.378Z',
      breakdown: [
        {
          name: 'YAML',
          percentage: 100,
          bytes: 2205,
          type: 'data',
          color: '#cb171e',
        },
      ],
    });

    const entityRef = 'template:default/create-react-app-template';
    const languages = await api.getEntityLanguages(entityRef);
    expect(languages).toEqual({
      languageCount: 1,
      totalBytes: 2205,
      processedDate: '2023-02-15T20:10:21.378Z',
      breakdown: [
        {
          name: 'YAML',
          percentage: 100,
          bytes: 2205,
          type: 'data',
          color: '#cb171e',
        },
      ],
    });
  });

  it('should add new entities', async () => {
    const testEntityListResponse: GetEntitiesResponse = {
      items: [
        {
          apiVersion: 'backstage.io/v1beta1',
          metadata: {
            name: 'service-one',
          },
          kind: 'Component',
        },
        {
          apiVersion: 'backstage.io/v1beta1',
          metadata: {
            name: 'service-two',
          },
          kind: 'Component',
        },
        {
          apiVersion: 'backstage.io/v1beta1',
          metadata: {
            name: 'service-three',
          },
          kind: 'Component',
        },
      ],
    };
    getEntitiesMock.mockResolvedValue(testEntityListResponse);

    await api.addNewEntities();
    expect(store.insertNewEntity).toHaveBeenCalledTimes(3);
  });

  it('should get default entity overview', async () => {
    store.getProcessedEntities.mockResolvedValue([
      {
        entityRef: 'component:default/service-one',
        processedDate: DateTime.now().toJSDate(),
      },
      {
        entityRef: 'component:default/stale-service-two',
        processedDate: DateTime.now().minus({ days: 45 }).toJSDate(),
      },
    ]);

    store.getUnprocessedEntities.mockResolvedValue([
      'component:default/service-three',
      'component:default/service-four',
      'component:default/service-five',
    ]);

    const overview = await api.getEntitiesOverview();
    expect(overview.entityCount).toEqual(5);
    expect(overview.processedCount).toEqual(2);
    expect(overview.staleCount).toEqual(0);
    expect(overview.pendingCount).toEqual(3);
    expect(overview.filteredEntities).toEqual([
      'component:default/service-three',
      'component:default/service-four',
      'component:default/service-five',
    ]);
  });

  it('should get entity overview with stale items', async () => {
    const staleApi = new LinguistBackendApi(
      logger,
      store,
      urlReader,
      discovery,
      tokenManager,
      { days: 5 },
    );
    store.getProcessedEntities.mockResolvedValue([
      {
        entityRef: 'component:default/service-one',
        processedDate: DateTime.now().toJSDate(),
      },
      {
        entityRef: 'component:default/stale-service-two',
        processedDate: DateTime.now().minus({ days: 45 }).toJSDate(),
      },
    ]);

    store.getUnprocessedEntities.mockResolvedValue([
      'component:default/service-three',
      'component:default/service-four',
      'component:default/service-five',
    ]);

    const overview = await staleApi.getEntitiesOverview();
    expect(overview.entityCount).toEqual(5);
    expect(overview.processedCount).toEqual(2);
    expect(overview.staleCount).toEqual(1);
    expect(overview.pendingCount).toEqual(4);
    expect(overview.filteredEntities).toEqual([
      'component:default/stale-service-two',
      'component:default/service-three',
      'component:default/service-four',
      'component:default/service-five',
    ]);
  });

  it('should generate and save languages for an entity', async () => {
    const spy = jest
      .spyOn(api, 'getLinguistResults')
      .mockImplementation(() => linguistResultMock);

    urlReader.readTree.mockResolvedValueOnce({
      files: async () => [
        {
          content: async () => Buffer.from('-- XXX: code-data', 'utf8'),
          path: 'my-file.js',
        },
      ],
      dir: async () => '/temp/my-code',
    } as ReadTreeResponse);

    const fsSpy = jest.spyOn(fs, 'remove');

    await api.generateEntityLanguages(
      'component:default/fake-service',
      'https://some.fake/service/',
    );
    expect(api.getLinguistResults).toHaveBeenCalled();
    expect(store.insertEntityResults).toHaveBeenCalled();
    expect(fs.remove).toHaveBeenCalled();
    spy.mockClear();
    fsSpy.mockClear();
  });

  it('should generate languages for multiple entities using default', async () => {
    store.getProcessedEntities.mockResolvedValue([
      {
        entityRef: 'component:default/service-one',
        processedDate: DateTime.now().toJSDate(),
      },
      {
        entityRef: 'component:default/stale-service-two',
        processedDate: DateTime.now().minus({ days: 45 }).toJSDate(),
      },
    ]);

    store.getUnprocessedEntities.mockResolvedValue([
      'component:default/service-three',
      'component:default/service-four',
      'component:default/service-five',
    ]);
    const generateEntityLanguages = jest.spyOn(api, 'generateEntityLanguages');
    await api.generateEntitiesLanguages();
    expect(generateEntityLanguages).toHaveBeenCalledTimes(3);
  });

  it('should generate languages for multiple entities using defined batch size', async () => {
    const batchApi = new LinguistBackendApi(
      logger,
      store,
      urlReader,
      discovery,
      tokenManager,
      undefined,
      1,
    );
    store.getProcessedEntities.mockResolvedValue([
      {
        entityRef: 'component:default/service-one',
        processedDate: DateTime.now().toJSDate(),
      },
      {
        entityRef: 'component:default/stale-service-two',
        processedDate: DateTime.now().minus({ days: 45 }).toJSDate(),
      },
    ]);

    store.getUnprocessedEntities.mockResolvedValue([
      'component:default/service-three',
      'component:default/service-four',
      'component:default/service-five',
    ]);
    const generateEntityLanguages = jest.spyOn(
      batchApi,
      'generateEntityLanguages',
    );
    await batchApi.generateEntitiesLanguages();
    expect(generateEntityLanguages).toHaveBeenCalledTimes(1);
  });
});
