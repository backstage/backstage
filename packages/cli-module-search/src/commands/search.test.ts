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

import type { CliCommandContext } from '@backstage/cli-node';

const mockQuery = jest.fn();

jest.mock('cleye', () => ({
  cli: jest.fn().mockReturnValue({ flags: {} }),
}));
jest.mock('../lib/resolveAuth', () => ({
  resolveAuth: jest.fn().mockResolvedValue({
    accessToken: 'tok',
    baseUrl: 'https://backstage.example.com',
    instanceName: 'default',
    pluginSources: ['search'],
  }),
}));
jest.mock('../lib/SearchClient', () => ({
  SearchClient: jest.fn().mockImplementation(() => ({
    query: mockQuery,
  })),
}));

import searchCommand from './search';
import { cli } from 'cleye';

const mockCli = cli as jest.MockedFunction<typeof cli>;

const ctx = (args: string[]): CliCommandContext =>
  ({
    args,
    info: { name: 'search', usage: 'backstage-cli search' },
  } as unknown as CliCommandContext);

describe('search', () => {
  let stdoutSpy: jest.SpiedFunction<typeof process.stdout.write>;

  beforeEach(() => {
    jest.clearAllMocks();
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
  });

  it('throws when no search term provided', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: {} });

    await expect(searchCommand(ctx([]))).rejects.toThrow(
      'Search term is required',
    );
  });

  it('queries with term', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: {} });
    mockQuery.mockResolvedValue({ results: [] });

    await searchCommand(ctx(['my', 'service']));

    expect(mockQuery).toHaveBeenCalledWith({
      term: 'my service',
      types: undefined,
      filters: undefined,
      pageLimit: undefined,
      pageCursor: undefined,
    });
  });

  it('passes types filter when provided', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { types: '["techdocs"]' },
    });
    mockQuery.mockResolvedValue({ results: [] });

    await searchCommand(ctx(['docs', '--types', '["techdocs"]']));

    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({ term: 'docs', types: ['techdocs'] }),
    );
  });

  it('passes pagination flags', async () => {
    (mockCli as jest.Mock).mockReturnValue({
      flags: { 'page-limit': 5, 'page-cursor': 'abc' },
    });
    mockQuery.mockResolvedValue({ results: [] });

    await searchCommand(ctx(['term']));

    expect(mockQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        term: 'term',
        pageLimit: 5,
        pageCursor: 'abc',
      }),
    );
  });

  it('outputs JSON when --output json', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { output: 'json' } });
    mockQuery.mockResolvedValue({
      results: [{ document: { title: 'Test' } }],
      numberOfResults: 1,
    });

    await searchCommand(ctx(['test']));

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(JSON.parse(output)).toEqual({
      results: [{ document: { title: 'Test' } }],
      nextPageCursor: undefined,
      totalItems: 1,
      hasMoreResults: false,
    });
  });

  it('outputs human-readable format by default', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: {} });
    mockQuery.mockResolvedValue({
      results: [
        {
          document: {
            title: 'My Service',
            location: '/catalog/default/component/my-svc',
            text: 'A great service',
          },
        },
      ],
    });

    await searchCommand(ctx(['service']));

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(output).toContain('My Service');
    expect(output).toContain('/catalog/default/component/my-svc');
    expect(output).toContain('A great service');
  });
});
