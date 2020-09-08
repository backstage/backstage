/*
 * Copyright 2020 Spotify AB
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

import mockFs from 'mock-fs';
import { resolveStaticConfig } from './resolver';

function normalizePaths(paths: string[]) {
  return paths.map(p =>
    p
      .replace(/^[a-z]:/i, '')
      .split('\\')
      .join('/'),
  );
}

describe('resolveStaticConfig', () => {
  afterEach(() => {
    mockFs.restore();
  });

  it('should resolve no files for empty roots', async () => {
    mockFs({});
    const resolved = await resolveStaticConfig({
      env: 'development',
      rootPaths: [],
    });

    expect(normalizePaths(resolved)).toEqual([]);
  });

  it('should resolve a single app-config', async () => {
    mockFs({ '/repo/app-config.yaml': '' });
    const resolved = await resolveStaticConfig({
      env: 'development',
      rootPaths: ['/repo'],
    });

    expect(normalizePaths(resolved)).toEqual(['/repo/app-config.yaml']);
  });

  it('should resolve a app-configs in different directories', async () => {
    mockFs({
      '/repo/app-config.yaml': '',
      '/repo/packages/a/app-config.yaml': '',
    });
    const resolved = await resolveStaticConfig({
      env: 'development',
      rootPaths: [
        '/repo',
        '/other-repo',
        '/repo/packages/a',
        '/repo/packages/b',
      ],
    });

    expect(normalizePaths(resolved)).toEqual([
      '/repo/app-config.yaml',
      '/repo/packages/a/app-config.yaml',
    ]);
  });

  it('should resolve env and local configs', async () => {
    mockFs({
      '/repo/app-config.yaml': '',
      '/repo/app-config.local.yaml': '',
      '/repo/app-config.production.yaml': '',
      '/repo/app-config.production.local.yaml': '',
      '/repo/app-config.development.local.yaml': '',
      '/repo/packages/a/app-config.development.yaml': '',
      '/repo/packages/a/app-config.local.yaml': '',
    });
    const resolved = await resolveStaticConfig({
      env: 'development',
      rootPaths: ['/repo', '/repo/packages/a'],
    });

    expect(normalizePaths(resolved)).toEqual([
      '/repo/app-config.yaml',
      '/repo/app-config.local.yaml',
      '/repo/app-config.development.local.yaml',
      '/repo/packages/a/app-config.local.yaml',
      '/repo/packages/a/app-config.development.yaml',
    ]);
  });

  it('resolves suffixed configs in the correct order', async () => {
    mockFs({
      '/repo/app-config.yaml': '',
      '/repo/app-config.local.yaml': '',
      '/repo/app-config.production.yaml': '',
      '/repo/app-config.production.local.yaml': '',
    });

    const resolved = await resolveStaticConfig({
      env: 'production',
      rootPaths: ['/repo'],
    });

    expect(normalizePaths(resolved)).toEqual([
      '/repo/app-config.yaml',
      '/repo/app-config.local.yaml',
      '/repo/app-config.production.yaml',
      '/repo/app-config.production.local.yaml',
    ]);
  });
});
