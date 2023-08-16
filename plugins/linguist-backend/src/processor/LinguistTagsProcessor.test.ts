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
  LinguistTagsProcessor,
  LinguistTagsProcessorOptions,
  sanitizeTag,
} from './LinguistTagsProcessor';
import { ConfigReader } from '@backstage/config';
import { getVoidLogger } from '@backstage/backend-common';
import { CatalogProcessorCache } from '@backstage/plugin-catalog-node';
import { Entity, makeValidator } from '@backstage/catalog-model';
import { DiscoveryService } from '@backstage/backend-plugin-api';
import fetch, { Response } from 'node-fetch';
import * as path from 'path';
import yaml from 'js-yaml';
import * as fs from 'fs';

const { isValidTag } = makeValidator();

jest.mock('node-fetch', () => jest.fn());
const mockedFetch: jest.MockedFunction<typeof fetch> =
  fetch as jest.MockedFunction<typeof fetch>;

const discovery: DiscoveryService = {
  getBaseUrl: jest.fn().mockResolvedValue('http://example.com/api/linguist'),
  getExternalBaseUrl: jest.fn(),
};

let state: Record<string, any> = {};
const mockCacheGet = jest
  .fn()
  .mockImplementation(async (key: string) => state[key]);
const mockCacheSet = jest.fn().mockImplementation((key: string, value: any) => {
  state[key] = value;
});
const cache: CatalogProcessorCache = {
  get: mockCacheGet,
  set: mockCacheSet,
};

describe('sanitizeTag', () => {
  const linguistDataSet = yaml.load(
    fs.readFileSync(
      path.resolve(require.resolve('linguist-js'), '../../ext/languages.yml'),
      'utf-8',
    ),
  ) as Object;
  const languages = Object.keys(linguistDataSet);
  test('Should clean up all linguist languages', () => {
    const invalid = languages
      .map(sanitizeTag)
      .filter(lang => !isValidTag(lang));
    expect(invalid).toStrictEqual([]);
    // Keep a snapshot here so that as new languages are added to linguist,
    // we can spot check them to make sure the transformer for them makes sense.
    expect(languages.map(sanitizeTag)).toMatchSnapshot();
  });
});

