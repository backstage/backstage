/*
 * Copyright 2022 The Backstage Authors
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
import { Client as ElasticSearchClient } from '@elastic/elasticsearch';
import { Client as OpenSearchClient } from '@opensearch-project/opensearch';
import Mock from '@short.io/opensearch-mock';
import { Readable } from 'stream';

import { ElasticSearchClientWrapper } from './ElasticSearchClientWrapper';
import {
  createElasticSearchClientOptions,
  ElasticSearchClientOptions,
} from './ElasticSearchSearchEngine';

jest.mock('@elastic/elasticsearch', () => ({
  ...jest.requireActual('@elastic/elasticsearch'),
  Client: jest.fn().mockReturnValue({
    search: jest
      .fn()
      .mockImplementation(async args => ({ client: 'es', args })),
    cat: {
      aliases: jest
        .fn()
        .mockImplementation(async args => ({ client: 'es', args })),
    },
    helpers: {
      bulk: jest
        .fn()
        .mockImplementation(async args => ({ client: 'es', args })),
    },
    indices: {
      create: jest
        .fn()
        .mockImplementation(async args => ({ client: 'es', args })),
      delete: jest
        .fn()
        .mockImplementation(async args => ({ client: 'es', args })),
      exists: jest
        .fn()
        .mockImplementation(async args => ({ client: 'es', args })),
      putIndexTemplate: jest
        .fn()
        .mockImplementation(async args => ({ client: 'es', args })),
      updateAliases: jest
        .fn()
        .mockImplementation(async args => ({ client: 'es', args })),
    },
  }),
}));

jest.mock('@opensearch-project/opensearch', () => ({
  ...jest.requireActual('@opensearch-project/opensearch'),
  Client: jest.fn().mockReturnValue({
    search: jest
      .fn()
      .mockImplementation(async args => ({ client: 'os', args })),
    cat: {
      aliases: jest
        .fn()
        .mockImplementation(async args => ({ client: 'os', args })),
    },
    helpers: {
      bulk: jest
        .fn()
        .mockImplementation(async args => ({ client: 'os', args })),
    },
    indices: {
      create: jest
        .fn()
        .mockImplementation(async args => ({ client: 'os', args })),
      delete: jest
        .fn()
        .mockImplementation(async args => ({ client: 'os', args })),
      exists: jest
        .fn()
        .mockImplementation(async args => ({ client: 'os', args })),
      putIndexTemplate: jest
        .fn()
        .mockImplementation(async args => ({ client: 'os', args })),
      updateAliases: jest
        .fn()
        .mockImplementation(async args => ({ client: 'os', args })),
    },
  }),
}));

describe('ElasticSearchClientWrapper', () => {
  describe('elasticSearchClient', () => {
    let esOptions: ElasticSearchClientOptions;

    beforeEach(async () => {
      esOptions = await createElasticSearchClientOptions(
        new ConfigReader({
          node: 'http://localhost:9200',
        }),
      );
      jest.clearAllMocks();
    });

    it('instantiation', () => {
      ElasticSearchClientWrapper.fromClientOptions(esOptions);
      expect(ElasticSearchClient).toHaveBeenCalledWith(esOptions);
    });

    it('search', async () => {
      const wrapper = ElasticSearchClientWrapper.fromClientOptions(esOptions);

      const searchInput = { index: 'xyz', body: { eg: 'etc' } };
      const result = (await wrapper.search(searchInput)) as any;

      // Should call the ElasticSearch client's search with expected input.
      expect(result.client).toBe('es');
      expect(result.args).toStrictEqual(searchInput);
    });

    it('bulk', async () => {
      const wrapper = ElasticSearchClientWrapper.fromClientOptions(esOptions);

      const bulkInput = {
        datasource: Readable.from([{}]),
        onDocument() {
          return { index: { _index: 'xyz' } };
        },
        refreshCompletion: 'xyz',
      };
      const result = (await wrapper.bulk(bulkInput)) as any;

      // Should call the ElasticSearch client's bulk helper with expected input
      expect(result.client).toBe('es');
      expect(result.args).toStrictEqual(bulkInput);
    });

    it('putIndexTemplate', async () => {
      const wrapper = ElasticSearchClientWrapper.fromClientOptions(esOptions);

      const indexTemplate = { name: 'xyz', body: { index_patterns: ['*'] } };
      const result = (await wrapper.putIndexTemplate(indexTemplate)) as any;

      // Should call the ElasticSearch client with expected input.
      expect(result.client).toBe('es');
      expect(result.args).toStrictEqual(indexTemplate);
    });

    it('indexExists', async () => {
      const wrapper = ElasticSearchClientWrapper.fromClientOptions(esOptions);

      const input = { index: 'xyz' };
      const result = (await wrapper.indexExists(input)) as any;

      // Should call the ElasticSearch client with expected input.
      expect(result.client).toBe('es');
      expect(result.args).toStrictEqual(input);
    });

    it('deleteIndex', async () => {
      const wrapper = ElasticSearchClientWrapper.fromClientOptions(esOptions);

      const input = { index: 'xyz' };
      const result = (await wrapper.deleteIndex(input)) as any;

      // Should call the OpenSearch client with expected input.
      expect(result.client).toBe('es');
      expect(result.args).toStrictEqual(input);
    });

    it('createIndex', async () => {
      const wrapper = ElasticSearchClientWrapper.fromClientOptions(esOptions);

      const input = { index: 'xyz' };
      const result = (await wrapper.createIndex(input)) as any;

      // Should call the OpenSearch client with expected input.
      expect(result.client).toBe('es');
      expect(result.args).toStrictEqual(input);
    });

    it('getAliases', async () => {
      const wrapper = ElasticSearchClientWrapper.fromClientOptions(esOptions);

      const input = { aliases: ['xyz'] };
      const result = (await wrapper.getAliases(input)) as any;

      // Should call the OpenSearch client with expected input.
      expect(result.client).toBe('es');
      expect(result.args).toStrictEqual({
        format: 'json',
        name: input.aliases,
      });
    });

    it('updateAliases', async () => {
      const wrapper = ElasticSearchClientWrapper.fromClientOptions(esOptions);

      const input = { actions: [{ remove: { index: 'xyz', alias: 'abc' } }] };
      const result = (await wrapper.updateAliases(input)) as any;

      // Should call the OpenSearch client with expected input.
      expect(result.client).toBe('es');
      expect(result.args).toStrictEqual({
        body: { actions: input.actions },
      });
    });
  });

  describe('openSearchClient', () => {
    const mock = new Mock();
    let osOptions: ElasticSearchClientOptions;

    beforeEach(() => {
      osOptions = {
        provider: 'aws',
        node: 'https://my-es-cluster.eu-west-1.es.amazonaws.com',
        // todo(backstage/techdocs-core): Remove the following ts-ignore when
        // @short.io/opensearch-mock is updated to work w/opensearch >= 2.0.0
        // @ts-ignore
        connection: mock.getConnection(),
      };

      jest.clearAllMocks();
    });

    it('instantiation', () => {
      ElasticSearchClientWrapper.fromClientOptions(osOptions);
      expect(OpenSearchClient).toHaveBeenCalledWith(osOptions);
    });

    it('search', async () => {
      const wrapper = ElasticSearchClientWrapper.fromClientOptions(osOptions);

      const searchInput = { index: 'xyz', body: { eg: 'etc' } };
      const result = (await wrapper.search(searchInput)) as any;

      // Should call the OpenSearch client's search with expected input.
      expect(result.client).toBe('os');
      expect(result.args).toStrictEqual(searchInput);
    });

    it('bulk', async () => {
      const wrapper = ElasticSearchClientWrapper.fromClientOptions(osOptions);

      const bulkInput = {
        datasource: Readable.from([{}]),
        onDocument() {
          return { index: { _index: 'xyz' } };
        },
        refreshCompletion: 'xyz',
      };
      const result = (await wrapper.bulk(bulkInput)) as any;

      // Should call the OpenSearch client's bulk helper with expected input.
      expect(result.client).toBe('os');
      expect(result.args).toStrictEqual(bulkInput);
    });

    it('putIndexTemplate', async () => {
      const wrapper = ElasticSearchClientWrapper.fromClientOptions(osOptions);

      const indexTemplate = { name: 'xyz', body: { index_patterns: ['*'] } };
      const result = (await wrapper.putIndexTemplate(indexTemplate)) as any;

      // Should call the OpenSearch client with expected input.
      expect(result.client).toBe('os');
      expect(result.args).toStrictEqual(indexTemplate);
    });

    it('indexExists', async () => {
      const wrapper = ElasticSearchClientWrapper.fromClientOptions(osOptions);

      const input = { index: 'xyz' };
      const result = (await wrapper.indexExists(input)) as any;

      // Should call the OpenSearch client with expected input.
      expect(result.client).toBe('os');
      expect(result.args).toStrictEqual(input);
    });

    it('deleteIndex', async () => {
      const wrapper = ElasticSearchClientWrapper.fromClientOptions(osOptions);

      const input = { index: 'xyz' };
      const result = (await wrapper.deleteIndex(input)) as any;

      // Should call the OpenSearch client with expected input.
      expect(result.client).toBe('os');
      expect(result.args).toStrictEqual(input);
    });

    it('createIndex', async () => {
      const wrapper = ElasticSearchClientWrapper.fromClientOptions(osOptions);

      const input = { index: 'xyz' };
      const result = (await wrapper.createIndex(input)) as any;

      // Should call the OpenSearch client with expected input.
      expect(result.client).toBe('os');
      expect(result.args).toStrictEqual(input);
    });

    it('getAliases', async () => {
      const wrapper = ElasticSearchClientWrapper.fromClientOptions(osOptions);

      const input = { aliases: ['xyz'] };
      const result = (await wrapper.getAliases(input)) as any;

      // Should call the OpenSearch client with expected input.
      expect(result.client).toBe('os');
      expect(result.args).toStrictEqual({
        format: 'json',
        name: input.aliases,
      });
    });

    it('updateAliases', async () => {
      const wrapper = ElasticSearchClientWrapper.fromClientOptions(osOptions);

      const input = { actions: [{ remove: { index: 'xyz', alias: 'abc' } }] };
      const result = (await wrapper.updateAliases(input)) as any;

      // Should call the OpenSearch client with expected input.
      expect(result.client).toBe('os');
      expect(result.args).toStrictEqual({
        body: { actions: input.actions },
      });
    });

    it('accepts provider "opensearch"', async () => {
      osOptions = {
        provider: 'opensearch',
        node: 'https://my-opensearch-instance.address.com',
        // todo(backstage/techdocs-core): Remove the following ts-ignore when
        // @short.io/opensearch-mock is updated to work w/opensearch >= 2.0.0
        // @ts-ignore
        connection: mock.getConnection(),
      };

      const wrapper = ElasticSearchClientWrapper.fromClientOptions(osOptions);
      expect(OpenSearchClient).toHaveBeenCalledWith(osOptions);

      const searchInput = { index: 'xyz', body: { eg: 'etc' } };
      const result = (await wrapper.search(searchInput)) as any;
      expect(result.client).toBe('os');
      expect(result.args).toStrictEqual(searchInput);
    });
  });
});
