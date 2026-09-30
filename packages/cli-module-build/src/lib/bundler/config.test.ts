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

import { ConfigReader } from '@backstage/config';
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
});