describe('LinguistTagsProcessor', () => {
  afterEach(() => {
    mockedFetch.mockReset();
    mockCacheGet.mockClear();
    mockCacheSet.mockClear();
    state = {};
  });

  test('Should construct fromConfig', () => {
    const config = new ConfigReader({
      linguist: {},
    });
    expect(() => {
      return LinguistTagsProcessor.fromConfig(config, {
        logger: getVoidLogger(),
        discovery,
      });
    }).not.toThrow();
  });

  test('Should assign valid language tags', async () => {
    const processor = buildProcessor({});

    mockFetchImplementation();
    const entity = baseEntity();
    await processor.preProcessEntity(entity, null, null, null, cache);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(entity.metadata.tags).toStrictEqual([
      'c++',
      'asp-dot-net',
      'java',
      'common-lisp',
    ]);

    entity.metadata.tags?.forEach(tag => {
      expect(isValidTag(tag)).toBeTruthy();
    });
  });

  test('Should not duplicate existing tags', async () => {
    const processor = buildProcessor({});

    mockFetchImplementation();
    const entity = baseEntity();
    entity.metadata.tags = ['existing', 'tags', 'java'];

    await processor.preProcessEntity(entity, null, null, null, cache);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(entity.metadata.tags).toStrictEqual([
      'existing',
      'tags',
      'java',
      'c++',
      'asp-dot-net',
      'common-lisp',
    ]);
  });

  test('Should not process Resource entities by default', async () => {
    const processor = buildProcessor({});

    mockFetchImplementation();
    const entity = baseEntity();
    entity.kind = 'Resource';

    await processor.preProcessEntity(entity, null, null, null, cache);
    expect(mockedFetch).toHaveBeenCalledTimes(0);
    expect(entity.metadata.tags).toStrictEqual(undefined);
  });

  test('Can process Resource entities by overriding shouldProcessEntity', async () => {
    const processor = buildProcessor({
      shouldProcessEntity: (entity: Entity) => {
        return entity.kind === 'Resource';
      },
    });

    mockFetchImplementation();
    const entity = baseEntity();
    entity.kind = 'Resource';

    await processor.preProcessEntity(entity, null, null, null, cache);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(entity.metadata.tags).toStrictEqual([
      'c++',
      'asp-dot-net',
      'java',
      'common-lisp',
    ]);
  });

  test('Can omit languages using languageMap', async () => {
    const processor = buildProcessor({
      languageMap: {
        Java: '',
        'ASP.net': '',
      },
    });

    mockFetchImplementation();
    const entity = baseEntity();
    await processor.preProcessEntity(entity, null, null, null, cache);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(entity.metadata.tags).toStrictEqual(['c++', 'common-lisp']);
  });

  test('Can rewrite langs using languageMap', async () => {
    const processor = buildProcessor({
      languageMap: {
        Java: 'notjava',
      },
    });

    mockFetchImplementation();
    const entity = baseEntity();
    await processor.preProcessEntity(entity, null, null, null, cache);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(entity.metadata.tags).toStrictEqual([
      'c++',
      'asp-dot-net',
      'notjava',
      'common-lisp',
    ]);
  });

  test('Can omit languages less than bytesThreshold', async () => {
    const processor = buildProcessor({
      bytesThreshold: 5000,
    });

    mockFetchImplementation();
    const entity = baseEntity();
    await processor.preProcessEntity(entity, null, null, null, cache);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(entity.metadata.tags).toStrictEqual(['java', 'common-lisp']);
  });

  test('Can include languages that arent programming', async () => {
    const processor = buildProcessor({
      languageTypes: ['data'],
    });

    mockFetchImplementation();
    const entity = baseEntity();
    await processor.preProcessEntity(entity, null, null, null, cache);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(entity.metadata.tags).toStrictEqual(['yaml', 'json']);
  });

  test('Refetches from API when cache disabled', async () => {
    const processor = buildProcessor({
      cacheTTL: { minutes: 0 },
    });

    mockFetchImplementation();
    const entity = baseEntity();
    await processor.preProcessEntity(entity, null, null, null, cache);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(mockCacheGet).toHaveBeenCalledTimes(0);
    expect(mockCacheSet).toHaveBeenCalledTimes(0);
    mockedFetch.mockClear();
    await processor.preProcessEntity(entity, null, null, null, cache);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(mockCacheGet).toHaveBeenCalledTimes(0);
    expect(mockCacheSet).toHaveBeenCalledTimes(0);
  });

  test('Caches across runs with cache enabled', async () => {
    const processor = buildProcessor({
      cacheTTL: { minutes: 5 },
    });

    mockFetchImplementation();
    const entity = baseEntity();
    await processor.preProcessEntity(entity, null, null, null, cache);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
    expect(mockCacheGet).toHaveBeenCalledTimes(1);
    expect(mockCacheSet).toHaveBeenCalledTimes(1);

    mockedFetch.mockClear();
    mockCacheGet.mockClear();
    mockCacheSet.mockClear();
    await processor.preProcessEntity(entity, null, null, null, cache);
    expect(mockedFetch).toHaveBeenCalledTimes(0);
    expect(mockCacheGet).toHaveBeenCalledTimes(1);
    expect(mockCacheSet).toHaveBeenCalledTimes(0);
  });
});

function mockFetchImplementation(): void {
  mockedFetch.mockResolvedValue({
    json: jest.fn().mockResolvedValue({
      languageCount: 6,
      totalBytes: 43823,
      processedDate: '2023-06-20T21:37:48.337Z',
      breakdown: [
        {
          name: 'YAML',
          percentage: 2.23,
          bytes: 979,
          type: 'data',
          color: '#cb171e',
        },
        {
          name: 'JSON',
          percentage: 1.31,
          bytes: 574,
          type: 'data',
          color: '#292929',
        },
        {
          name: 'C++',
          percentage: 5.25,
          bytes: 2300,
          type: 'programming',
          color: '#f34b7d',
        },
        {
          name: 'ASP.net',
          percentage: 6.97,
          bytes: 3053,
          type: 'programming',
          color: '#178600',
        },
        {
          name: 'Java',
          percentage: 12.79,
          bytes: 5603,
          type: 'programming',
          color: '#b07219',
        },
        {
          name: 'Common Lisp',
          percentage: 71.46,
          bytes: 31314,
          type: 'programming',
          color: '#3fb68b',
        },
      ],
    }),
  } as unknown as Response);
}

function baseEntity(): Entity {
  return {
    apiVersion: 'backstage.io/v1alpha1',
    kind: 'Component',
    metadata: {
      name: 'foo',
    },
  };
}

function buildProcessor(options: Partial<LinguistTagsProcessorOptions>) {
  const config = new ConfigReader({
    linguist: {
      tagsProcessor: {
        bytesThreshold: options.bytesThreshold,
        languageTypes: options.languageTypes,
        languageMap: options.languageMap,
        cacheTTL: options.cacheTTL,
      },
    },
  });
  return LinguistTagsProcessor.fromConfig(config, {
    logger: getVoidLogger(),
    discovery,
    shouldProcessEntity: options.shouldProcessEntity,
  });
}
