/*
 * Copyright 2026 The Backstage Authors
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

import Mock from '@short.io/opensearch-mock';
import { OpenSearchClientWrapper } from './OpenSearchClientWrapper';

describe('OpenSearchClientWrapper with a mocked HTTP layer', () => {
  it('builds a real search request and parses the OpenSearch response', async () => {
    const mock = new Mock();
    const search = jest.fn(() => ({
      took: 1,
      timed_out: false,
      hits: {
        total: { value: 1, relation: 'eq' },
        hits: [
          {
            _index: 'docs-index__1',
            _source: { title: 'Hello' },
            _score: 1,
          },
        ],
      },
    }));
    mock.add(
      { method: ['GET', 'POST'], path: '/docs__search/_search' },
      search,
    );

    const wrapper = OpenSearchClientWrapper.fromClientOptions({
      node: 'http://localhost:9200',
      // The mock provides a Connection implementation for the real client.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Connection: mock.getConnection() as any,
    });

    const result = await wrapper.search({
      index: 'docs__search',
      body: { query: { match_all: {} } },
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(result.body.hits.hits[0]._source).toEqual({ title: 'Hello' });
    expect(result.statusCode).toBe(200);
  });

  it('creates and deletes indices through the real client', async () => {
    const mock = new Mock();
    const create = jest.fn(() => ({
      acknowledged: true,
      index: 'docs-index__1',
    }));
    const remove = jest.fn(() => ({
      acknowledged: true,
      index: 'docs-index__1',
    }));
    mock.add({ method: 'PUT', path: '/:index' }, create);
    mock.add({ method: 'DELETE', path: '/:index' }, remove);

    const wrapper = OpenSearchClientWrapper.fromClientOptions({
      node: 'http://localhost:9200',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      Connection: mock.getConnection() as any,
    });

    await wrapper.createIndex({ index: 'docs-index__1' });
    await wrapper.deleteIndex({ index: 'docs-index__1' });

    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PUT',
        path: '/docs-index__1',
      }),
    );
    expect(remove).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'DELETE',
        path: '/docs-index__1',
      }),
    );
  });
});
