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
    })),
  },
}));

import sourcesRemoveCommand from './sourcesRemove';

const baseContext: CliCommandContext = {
  args: [],
  info: { name: 'sources remove', description: 'Remove plugin sources' },
} as unknown as CliCommandContext;

describe('sourcesRemove command', () => {
  let stdoutSpy: jest.SpiedFunction<typeof process.stdout.write>;
  let stderrSpy: jest.SpiedFunction<typeof process.stderr.write>;

  beforeEach(() => {
    jest.clearAllMocks();
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

  it('removes a single configured plugin source', async () => {
    mockGetMetadata.mockResolvedValue(['catalog', 'scaffolder']);

    await sourcesRemoveCommand({ ...baseContext, args: ['catalog'] });

    expect(mockSetMetadata).toHaveBeenCalledWith('pluginSources', [
      'scaffolder',
    ]);
    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(output).toContain('Removed plugin source: catalog');
  });

  it('removes multiple plugin sources at once', async () => {
    mockGetMetadata.mockResolvedValue(['catalog', 'scaffolder', 'techdocs']);

    await sourcesRemoveCommand({
      ...baseContext,
      args: ['catalog', 'scaffolder'],
    });

    expect(mockSetMetadata).toHaveBeenCalledWith('pluginSources', ['techdocs']);
    const output = stdoutSpy.mock.calls.map(c => c[0]).join('');
    expect(output).toContain('Removed plugin sources: catalog, scaffolder');
  });

  it('skips unconfigured sources and removes existing ones', async () => {
    mockGetMetadata.mockResolvedValue(['catalog']);

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
    mockGetMetadata.mockResolvedValue(['catalog']);

    await sourcesRemoveCommand({
      ...baseContext,
      args: ['scaffolder'],
    });

    expect(mockSetMetadata).not.toHaveBeenCalled();
    const stderr = stderrSpy.mock.calls.map(c => c[0]).join('');
    expect(stderr).toContain('Plugin source "scaffolder" is not configured.');
  });
});
