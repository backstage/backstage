/*
 * Copyright 2024 The Backstage Authors
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
import { mockServices } from '@backstage/backend-test-utils';
import { PackageDiscoveryService } from './PackageDiscoveryService';

// Mock package.json for testing getDependencyNames
jest.mock(
  '/mock/package.json',
  () => ({
    dependencies: {
      '@backstage/plugin-catalog-backend': '^1.0.0',
      '@backstage/plugin-auth-backend': '^1.0.0',
      '@backstage/plugin-scaffolder-backend': '^1.0.0',
      'some-other-package': '^1.0.0',
    },
  }),
  { virtual: true },
);

function createService(packagesConfig?: unknown) {
  const config = new ConfigReader(
    packagesConfig !== undefined
      ? { backend: { packages: packagesConfig } }
      : {},
  );
  return new PackageDiscoveryService(config, mockServices.rootLogger.mock());
}

describe('PackageDiscoveryService', () => {
  describe('getDependencyNames', () => {
    it('returns all dependencies when config is "all"', () => {
      const result =
        createService('all').getDependencyNames('/mock/package.json');

      expect(result).toEqual([
        '@backstage/plugin-catalog-backend',
        '@backstage/plugin-auth-backend',
        '@backstage/plugin-scaffolder-backend',
        'some-other-package',
      ]);
    });

    it('returns only included packages', () => {
      const result = createService({
        include: [
          '@backstage/plugin-catalog-backend',
          '@backstage/plugin-auth-backend',
        ],
      }).getDependencyNames('/mock/package.json');

      expect(result).toEqual([
        '@backstage/plugin-catalog-backend',
        '@backstage/plugin-auth-backend',
      ]);
    });

    it('excludes specified packages', () => {
      const result = createService({
        exclude: ['some-other-package'],
      }).getDependencyNames('/mock/package.json');

      expect(result).toEqual([
        '@backstage/plugin-catalog-backend',
        '@backstage/plugin-auth-backend',
        '@backstage/plugin-scaffolder-backend',
      ]);
    });

    it('applies both include and exclude filters', () => {
      const result = createService({
        include: [
          '@backstage/plugin-catalog-backend',
          '@backstage/plugin-auth-backend',
          '@backstage/plugin-scaffolder-backend',
        ],
        exclude: ['@backstage/plugin-scaffolder-backend'],
      }).getDependencyNames('/mock/package.json');

      expect(result).toEqual([
        '@backstage/plugin-catalog-backend',
        '@backstage/plugin-auth-backend',
      ]);
    });
  });

  describe('getBackendFeatures', () => {
    it('returns empty features when packages config is not set', async () => {
      const result = await createService().getBackendFeatures();
      expect(result).toEqual({ features: [] });
    });

    it('returns empty features when packages config is empty object', async () => {
      const result = await createService({}).getBackendFeatures();
      expect(result).toEqual({ features: [] });
    });
  });
});
