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

import { getWorkspacesPatterns } from './workspaces';

describe('getWorkspacesPatterns', () => {
  it('returns empty array when pkgJson has no workspaces key', () => {
    expect(getWorkspacesPatterns({ name: 'pkg' })).toEqual([]);
  });

  it('returns patterns when workspaces is array form', () => {
    const patterns = ['packages/*', 'apps/*'];
    expect(getWorkspacesPatterns({ workspaces: patterns })).toEqual(patterns);
  });

  it('returns patterns when workspaces is object form with packages', () => {
    const patterns = ['packages/*'];
    expect(
      getWorkspacesPatterns({ workspaces: { packages: patterns } }),
    ).toEqual(patterns);
  });

  it('returns empty array when workspaces is object without packages array', () => {
    expect(getWorkspacesPatterns({ workspaces: {} })).toEqual([]);
    expect(getWorkspacesPatterns({ workspaces: { noMatch: [] } })).toEqual([]);
  });

  it('throws when pkgJson is not an object', () => {
    expect(() => getWorkspacesPatterns(null)).toThrow(
      'pkgJson must be an object',
    );
    expect(() => getWorkspacesPatterns('string')).toThrow(
      'pkgJson must be an object',
    );
    expect(() => getWorkspacesPatterns(42)).toThrow(
      'pkgJson must be an object',
    );
  });

  it('throws when workspaces array contains non-strings', () => {
    expect(() => getWorkspacesPatterns({ workspaces: ['a', 1, 'b'] })).toThrow(
      'must be an array of strings',
    );
    expect(() => getWorkspacesPatterns({ workspaces: [null] })).toThrow(
      'must be an array of strings',
    );
  });

  it('throws when workspaces.packages contains non-strings', () => {
    expect(() =>
      getWorkspacesPatterns({
        workspaces: { packages: ['a', 1] },
      }),
    ).toThrow('must be an array of strings');
  });
});
