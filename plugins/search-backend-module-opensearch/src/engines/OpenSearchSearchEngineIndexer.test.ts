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

import { mockServices } from '@backstage/backend-test-utils';
import type { IndexableDocument } from '@backstage/plugin-search-common';
import { OpenSearchSearchEngineIndexer } from './OpenSearchSearchEngineIndexer';

const documents: IndexableDocument[] = [
  { title: 'One', text: 'First document', location: 'url:a' },
  { title: 'Two', text: 'Second document', location: 'url:b' },
];

function createWrapper() {
  const bulk = jest.fn(({ datasource, onDocument, refreshOnCompletion }) => {
    const operations: any[] = [];
    datasource.on('data', (doc: any) => operations.push(onDocument(doc)));
    return new Promise(resolve =>
      datasource.on('end', () => resolve({ operations, refreshOnCompletion })),
    );
  });

  return {
    bulk,
    listIndices: jest.fn().mockResolvedValue({ body: {} }),
    createIndex: jest.fn().mockResolvedValue({ body: {} }),
    deleteIndex: jest.fn().mockResolvedValue({ body: {} }),
    updateAliases: jest.fn().mockResolvedValue({ body: {} }),
  } as any;
}

async function runIndexer(
  indexer: OpenSearchSearchEngineIndexer,
  docs = documents,
) {
  await new Promise<void>((resolve, reject) => {
    indexer.on('error', reject);
    indexer.on('finish', resolve);
    docs.forEach(doc => indexer.write(doc));
    indexer.end();
  });
}

describe('OpenSearchSearchEngineIndexer', () => {
  const logger = mockServices.logger.mock();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('indexes documents into a new index and moves the alias', async () => {
    const wrapper = createWrapper();
    const indexer = new OpenSearchSearchEngineIndexer({
      type: 'docs',
      indexPrefix: 'prefix-',
      indexSeparator: '-index__',
      alias: 'docs__search',
      logger,
      clientWrapper: wrapper,
      batchSize: 100,
    });

    await runIndexer(indexer);

    expect(wrapper.listIndices).toHaveBeenCalledWith({
      index: 'prefix-docs-index__*',
    });
    expect(wrapper.createIndex).toHaveBeenCalledWith({
      index: expect.stringMatching(/^prefix-docs-index__\d+$/),
    });
    expect(wrapper.updateAliases).toHaveBeenCalledWith({
      actions: [
        { remove: { index: 'prefix-docs-index__*', alias: 'docs__search' } },
        { add: { index: indexer.indexName, alias: 'docs__search' } },
      ],
    });
    expect(wrapper.bulk.mock.calls[0][0].refreshOnCompletion).toBe(
      indexer.indexName,
    );
  });

  it('uses document ids from the configured batch key field', async () => {
    const wrapper = createWrapper();
    const indexer = new OpenSearchSearchEngineIndexer({
      type: 'docs',
      indexPrefix: '',
      indexSeparator: '-index__',
      alias: 'docs__search',
      logger,
      clientWrapper: wrapper,
      batchSize: 100,
      batchKeyField: 'location',
    });

    await runIndexer(indexer);

    const { operations } = (await wrapper.bulk.mock.results[0].value) as any;
    expect(operations).toEqual(
      documents.map(doc => ({
        index: { _index: indexer.indexName },
        _id: doc.location,
      })),
    );
  });

  it('skips refresh for OpenSearch Serverless', async () => {
    const wrapper = createWrapper();
    const indexer = new OpenSearchSearchEngineIndexer({
      type: 'docs',
      indexPrefix: '',
      indexSeparator: '-index__',
      alias: 'docs__search',
      logger,
      clientWrapper: wrapper,
      batchSize: 100,
      skipRefresh: true,
    });

    await runIndexer(indexer);

    expect(wrapper.bulk.mock.calls[0][0].refreshOnCompletion).toBe(false);
  });

  it('keeps the currently aliased index and deletes stale indices after a successful run', async () => {
    const wrapper = createWrapper();
    wrapper.listIndices.mockResolvedValue({
      body: {
        'docs-index__100': { aliases: { docs__search: {} } },
        'docs-index__90': { aliases: {} },
      },
    });
    const indexer = new OpenSearchSearchEngineIndexer({
      type: 'docs',
      indexPrefix: '',
      indexSeparator: '-index__',
      alias: 'docs__search',
      logger,
      clientWrapper: wrapper,
      batchSize: 100,
    });

    await runIndexer(indexer);

    expect(wrapper.deleteIndex).toHaveBeenCalledWith({
      index: ['docs-index__90'],
    });
    expect(wrapper.deleteIndex).not.toHaveBeenCalledWith({
      index: ['docs-index__100'],
    });
  });

  it('deletes the new index without swapping aliases when no documents were indexed', async () => {
    const wrapper = createWrapper();
    const indexer = new OpenSearchSearchEngineIndexer({
      type: 'docs',
      indexPrefix: '',
      indexSeparator: '-index__',
      alias: 'docs__search',
      logger,
      clientWrapper: wrapper,
      batchSize: 100,
    });

    await runIndexer(indexer, []);

    expect(wrapper.deleteIndex).toHaveBeenCalledWith({
      index: indexer.indexName,
    });
    expect(wrapper.updateAliases).not.toHaveBeenCalled();
  });

  it('surfaces bulk failures so the index can be cleaned up', async () => {
    const wrapper = createWrapper();
    wrapper.bulk.mockImplementation(() =>
      Promise.reject(new Error('bulk failed')),
    );
    const indexer = new OpenSearchSearchEngineIndexer({
      type: 'docs',
      indexPrefix: '',
      indexSeparator: '-index__',
      alias: 'docs__search',
      logger,
      clientWrapper: wrapper,
      batchSize: 100,
    });

    await expect(runIndexer(indexer)).rejects.toThrow('bulk failed');
    expect(wrapper.updateAliases).not.toHaveBeenCalled();
  });
});
