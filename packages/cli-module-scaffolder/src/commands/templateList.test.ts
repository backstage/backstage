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

const mockQueryEntities = jest.fn();

jest.mock('cleye', () => ({
  cli: jest.fn().mockReturnValue({ flags: {} }),
}));
jest.mock('../lib/resolveAuth', () => ({
  resolveAuth: jest.fn().mockResolvedValue({
    accessToken: 'tok',
    baseUrl: 'https://backstage.example.com',
    instanceName: 'default',
    pluginSources: ['scaffolder'],
  }),
}));
jest.mock('../lib/catalogClient', () => ({
  createCatalogClient: jest.fn().mockImplementation(() => ({
    queryEntities: mockQueryEntities,
  })),
}));

import templateList from './templateList';
import { cli } from 'cleye';

const mockCli = cli as jest.MockedFunction<typeof cli>;

const ctx = (args: string[]): CliCommandContext =>
  ({
    args,
    info: { name: 'template list', usage: 'backstage-cli template list' },
  } as unknown as CliCommandContext);

describe('template list', () => {
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

  it('queries the catalog for Template entities', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: {} });
    mockQueryEntities.mockResolvedValue({
      items: [],
      totalItems: 0,
      pageInfo: {},
    });

    await templateList(ctx([]));

    expect(mockQueryEntities).toHaveBeenCalledWith(
      { query: { kind: 'Template' } },
      { token: 'tok' },
    );
  });

  it('passes limit when provided', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { limit: 5 } });
    mockQueryEntities.mockResolvedValue({
      items: [],
      totalItems: 0,
      pageInfo: {},
    });

    await templateList(ctx(['--limit', '5']));

    expect(mockQueryEntities).toHaveBeenCalledWith(
      { query: { kind: 'Template' }, limit: 5 },
      { token: 'tok' },
    );
  });

  it('outputs JSON when --output json', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: { output: 'json' } });
    mockQueryEntities.mockResolvedValue({
      items: [{ kind: 'Template', metadata: { name: 'my-template' } }],
      totalItems: 1,
      pageInfo: {},
    });

    await templateList(ctx(['--output', 'json']));

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(JSON.parse(output)).toEqual({
      items: [{ kind: 'Template', metadata: { name: 'my-template' } }],
      totalItems: 1,
      hasMoreEntities: false,
      nextPageCursor: undefined,
    });
  });

  it('outputs a human-readable table by default', async () => {
    (mockCli as jest.Mock).mockReturnValue({ flags: {} });
    mockQueryEntities.mockResolvedValue({
      items: [
        {
          kind: 'Template',
          metadata: { name: 'my-template', namespace: 'default' },
          spec: { type: 'service' },
        },
      ],
      totalItems: 1,
      pageInfo: {},
    });

    await templateList(ctx([]));

    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(output).toContain('my-template');
    expect(output).toContain('Template');
  });
});
