/*
 * Copyright 2020 The Backstage Authors
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

import { cli } from 'cleye';
import { createFlagFinder } from './test';

describe('createFlagFinder', () => {
  it('finds flags', () => {
    const find = createFlagFinder([
      '--foo',
      '--no-bar',
      '-b',
      '-c',
      '--baz=1',
      '--qux',
      '2',
      '-de',
    ]);

    expect(
      find('--foo', '--bar', '-b', '-c', '--baz', '--qux', '-d', '-e'),
    ).toBe(true);
    expect(find('--foo')).toBe(true);
    expect(find('--bar')).toBe(true);
    expect(find('--no-bar')).toBe(false);
    expect(find('-a')).toBe(false);
    expect(find('-b')).toBe(true);
    expect(find('-c')).toBe(true);
    expect(find('-d')).toBe(true);
    expect(find('-e')).toBe(true);
    expect(find('--baz')).toBe(true);
    expect(find('--qux')).toBe(true);
    expect(find('--qux')).toBe(true);
  });
});

describe('repo test arg forwarding', () => {
  // Mirrors the cleye configuration used in the repo test command handler
  function parseRepoTestArgs(args: string[]) {
    return cli(
      {
        help: false,
        flags: {
          since: { type: String },
          successCache: { type: Boolean },
          successCacheDir: { type: String },
          jestHelp: { type: Boolean },
        },
        ignoreArgv: type => type === 'unknown-flag' || type === 'argument',
      },
      undefined,
      args,
    );
  }

  it('strips Backstage flags from args while preserving Jest flags and arguments', () => {
    const args = [
      '--since',
      'main',
      '--success-cache',
      '--coverage',
      '--watch',
      'path/to/test',
    ];

    const { flags } = parseRepoTestArgs(args);

    expect(flags.since).toBe('main');
    expect(flags.successCache).toBe(true);
    expect(args).toEqual(['--coverage', '--watch', 'path/to/test']);
  });

  it('supports legacy camelCase flag names', () => {
    const args = ['--successCache', '--successCacheDir', '/tmp/cache'];

    const { flags } = parseRepoTestArgs(args);

    expect(flags.successCache).toBe(true);
    expect(flags.successCacheDir).toBe('/tmp/cache');
    expect(args).toEqual([]);
  });

  it('leaves args untouched when no Backstage flags are present', () => {
    const args = ['--coverage', '--verbose', '--bail'];

    parseRepoTestArgs(args);

    expect(args).toEqual(['--coverage', '--verbose', '--bail']);
  });
});
