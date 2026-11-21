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

import type { CliCommandContext } from '@backstage/cli-node';
import infoCommand from './info';
import * as releaseMapModule from '../lib/releaseMap';
import { Lockfile, PackageGraph } from '@backstage/cli-node';
import fs from 'fs-extra';

jest.mock('chalk', () => ({
  yellow: (str: string) => str,
}));

jest.mock('@backstage/cli-common', () => {
  const actual = jest.requireActual('@backstage/cli-common');
  return {
    ...actual,
    runOutput: jest.fn().mockResolvedValue('1.22.19'),
  };
});

jest.mock('../lib/releaseMap');
const mockBuildReleaseMap = jest.spyOn(releaseMapModule, 'buildReleaseMap');

describe('backstage-cli info', () => {
  let logSpy: jest.SpyInstance;
  let warnSpy: jest.SpyInstance;
  let stdoutSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    logSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => true);

    jest.spyOn(fs, 'existsSync').mockReturnValue(true);
    jest.spyOn(fs, 'readJSON').mockResolvedValue({ version: '1.45.0' });

    jest.spyOn(Lockfile, 'load').mockResolvedValue({
      keys: () => ['@backstage/core-plugin-api', '@backstage/catalog-model'],
      get: (name: string) => {
        if (name === '@backstage/core-plugin-api') {
          return [{ version: '1.8.0' } as any];
        }
        if (name === '@backstage/catalog-model') {
          return [{ version: '1.6.0' } as any];
        }
        return undefined;
      },
    } as any);

    jest.spyOn(PackageGraph, 'listTargetPackages').mockResolvedValue([]);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const ctx = (args: string[] = []): CliCommandContext =>
    ({
      args,
      info: { name: 'info', usage: 'backstage-cli info' },
    } as unknown as CliCommandContext);

  it('runs without --release-map by default and prints standard dependency info', async () => {
    await infoCommand(ctx([]));

    expect(mockBuildReleaseMap).not.toHaveBeenCalled();
    const output = logSpy.mock.calls.map(call => call.join(' ')).join('\n');
    expect(output).toContain('@backstage/core-plugin-api 1.8.0');
    expect(output).toContain('@backstage/catalog-model   1.6.0');
    expect(output).not.toContain('(release ');
  });

  it('maps packages to releases when --release-map is set', async () => {
    mockBuildReleaseMap.mockResolvedValueOnce({
      packageReleases: new Map([
        [
          '@backstage/core-plugin-api',
          [{ version: '1.8.0', release: '1.45.0' }],
        ],
        [
          '@backstage/catalog-model',
          [{ version: '1.6.0', release: '1.46.0', isNewer: true }],
        ],
      ]),
      mostCommonRelease: '1.45.0',
      newerPackages: [
        {
          name: '@backstage/catalog-model',
          version: '1.6.0',
          release: '1.46.0',
        },
      ],
    });

    await infoCommand(ctx(['--release-map']));

    expect(mockBuildReleaseMap).toHaveBeenCalledWith(
      [
        { name: '@backstage/catalog-model', versions: ['1.6.0'] },
        { name: '@backstage/core-plugin-api', versions: ['1.8.0'] },
      ],
      { backstageVersion: '1.45.0' },
    );

    const output = logSpy.mock.calls.map(call => call.join(' ')).join('\n');
    expect(output).toContain(
      '@backstage/core-plugin-api 1.8.0 (release 1.45.0)',
    );
    expect(output).toContain(
      '@backstage/catalog-model   1.6.0 (release 1.46.0) *',
    );
    expect(output).toContain(
      '* The following package(s) belong to a newer release than the baseline (1.45.0):',
    );
    expect(output).toContain(
      '- @backstage/catalog-model@1.6.0 (from release 1.46.0)',
    );
  });

  it('outputs JSON with release mapping info when --release-map and --format json are used', async () => {
    mockBuildReleaseMap.mockResolvedValueOnce({
      packageReleases: new Map([
        [
          '@backstage/core-plugin-api',
          [{ version: '1.8.0', release: '1.45.0' }],
        ],
        [
          '@backstage/catalog-model',
          [{ version: '1.6.0', release: '1.46.0', isNewer: true }],
        ],
      ]),
      mostCommonRelease: '1.45.0',
      newerPackages: [
        {
          name: '@backstage/catalog-model',
          version: '1.6.0',
          release: '1.46.0',
        },
      ],
    });

    await infoCommand(ctx(['--release-map', '--format', 'json']));

    expect(stdoutSpy).toHaveBeenCalled();
    const stdoutOutput = stdoutSpy.mock.calls[0][0];
    const parsed = JSON.parse(stdoutOutput);

    expect(parsed.dependencies['@backstage/core-plugin-api']).toEqual([
      { version: '1.8.0', release: '1.45.0' },
    ]);
    expect(parsed.dependencies['@backstage/catalog-model']).toEqual([
      { version: '1.6.0', release: '1.46.0', isNewer: true },
    ]);
    expect(parsed.releaseMap).toEqual({
      mostCommonRelease: '1.45.0',
      newerPackages: [
        {
          name: '@backstage/catalog-model',
          version: '1.6.0',
          release: '1.46.0',
        },
      ],
    });
  });

  it('handles release map fetch failures gracefully without crashing', async () => {
    mockBuildReleaseMap.mockRejectedValueOnce(
      new Error('Failed to fetch manifest'),
    );

    await infoCommand(ctx(['--release-map']));

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('Failed to fetch Backstage release manifests'),
    );
    const output = logSpy.mock.calls.map(call => call.join(' ')).join('\n');
    expect(output).toContain('@backstage/core-plugin-api 1.8.0');
  });
});
