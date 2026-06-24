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

const mockGetMetadata = jest.fn();
const mockSetMetadata = jest.fn();
const mockListSources = jest.fn();

jest.mock('cleye', () => ({
  cli: jest.fn().mockImplementation((_opts, _cb, args) => ({
    _: { pluginIds: args.filter((a: string) => !a.startsWith('-')) },
  })),
}));
jest.mock('@backstage/cli-node', () => ({
  CliAuth: {
    create: jest.fn().mockImplementation(() => ({
      getMetadata: mockGetMetadata,
      setMetadata: mockSetMetadata,
      getAccessToken: jest.fn().mockResolvedValue('test-token'),
      getBaseUrl: jest.fn().mockReturnValue('https://backstage.example.com'),
    })),
  },
}));
jest.mock('../lib/ActionsClient', () => ({
  ActionsClient: jest.fn().mockImplementation(() => ({
    listSources: mockListSources,
  })),
}));

import sourcesRemoveCommand from './sourcesRemove';

const baseContext: CliCommandContext = {
  args: [],
  info: { name: 'sources remove', description: 'Remove plugin sources' },
} as unknown as CliCommandContext;

function mockMetadata(data: Record<string, unknown>) {
  mockGetMetadata.mockImplementation((key: string) => data[key]);
}

describe('sourcesRemove command', () => {
  let stdoutSpy: jest.SpiedFunction<typeof process.stdout.write>;
  let stderrSpy: jest.SpiedFunction<typeof process.stderr.write>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockListSources.mockResolvedValue([]);
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);
    stderrSpy = jest
      .spyOn(process.stderr, 'write')
      .mockImplementation(() => true);
  });

  afterEach(() => {
    stdoutSpy.mockRestore();
    stderrSpy.mockRestore();
  });

  it('removes a locally added plugin source', async () => {
    mockMetadata({ pluginSources: ['catalog', 'scaffolder'] });
    mockListSources.mockResolvedValue([]);

    await sourcesRemoveCommand({ ...baseContext, args: ['catalog'] });

    expect(mockSetMetadata).toHaveBeenCalledWith('pluginSources', [
      'scaffolder',
    ]);
    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(output).toContain('Removed plugin source: catalog');
  });

  it('excludes a server-provided source', async () => {
    mockMetadata({});
    mockListSources.mockResolvedValue(['catalog', 'scaffolder']);

    await sourcesRemoveCommand({ ...baseContext, args: ['catalog'] });

    expect(mockSetMetadata).toHaveBeenCalledWith('excludedPluginSources', [
      'catalog',
    ]);
    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(output).toContain('Removed plugin source: catalog');
  });

  it('removes multiple plugin sources from mixed origins', async () => {
    mockMetadata({ pluginSources: ['auth'] });
    mockListSources.mockResolvedValue(['catalog', 'scaffolder']);

    await sourcesRemoveCommand({
      ...baseContext,
      args: ['catalog', 'auth'],
    });

    expect(mockSetMetadata).toHaveBeenCalledWith('pluginSources', []);
    expect(mockSetMetadata).toHaveBeenCalledWith('excludedPluginSources', [
      'catalog',
    ]);
    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(output).toContain('Removed plugin sources: catalog, auth');
  });

  it('skips sources that are not in the effective set', async () => {
    mockMetadata({ pluginSources: ['catalog'] });
    mockListSources.mockResolvedValue([]);

    await sourcesRemoveCommand({
      ...baseContext,
      args: ['catalog', 'scaffolder'],
    });

    expect(mockSetMetadata).toHaveBeenCalledWith('pluginSources', []);
    const stdout = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(stdout).toContain('Removed plugin source: catalog');
    const stderr = stderrSpy.mock.calls.map(c => c[0]).join('');
    expect(stderr).toContain('Plugin source "scaffolder" is not configured.');
  });

  it('does not call setMetadata when no sources match', async () => {
    mockMetadata({});
    mockListSources.mockResolvedValue(['catalog']);

    await sourcesRemoveCommand({
      ...baseContext,
      args: ['scaffolder'],
    });

    expect(mockSetMetadata).not.toHaveBeenCalled();
    const stderr = stderrSpy.mock.calls.map(c => c[0]).join('');
    expect(stderr).toContain('Plugin source "scaffolder" is not configured.');
  });
});
