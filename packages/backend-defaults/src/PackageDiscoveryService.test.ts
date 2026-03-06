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
import { mockServices, ServiceMock } from '@backstage/backend-test-utils';
import { RootLoggerService } from '@backstage/backend-plugin-api';
import {
  PackageDiscoveryService,
  isBackendPackageName,
} from './PackageDiscoveryService';

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

describe('PackageDiscoveryService', () => {
  let service: PackageDiscoveryService;
  let logger: ServiceMock<RootLoggerService>;
  const mockPathExists = jest.fn();

  function setupService(
    packagesConfig?: unknown,
    options?: { alwaysExcludedPackages?: string[] },
  ) {
    const config = new ConfigReader(
      packagesConfig !== undefined
        ? { backend: { packages: packagesConfig } }
        : {},
    );
    logger = mockServices.rootLogger.mock();
    service = new PackageDiscoveryService(
      config,
      logger,
      options,
      mockPathExists,
    );
  }

  beforeEach(() => {
    jest.clearAllMocks();
    mockPathExists.mockResolvedValue(false);
  });

  describe('getDependencyNames', () => {
    it('returns all dependencies when config is "all"', () => {
      setupService('all');

      const result = service.getDependencyNames('/mock/package.json');

      expect(result).toEqual([
        '@backstage/plugin-catalog-backend',
        '@backstage/plugin-auth-backend',
        '@backstage/plugin-scaffolder-backend',
        'some-other-package',
      ]);
    });

    it('returns only included packages', () => {
      setupService({
        include: [
          '@backstage/plugin-catalog-backend',
          '@backstage/plugin-auth-backend',
        ],
      });

      const result = service.getDependencyNames('/mock/package.json');

      expect(result).toEqual([
        '@backstage/plugin-catalog-backend',
        '@backstage/plugin-auth-backend',
      ]);
    });

    it('excludes specified packages', () => {
      setupService({
        exclude: ['some-other-package'],
      });

      const result = service.getDependencyNames('/mock/package.json');

      expect(result).toEqual([
        '@backstage/plugin-catalog-backend',
        '@backstage/plugin-auth-backend',
        '@backstage/plugin-scaffolder-backend',
      ]);
    });

    it('applies both include and exclude filters', () => {
      setupService({
        include: [
          '@backstage/plugin-catalog-backend',
          '@backstage/plugin-auth-backend',
          '@backstage/plugin-scaffolder-backend',
        ],
        exclude: ['@backstage/plugin-scaffolder-backend'],
      });

      const result = service.getDependencyNames('/mock/package.json');

      expect(result).toEqual([
        '@backstage/plugin-catalog-backend',
        '@backstage/plugin-auth-backend',
      ]);
    });

    it('warns when included packages do not match backend naming convention', () => {
      setupService({
        include: ['fake-plugin-backend', 'lodash', 'some-other-package'],
      });

      service.getDependencyNames('/mock/package.json');

      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('lodash'),
      );
      expect(logger.warn).toHaveBeenCalledWith(
        expect.stringContaining('some-other-package'),
      );
    });

    it('does not warn when all included packages match backend naming convention', () => {
      setupService({
        include: [
          '@backstage/plugin-catalog-backend',
          '@backstage/plugin-auth-backend',
        ],
      });

      service.getDependencyNames('/mock/package.json');

      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('does not warn when config is "all"', () => {
      setupService('all');

      service.getDependencyNames('/mock/package.json');

      expect(logger.warn).not.toHaveBeenCalled();
    });

    it('excludes packages from alwaysExcludedPackages option even if config is "all"', () => {
      setupService('all', {
        alwaysExcludedPackages: ['@backstage/plugin-catalog-backend'],
      });

      const result = service.getDependencyNames('/mock/package.json');

      expect(result).toEqual([
        '@backstage/plugin-auth-backend',
        '@backstage/plugin-scaffolder-backend',
        'some-other-package',
      ]);
    });

    it('excludes packages from alwaysExcludedPackages option even if explicitly included', () => {
      setupService(
        {
          include: [
            '@backstage/plugin-catalog-backend',
            '@backstage/plugin-auth-backend',
          ],
        },
        {
          alwaysExcludedPackages: ['@backstage/plugin-catalog-backend'],
        },
      );

      const result = service.getDependencyNames('/mock/package.json');

      expect(result).toEqual(['@backstage/plugin-auth-backend']);
    });
  });

  describe('getBackendFeatures', () => {
    it('returns empty features when packages config is not set', async () => {
      setupService();

      const result = await service.getBackendFeatures();

      expect(result).toEqual({ features: [] });
    });

    it('returns empty features when packages config is empty object', async () => {
      setupService({});

      const result = await service.getBackendFeatures();

      expect(result).toEqual({ features: [] });
    });
  });
});

describe('isBackendPackageName', () => {
  it('matches packages ending with -backend', () => {
    expect(isBackendPackageName('@backstage/plugin-catalog-backend')).toBe(
      true,
    );
    expect(
      isBackendPackageName('@spotify/backstage-plugin-insights-backend'),
    ).toBe(true);
    expect(isBackendPackageName('my-custom-backend')).toBe(true);
  });

  it('matches packages containing -backend-module-', () => {
    expect(
      isBackendPackageName('@backstage/plugin-catalog-backend-module-github'),
    ).toBe(true);
    expect(isBackendPackageName('my-backend-module-custom')).toBe(true);
  });

  it('does not match frontend or other packages', () => {
    expect(isBackendPackageName('@backstage/plugin-catalog')).toBe(false);
    expect(isBackendPackageName('@backstage/core-components')).toBe(false);
    expect(isBackendPackageName('lodash')).toBe(false);
    expect(isBackendPackageName('@opentelemetry/sdk-trace-base')).toBe(false);
  });

  it('does not match packages with backend elsewhere in name', () => {
    expect(isBackendPackageName('backend-utils')).toBe(false);
    expect(isBackendPackageName('@internal/backend-common')).toBe(false);
  });
});
