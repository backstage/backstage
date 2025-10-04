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
import type { IndexableResultSet } from '@backstage/plugin-search-common';

describe('createQueryAction', () => {
  it('returns results from the search engine', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
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
    });

    const result = await mockActionsRegistry.invoke<IndexableResultSet>({
      id: 'test:query',
      input: { term: 'foo' },
    });

    const out = result.output;
    expect(out.results).toHaveLength(2);
    expect(out.results[0].document.title).toBe('Result 1');
    expect(out.nextPageCursor).toBe('next');
    expect(out.previousPageCursor).toBe('prev');
    expect(out.numberOfResults).toBe(2);
  });

  it('forwards input to the search engine', async () => {
    const mockActionsRegistry = actionsRegistryServiceMock();
    const mockQuery = jest.fn().mockResolvedValue({ results: [] });
    const mockEngine = { query: mockQuery } as any;
    createQueryAction({
      engine: mockEngine,
      actionsRegistry: mockActionsRegistry,
    });

    await mockActionsRegistry.invoke({
      id: 'test:query',
      input: {
        term: 'foo',
        types: ['a'],
        filters: { x: '1234' },
        pageLimit: 5,
        pageCursor: 'abc',
      },
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
