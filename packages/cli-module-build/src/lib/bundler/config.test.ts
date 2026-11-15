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

import { createMockDirectory } from '@backstage/backend-test-utils';
import { ConfigReader } from '@backstage/config';
import webpack from 'webpack';
import { createConfig } from './config';
import { BundlingPaths } from './paths';
import { BundlingOptions } from './types';

const paths: BundlingPaths = {
  targetHtml: '/fake/app/public/index.html',
  targetPublic: undefined,
  targetPath: '/fake/app',
  targetRunFile: undefined,
  targetDist: '/fake/app/dist',
  targetAssets: '/fake/app/assets',
  targetSrc: '/fake/app/src',
  targetDev: '/fake/app/dev',
  targetEntry: '/fake/app/src/index.tsx',
  targetTsConfig: '/fake/tsconfig.json',
  targetPackageJson: '/fake/app/package.json',
  rootNodeModules: '/fake/node_modules',
  root: '/fake',
};

function createOptions(
  overrides: Partial<BundlingOptions> = {},
): BundlingOptions {
  return {
    checksEnabled: false,
    isDev: false,
    frontendConfig: new ConfigReader({}),
    getFrontendAppConfigs: () => [],
    ...overrides,
  };
}

describe('createConfig', () => {
  const env = {
    EXPERIMENTAL_LAZY_COMPILATION: process.env.EXPERIMENTAL_LAZY_COMPILATION,
    BROWSERSLIST_ENV: process.env.BROWSERSLIST_ENV,
  };
  const mockDir = createMockDirectory();

  afterEach(() => {
    for (const [name, value] of Object.entries(env)) {
      if (value === undefined) {
        delete process.env[name];
      } else {
        process.env[name] = value;
      }
    }
  });

  it('places deferredEntryPoints after targetEntry, and targetEntry after additionalEntryPoints', async () => {
    const options = createOptions({
      additionalEntryPoints: ['additional-entry-package'],
      deferredEntryPoints: ['deferred-entry-package'],
    });

    const { entry } = await createConfig(paths, options);
    const entryArray = entry as string[];

    const additionalIndex = entryArray.indexOf('additional-entry-package');
    const targetEntryIndex = entryArray.indexOf(paths.targetEntry);
    const deferredIndex = entryArray.indexOf('deferred-entry-package');

    expect(additionalIndex).toBeGreaterThan(-1);
    expect(targetEntryIndex).toBeGreaterThan(-1);
    expect(deferredIndex).toBeGreaterThan(-1);

    expect(additionalIndex).toBeLessThan(targetEntryIndex);
    expect(targetEntryIndex).toBeLessThan(deferredIndex);
  });

  it('produces an entry array with only targetEntry when no additional or deferred entry points are configured', async () => {
    const options = createOptions();

    const { entry } = await createConfig(paths, options);
    const entryArray = entry as string[];

    expect(entryArray).toContain(paths.targetEntry);
    expect(entryArray).toHaveLength(2); // webpack-public-path + targetEntry
  });

  // Rspack and WebPack each reject the other's shape for these options, so a
  // mix-up only shows up when the bundler validates the config.
  it('uses the option shapes that each bundler accepts', async () => {
    process.env.EXPERIMENTAL_LAZY_COMPILATION = 'true';

    const rspackConfig = await createConfig(paths, createOptions());
    expect(rspackConfig.lazyCompilation).toBe(true);
    expect(rspackConfig.experiments).toBeUndefined();
    expect(rspackConfig.module?.parser?.javascript).toEqual({
      exportsPresence: 'auto',
      requireAlias: true,
    });

    const webpackConfig = await createConfig(paths, createOptions({ webpack }));
    expect(webpackConfig).not.toHaveProperty('lazyCompilation');
    expect(webpackConfig.experiments).toEqual({ lazyCompilation: true });
    expect(webpackConfig.module?.parser).toBeUndefined();
  });

  // Rspack picks the browserslist environment by NODE_ENV, which package
  // builds in the same process can change, unless the target names it.
  it('names the browserslist environment for production builds', async () => {
    mockDir.setContent({
      'package.json': JSON.stringify({
        browserslist: { production: ['chrome 100'] },
      }),
    });
    const appPaths = { ...paths, targetPath: mockDir.path };
    delete process.env.BROWSERSLIST_ENV;

    expect((await createConfig(appPaths, createOptions())).target).toBe(
      'browserslist:production',
    );
    expect(
      (await createConfig(appPaths, createOptions({ isDev: true }))).target,
    ).toBeUndefined();
    expect(
      (await createConfig(appPaths, createOptions({ webpack }))).target,
    ).toBeUndefined();

    process.env.BROWSERSLIST_ENV = 'modern';
    expect((await createConfig(appPaths, createOptions())).target).toBe(
      'browserslist:modern',
    );

    // Without a browserslist config, Rspack targets `web`
    expect((await createConfig(paths, createOptions())).target).toBeUndefined();
  });
});
