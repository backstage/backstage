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

const pathExists = jest.fn();

jest.mock('fs-extra', () => ({ pathExists }));

import { resolveStaticConfig } from './resolver';

describe('resolveStaticConfig', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should resolve no files for empty roots', async () => {
    const resolved = await resolveStaticConfig({
      env: 'development',
      rootPaths: [],
    });

    expect(resolved).toEqual([]);
    expect(pathExists).not.toHaveBeenCalled();
  });

  it('should resolve a single app-config', async () => {
    pathExists.mockImplementation(async (path: string) =>
      ['/repo/app-config.yaml'].includes(path),
    );
    const resolved = await resolveStaticConfig({
      env: 'development',
      rootPaths: ['/repo'],
    });

    expect(resolved).toEqual(['/repo/app-config.yaml']);
    expect(pathExists).toHaveBeenCalledTimes(4);
  });

  it('should resolve a app-configs in different directories', async () => {
    pathExists.mockImplementation(async (path: string) =>
      ['/repo/app-config.yaml', '/repo/packages/a/app-config.yaml'].includes(
        path,
      ),
    );
    const resolved = await resolveStaticConfig({
      env: 'development',
      rootPaths: [
        '/repo',
        '/other-repo',
        '/repo/packages/a',
        '/repo/packages/b',
      ],
    });

    expect(resolved).toEqual([
      '/repo/app-config.yaml',
      '/repo/packages/a/app-config.yaml',
    ]);
    expect(pathExists).toHaveBeenCalledTimes(16);
  });

  it('should resolve env and local configs', async () => {
    pathExists.mockImplementation(async (path: string) =>
      [
        '/repo/app-config.yaml',
        '/repo/app-config.local.yaml',
        '/repo/app-config.production.yaml',
        '/repo/app-config.production.local.yaml',
        '/repo/app-config.development.local.yaml',
        '/repo/packages/a/app-config.development.yaml',
        '/repo/packages/a/app-config.local.yaml',
      ].includes(path),
    );
    const resolved = await resolveStaticConfig({
      env: 'development',
      rootPaths: ['/repo', '/repo/packages/a'],
    });

    expect(resolved).toEqual([
      '/repo/app-config.yaml',
      '/repo/app-config.local.yaml',
      '/repo/app-config.development.local.yaml',
      '/repo/packages/a/app-config.local.yaml',
      '/repo/packages/a/app-config.development.yaml',
    ]);
    expect(pathExists).toHaveBeenCalledTimes(8);
  });

  it('resolves suffixed configs in the correct order', async () => {
    pathExists.mockImplementation(async () => true);
    const resolved = await resolveStaticConfig({
      env: 'production',
      rootPaths: ['/repo'],
    });

    expect(resolved).toEqual([
      '/repo/app-config.yaml',
      '/repo/app-config.local.yaml',
      '/repo/app-config.production.yaml',
      '/repo/app-config.production.local.yaml',
    ]);
    expect(pathExists).toHaveBeenCalledTimes(4);
  });
});
