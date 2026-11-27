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

import { Client } from '@opensearch-project/opensearch';
import { Readable } from 'node:stream';
import { OpenSearchClientWrapper } from './OpenSearchClientWrapper';

jest.mock('@opensearch-project/opensearch', () => ({
  ...jest.requireActual('@opensearch-project/opensearch'),
  Client: jest.fn().mockReturnValue({
    search: jest.fn().mockImplementation(async args => ({ args })),
    helpers: {
      bulk: jest.fn().mockImplementation(async args => ({ args })),
    },
    indices: {
      get: jest.fn().mockImplementation(async args => ({ args })),
      create: jest.fn().mockImplementation(async args => ({ args })),
      delete: jest.fn().mockImplementation(async args => ({ args })),
      exists: jest.fn().mockImplementation(async args => ({ args })),
      putIndexTemplate: jest.fn().mockImplementation(async args => ({ args })),
      updateAliases: jest.fn().mockImplementation(async args => ({ args })),
    },
  }),
}));

describe('OpenSearchClientWrapper', () => {
  const options = { node: 'http://localhost:9200' };
  let wrapper: OpenSearchClientWrapper;

  beforeEach(() => {
    jest.clearAllMocks();
    wrapper = OpenSearchClientWrapper.fromClientOptions(options);
  });

  it('creates an OpenSearch client from the supplied options', () => {
    expect(Client).toHaveBeenCalledWith(options);
  });

  it('adds index tolerance options to searches', async () => {
    const body = { query: { match_all: {} } };
    const result = (await wrapper.search({
      index: 'docs__search',
      body,
    })) as any;

    expect(result.args).toEqual({
      index: 'docs__search',
      body,
      ignore_unavailable: true,
      allow_no_indices: true,
    });
  });

  it('forwards bulk requests with a document stream', async () => {
    const datasource = Readable.from([]);
    const onDocument = (doc: any) => ({
      index: { _index: 'docs-index__1' },
      _id: doc.id,
    });

    await wrapper.bulk({ datasource, onDocument, refreshOnCompletion: true });

    expect(
      (Client as unknown as jest.Mock).mock.results[0].value.helpers.bulk,
    ).toHaveBeenCalledWith({
      datasource,
      onDocument,
      refreshOnCompletion: true,
    });
  });

  it.each([
    ['putIndexTemplate', { name: 't', body: { index_patterns: ['*'] } }],
    ['listIndices', { index: 'docs-index__*' }],
    ['indexExists', { index: 'docs-index__1' }],
    ['deleteIndex', { index: 'docs-index__1' }],
    ['createIndex', { index: 'docs-index__1' }],
  ] as const)('forwards %s to the OpenSearch client', async (method, args) => {
    const result = await (wrapper as any)[method](args);
    expect(result.args).toEqual(args);
  });

  it('filters empty alias actions before updating aliases', async () => {
    const actions: any[] = [
      { remove: { index: 'old', alias: 'docs__search' } },
      undefined,
      { add: { index: 'new', alias: 'docs__search' } },
    ];

    const result = (await wrapper.updateAliases({ actions })) as any;

    expect(result.args).toEqual({
      body: { actions: actions.filter(Boolean) },
    });
  });
});
