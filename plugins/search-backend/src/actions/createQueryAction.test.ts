/*
 * Copyright 2025 The Backstage Authors
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
import { createQueryAction } from './createQueryAction';
import { actionsRegistryServiceMock } from '@backstage/backend-test-utils/alpha';

describe('createQueryAction', () => {
  it('returns results from the search engine', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockGetDocumentTypes = jest.fn().mockReturnValue({
      a: {},
      b: {},
      c: {},
    });
    const mockSearchIndexService = {
      getDocumentTypes: mockGetDocumentTypes,
    } as any;
    const mockQuery = jest.fn().mockResolvedValue({
      results: [
        {
          type: 'test',
          document: { title: 'Result 1', text: 'Text', location: 'origin-a' },
        },
        {
          type: 'test',
          document: { title: 'Result 2', text: 'Text', location: 'origin-b' },
        },
      ],
      nextPageCursor: 'next',
      previousPageCursor: 'prev',
      numberOfResults: 2,
    });
    const mockEngine = { query: mockQuery } as any;
    createQueryAction({
      engine: mockEngine,
      actionsRegistry: mockActionsRegistry,
      searchIndexService: mockSearchIndexService,
    });

    const result = await mockActionsRegistry.invoke({
      id: 'test:query',
      input: { term: 'foo' },
    });

    expect(result.output).toEqual({
      results: [
        {
          type: 'test',
          document: { title: 'Result 1', text: 'Text', location: 'origin-a' },
        },
        {
          type: 'test',
          document: { title: 'Result 2', text: 'Text', location: 'origin-b' },
        },
      ],
      nextPageCursor: 'next',
      totalItems: 2,
      hasMoreResults: false,
    });
  });

  it('forwards input to the search engine', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockGetDocumentTypes = jest.fn().mockReturnValue({
      a: {},
      b: {},
      c: {},
    });
    const mockSearchIndexService = {
      getDocumentTypes: mockGetDocumentTypes,
    } as any;
    const mockQuery = jest.fn().mockResolvedValue({ results: [] });
    const mockEngine = { query: mockQuery } as any;
    createQueryAction({
      engine: mockEngine,
      actionsRegistry: mockActionsRegistry,
      searchIndexService: mockSearchIndexService,
    });

    await mockActionsRegistry.invoke({
      id: 'test:query',
      input: {
        term: 'foo',
        types: ['a'],
        filters: { x: '1234' },
        pageLimit: 5,
        pageCursor: 'abc',
      } as any,
    });
    expect(mockQuery).toHaveBeenCalledWith(
      {
        term: 'foo',
        types: ['a'],
        filters: { x: '1234' },
        pageLimit: 5,
        pageCursor: 'abc',
      },
      expect.anything(),
    );
  });
});
