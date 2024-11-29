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

import { TestPipeline } from '@backstage/plugin-search-backend-node';
import Mock from '@elastic/elasticsearch-mock';
import { range } from 'lodash';
import { ElasticSearchClientWrapper } from './ElasticSearchClientWrapper';
import { ElasticSearchSearchEngineIndexer } from './ElasticSearchSearchEngineIndexer';
import { mockServices } from '@backstage/backend-test-utils';

const mock = new Mock();
const clientWrapper = ElasticSearchClientWrapper.fromClientOptions({
  node: 'http://localhost:9200',
  Connection: mock.getConnection(),
});

describe('ElasticSearchSearchEngineIndexer', () => {
  let indexer: ElasticSearchSearchEngineIndexer;
  let bulkSpy: jest.Mock;
  let getSpy: jest.Mock;
  let createSpy: jest.Mock;
  let aliasesSpy: jest.Mock;
  let deleteSpy: jest.Mock;
  let refreshSpy: jest.Mock;

  beforeEach(() => {
    // Instantiate the indexer to be tested.
    indexer = new ElasticSearchSearchEngineIndexer({
      type: 'some-type',
      indexPrefix: '',
      indexSeparator: '-index__',
      alias: 'some-type-index__search',
      logger: mockServices.logger.mock(),
      elasticSearchClientWrapper: clientWrapper,
      batchSize: 1000,
      skipRefresh: false,
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
    refreshSpy = jest.fn().mockReturnValue({});
    mock.add(
      {
        method: 'GET',
        path: '/:index/_refresh',
      },
      refreshSpy,
    );

    getSpy = jest.fn().mockReturnValue({
      'some-type-index__123tobedeleted': {
        aliases: {},
        mappings: {},
        settings: {},
      },
      'some-type-index__456tobedeleted': {
        aliases: {},
        mappings: {},
        settings: {},
      },
    });
    mock.add(
      {
        method: 'GET',
        path: '/some-type-index__*',
      },
      getSpy,
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
        path: '/*',
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

    await TestPipeline.fromIndexer(indexer).withDocuments(documents).execute();

    // Older indices should have been queried for.
    expect(getSpy).toHaveBeenCalled();

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
    expect(deleteSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        path: '/some-type-index__123tobedeleted%2Csome-type-index__456tobedeleted',
      }),
    );
  });

  it('handles when no documents are received', async () => {
    await TestPipeline.fromIndexer(indexer).withDocuments([]).execute();

    // Older indices should have been queried for.
    expect(getSpy).toHaveBeenCalled();

    // A new index should have been created.
    expect(createSpy).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        path: expect.stringContaining('some-type-index__'),
      }),
    );

    // No documents should have been sent
    expect(bulkSpy).not.toHaveBeenCalled();

    // Alias should not have been rotated.
    expect(aliasesSpy).not.toHaveBeenCalled();

    // Old index should not be cleaned up.
    expect(deleteSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        path: expect.not.stringContaining('tobedeleted'),
      }),
    );
  });

  it('handles bulk and batching during indexing', async () => {
    const documents = range(550).map(i => ({
      title: `Hello World ${i}`,
      location: `location-${i}`,
      // Generate large document sizes to trigger ES bulk flushing.
      text: range(2000).join(', '),
    }));

    await TestPipeline.fromIndexer(indexer).withDocuments(documents).execute();

    // Ensure multiple bulk requests were made.
    expect(bulkSpy).toHaveBeenCalledTimes(2);
    expect(refreshSpy).toHaveBeenCalledTimes(1);

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
    getSpy = jest.fn().mockReturnValue({});
    mock.clear({
      method: 'GET',
      path: '/some-type-index__*',
    });
    mock.add(
      {
        method: 'GET',
        path: '/some-type-index__*',
      },
      getSpy,
    );

    await TestPipeline.fromIndexer(indexer).withDocuments(documents).execute();

    // Final deletion shouldn't be called.
    expect(deleteSpy).not.toHaveBeenCalled();
  });

  it('split index deletion in chunks', async () => {
    // Generate 200 existing indices
    const currentIndices = Array.from(
      new Array(200),
      (_, i) => `some-type-index__old${i}`,
    );

    const indicesResponse = currentIndices.reduce((acc, curr) => {
      return {
        ...acc,
        [curr]: { mappings: {}, aliases: {} },
      };
    }, {});

    getSpy = jest.fn().mockReturnValue(indicesResponse);
    mock.clear({
      method: 'GET',
      path: '/some-type-index__*',
    });
    mock.add(
      {
        method: 'GET',
        path: '/some-type-index__*',
      },
      getSpy,
    );

    await TestPipeline.fromIndexer(indexer)
      .withDocuments([
        {
          title: 'testTerm',
          text: 'testText',
          location: 'test/location',
        },
      ])
      .execute();

    // Delete endpoint should have been called for 4 chunks of 50 (200 indices)
    expect(deleteSpy).toHaveBeenCalledTimes(4);
  });

  it('handles bulk client rejection', async () => {
    // Given an ES client wrapper that rejects an error
    const expectedError = new Error('HTTP Timeout');
    const mockClientWrapper = ElasticSearchClientWrapper.fromClientOptions({
      node: 'http://localhost:9200',
      Connection: mock.getConnection(),
    });
    mockClientWrapper.bulk = jest.fn().mockRejectedValue(expectedError);

    // And a search engine indexer that uses that client wrapper
    indexer = new ElasticSearchSearchEngineIndexer({
      type: 'some-type',
      indexPrefix: '',
      indexSeparator: '-index__',
      alias: 'some-type-index__search',
      logger: mockServices.logger.mock(),
      elasticSearchClientWrapper: mockClientWrapper,
      batchSize: 1000,
      skipRefresh: false,
    });

    // When the indexer is run in the test pipeline
    const { error } = await TestPipeline.fromIndexer(indexer)
      .withDocuments([{ title: 'a', location: 'a', text: '/a' }])
      .execute();

    // Then the pipeline should have received the expected error
    expect(error).toBe(expectedError);
  });

  it('indexes documents, skip refresh', async () => {
    // Instantiate the indexer to be tested.
    indexer = new ElasticSearchSearchEngineIndexer({
      type: 'some-type',
      indexPrefix: '',
      indexSeparator: '-index__',
      alias: 'some-type-index__search',
      logger: mockServices.logger.mock(),
      elasticSearchClientWrapper: clientWrapper,
      batchSize: 1000,
      skipRefresh: true,
    });

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

    await TestPipeline.fromIndexer(indexer).withDocuments(documents).execute();

    // Ensure bulk called but refresh not
    expect(bulkSpy).toHaveBeenCalledTimes(1);
    expect(refreshSpy).toHaveBeenCalledTimes(0);
  });
});
