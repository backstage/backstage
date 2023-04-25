/*
 * Copyright 2022 The Backstage Authors
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

import { resolve as resolvePath } from 'path';
import { resolvePackagePaths } from './paths';

describe('resolvePackages', () => {
  it('should return all packages', async () => {
    const paths = await resolvePackagePaths();
    expect(paths.length).toBeGreaterThan(10);
    expect(paths).toContain('packages/cli');
    expect(paths).toContain('packages/repo-tools');
  });

  it('should filter by path', async () => {
    await expect(
      resolvePackagePaths({ paths: ['packages/repo-tools'] }),
    ).resolves.toEqual(['packages/repo-tools']);

    await expect(
      resolvePackagePaths({ paths: [resolvePath('packages/repo-tools')] }),
    ).resolves.toEqual(['packages/repo-tools']);

    await expect(
      resolvePackagePaths({
        paths: [resolvePath('packages/repo-tools/package.json')],
      }),
    ).resolves.toEqual(['packages/repo-tools']);
    await expect(
      resolvePackagePaths({
        paths: ['packages/repo-tools/src/some/made/up/file.ts'],
      }),
    ).resolves.toEqual(['packages/repo-tools']);
    await expect(
      resolvePackagePaths({
        paths: ['packages/repo-tools/src/some/made/up/file.ts', 'packages/cli'],
      }),
    ).resolves.toEqual(['packages/cli', 'packages/repo-tools']);
  });

  it('should filter with include', async () => {
    const allPackages = await resolvePackagePaths();
    const pluginPackages = await resolvePackagePaths({
      include: ['plugins/*'],
    });

    expect(allPackages.length).toBeGreaterThan(10);
    expect(pluginPackages.length).toBeGreaterThan(10);
    expect(allPackages.length).toBeGreaterThan(pluginPackages.length);

    expect(pluginPackages).toContain('plugins/catalog');

    await expect(
      resolvePackagePaths({ include: ['packages/repo-t??ls'] }),
    ).resolves.toEqual(['packages/repo-tools']);
  });

  it('should filter with exclude', async () => {
    const nonPluginPackages = await resolvePackagePaths({
      exclude: ['plugins/*'],
    });

    expect(nonPluginPackages).toContain('packages/app');
    expect(nonPluginPackages).not.toContain('plugins/catalog');
  });

  it('should combine all options', async () => {
    await expect(
      resolvePackagePaths({
        paths: ['packages/cli', 'packages/backend', 'packages/app'],
        include: ['packages/app'],
        exclude: ['packages/back*'],
      }),
    ).resolves.toEqual(['packages/app']);
  });
});
