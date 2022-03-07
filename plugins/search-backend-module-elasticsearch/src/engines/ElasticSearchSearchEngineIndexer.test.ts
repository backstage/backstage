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

import { getVoidLogger } from '@backstage/backend-common';
import { TestPipeline } from '@backstage/plugin-search-backend-node';
import { Client } from '@elastic/elasticsearch';
import Mock from '@elastic/elasticsearch-mock';
import { range } from 'lodash';
import { ElasticSearchSearchEngineIndexer } from './ElasticSearchSearchEngineIndexer';

const mock = new Mock();
const client = new Client({
  node: 'http://localhost:9200',
  Connection: mock.getConnection(),
});

describe('ElasticSearchSearchEngineIndexer', () => {
  let indexer: ElasticSearchSearchEngineIndexer;
  let bulkSpy: jest.Mock;
  let catSpy: jest.Mock;
  let createSpy: jest.Mock;
  let aliasesSpy: jest.Mock;
  let deleteSpy: jest.Mock;

  beforeEach(() => {
    // Instantiate the indexer to be tested.
    indexer = new ElasticSearchSearchEngineIndexer({
      type: 'some-type',
      indexPrefix: '',
      indexSeparator: '-index__',
      alias: 'some-type-index__search',
      logger: getVoidLogger(),
      elasticSearchClient: client,
    });

    // Set up all requisite Elastic mocks.
    mock.clearAll();
    bulkSpy = jest.fn().mockReturnValue({ took: 9, errors: false, items: [] });
    mock.add(
      {
        method: 'POST',
        path: '/_bulk',
      },
      bulkSpy,
    );
    mock.add(
      {
        method: 'GET',
        path: '/:index/_refresh',
      },
      jest.fn().mockReturnValue({}),
    );

    catSpy = jest.fn().mockReturnValue([
      {
        alias: 'some-type-index__search',
        index: 'some-type-index__123tobedeleted',
        filter: '-',
        'routing.index': '-',
        'routing.search': '-',
        is_write_index: '-',
      },
    ]);
    mock.add(
      {
        method: 'GET',
        path: '/_cat/aliases/some-type-index__search',
      },
      catSpy,
    );

    createSpy = jest.fn().mockReturnValue({
      acknowledged: true,
      shards_acknowledged: true,
      index: 'single_index',
    });
    mock.add(
      {
        method: 'PUT',
        path: '/:index',
      },
      createSpy,
    );

    aliasesSpy = jest.fn().mockReturnValue({});
    mock.add(
      {
        method: 'POST',
        path: '*',
      },
      aliasesSpy,
    );

    deleteSpy = jest.fn().mockReturnValue({});
    mock.add(
      {
        method: 'DELETE',
        path: '/some-type-index__123tobedeleted',
      },
      deleteSpy,
    );
  });

  it('indexes documents', async () => {
    const documents = [
      {
        title: 'testTerm',
        text: 'testText',
        location: 'test/location',
      },
      {
        title: 'Another test',
        text: 'Some more text',
        location: 'test/location/2',
      },
    ];

    await TestPipeline.withSubject(indexer).withDocuments(documents).execute();

    // Older indices should have been queried for.
    expect(catSpy).toHaveBeenCalled();

    // A new index should have been created.
    const createdIndex = createSpy.mock.calls[0][0].path.slice(1);
    expect(createdIndex).toContain('some-type-index__');

    // Bulk helper should have been called with documents.
    const bulkBody = bulkSpy.mock.calls[0][0].body;
    expect(bulkBody[0]).toStrictEqual({ index: { _index: createdIndex } });
    expect(bulkBody[1]).toStrictEqual(documents[0]);
    expect(bulkBody[2]).toStrictEqual({ index: { _index: createdIndex } });
    expect(bulkBody[3]).toStrictEqual(documents[1]);

    // Alias should have been rotated.
    expect(aliasesSpy).toHaveBeenCalled();
    const aliasActions = aliasesSpy.mock.calls[0][0].body.actions;
    expect(aliasActions[0]).toStrictEqual({
      remove: { index: 'some-type-index__*', alias: 'some-type-index__search' },
    });
    expect(aliasActions[1]).toStrictEqual({
      add: { index: createdIndex, alias: 'some-type-index__search' },
    });

    // Old index should be cleaned up.
    expect(deleteSpy).toHaveBeenCalled();
  });

  it('handles bulk and batching during indexing', async () => {
    const documents = range(550).map(i => ({
      title: `Hello World ${i}`,
      location: `location-${i}`,
      // Generate large document sizes to trigger ES bulk flushing.
      text: range(2000).join(', '),
    }));

    await TestPipeline.withSubject(indexer).withDocuments(documents).execute();

    // Ensure multiple bulk requests were made.
    expect(bulkSpy).toHaveBeenCalledTimes(2);

    // Ensure the first and last documents were included in the payloads.
    const docLocations: string[] = [
      ...bulkSpy.mock.calls[0][0].body.map((l: any) => l.location),
      ...bulkSpy.mock.calls[1][0].body.map((l: any) => l.location),
    ];
    expect(docLocations).toContain('location-0');
    expect(docLocations).toContain('location-549');
  });

  it('ignores cleanup when no existing indices exist', async () => {
    const documents = [
      {
        title: 'testTerm',
        text: 'testText',
        location: 'test/location',
      },
    ];

    // Update initial alias cat to return nothing.
    catSpy = jest.fn().mockReturnValue([]);
    mock.clear({
      method: 'GET',
      path: '/_cat/aliases/some-type-index__search',
    });
    mock.add(
      {
        method: 'GET',
        path: '/_cat/aliases/some-type-index__search',
      },
      catSpy,
    );

    await TestPipeline.withSubject(indexer).withDocuments(documents).execute();

    // Final deletion shouldn't be called.
    expect(deleteSpy).not.toHaveBeenCalled();
  });
});
