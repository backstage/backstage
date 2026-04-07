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
import {
  filtersToMatchers,
  PackageDiscoveryService,
  patternToRegex,
} from './PackageDiscoveryService';
import { mockServices } from '@backstage/backend-test-utils';

const mockDependencies: Record<string, string> = {
  '@backstage/plugin-catalog-backend': '^1.0.0',
  '@backstage/plugin-catalog-backend-module-github': '^1.0.0',
  '@backstage/plugin-catalog-backend-module-gitlab': '^1.0.0',
  '@backstage/plugin-scaffolder-backend': '^1.0.0',
  '@backstage/plugin-scaffolder-backend-module-github': '^1.0.0',
  '@backstage/backend-plugin-api': '^1.0.0',
};

jest.mock(
  '/mock-package/package.json',
  () => ({ dependencies: mockDependencies }),
  { virtual: true },
);

describe('patternToRegex', () => {
  it('matches an exact string with no wildcards', () => {
    const re = patternToRegex('@backstage/plugin-catalog-backend');
    expect(re.test('@backstage/plugin-catalog-backend')).toBe(true);
    expect(re.test('@backstage/plugin-catalog-backend-extra')).toBe(false);
    expect(re.test('other')).toBe(false);
  });

  it('matches a trailing wildcard pattern', () => {
    const re = patternToRegex('@backstage/plugin-catalog-*');
    expect(re.test('@backstage/plugin-catalog-backend')).toBe(true);
    expect(re.test('@backstage/plugin-catalog-backend-module-github')).toBe(
      true,
    );
    expect(re.test('@backstage/plugin-scaffolder-backend')).toBe(false);
  });

  it('matches a wildcard in the middle of a pattern', () => {
    const re = patternToRegex('@backstage/plugin-*-backend-module-*');
    expect(re.test('@backstage/plugin-catalog-backend-module-github')).toBe(
      true,
    );
    expect(re.test('@backstage/plugin-scaffolder-backend-module-github')).toBe(
      true,
    );
    expect(re.test('@backstage/plugin-catalog-backend')).toBe(false);
  });

  it('escapes regex special characters in the pattern', () => {
    const re = patternToRegex('@scope/pkg.name+extra');
    expect(re.test('@scope/pkg.name+extra')).toBe(true);
    // dot and plus should be literal, not regex wildcards
    expect(re.test('@scope/pkgXnameYextra')).toBe(false);
  });
});

describe('filtersToMatchers', () => {
  it('returns undefined when filters are undefined', () => {
    expect(filtersToMatchers(undefined)).toBeUndefined();
  });

  it('returns undefined when filters are an empty array', () => {
    expect(filtersToMatchers([])).toBeUndefined();
  });

  it('returns exact-match matchers for non-wildcard filters', () => {
    const matchers = filtersToMatchers([
      '@backstage/plugin-catalog-backend',
      '@backstage/plugin-scaffolder-backend',
    ])!;
    expect(matchers).toHaveLength(2);
    expect(matchers[0]('@backstage/plugin-catalog-backend')).toBe(true);
    expect(matchers[0]('@backstage/plugin-scaffolder-backend')).toBe(false);
    expect(matchers[1]('@backstage/plugin-scaffolder-backend')).toBe(true);
    expect(matchers[1]('@backstage/plugin-catalog-backend')).toBe(false);
  });

  it('returns regex matchers for wildcard filters', () => {
    const matchers = filtersToMatchers(['@backstage/plugin-catalog-*'])!;
    expect(matchers).toHaveLength(1);
    expect(matchers[0]('@backstage/plugin-catalog-backend')).toBe(true);
    expect(matchers[0]('@backstage/plugin-catalog-backend-module-github')).toBe(
      true,
    );
    expect(matchers[0]('@backstage/plugin-scaffolder-backend')).toBe(false);
  });

  it('deduplicates identical filters', () => {
    const matchers = filtersToMatchers([
      '@backstage/plugin-catalog-backend',
      '@backstage/plugin-catalog-backend',
      '@backstage/plugin-catalog-*',
      '@backstage/plugin-catalog-*',
    ])!;
    expect(matchers).toHaveLength(2);
  });

  it('handles a mix of exact and wildcard filters', () => {
    const matchers = filtersToMatchers([
      '@backstage/plugin-catalog-backend',
      '@backstage/plugin-scaffolder-*',
    ])!;
    expect(matchers).toHaveLength(2);
    expect(matchers[0]('@backstage/plugin-catalog-backend')).toBe(true);
    expect(matchers[1]('@backstage/plugin-scaffolder-backend')).toBe(true);
    expect(
      matchers[1]('@backstage/plugin-scaffolder-backend-module-github'),
    ).toBe(true);
    expect(matchers[0]('@backstage/plugin-scaffolder-backend')).toBe(false);
  });
});

describe('PackageDiscoveryService', () => {
  const logger = mockServices.rootLogger.mock();

  describe('getDependencyNames', () => {
    it('returns all dependencies when config is "all"', () => {
      const config = new ConfigReader({
        backend: { packages: 'all' },
      });
      const service = new PackageDiscoveryService(config, logger);
      const result = service.getDependencyNames('/mock-package/package.json');
      expect(result).toEqual(Object.keys(mockDependencies));
    });

    it('filters by exact include names', () => {
      const config = new ConfigReader({
        backend: {
          packages: {
            include: ['@backstage/plugin-catalog-backend'],
          },
        },
      });
      const service = new PackageDiscoveryService(config, logger);
      const result = service.getDependencyNames('/mock-package/package.json');
      expect(result).toEqual(['@backstage/plugin-catalog-backend']);
    });

    it('filters by exact exclude names', () => {
      const config = new ConfigReader({
        backend: {
          packages: {
            exclude: ['@backstage/plugin-catalog-backend'],
          },
        },
      });
      const service = new PackageDiscoveryService(config, logger);
      const result = service.getDependencyNames('/mock-package/package.json');
      expect(result).toEqual(
        Object.keys(mockDependencies).filter(
          n => n !== '@backstage/plugin-catalog-backend',
        ),
      );
    });

    it('supports wildcard patterns in include list', () => {
      const config = new ConfigReader({
        backend: {
          packages: {
            include: ['@backstage/plugin-catalog-*'],
          },
        },
      });
      const service = new PackageDiscoveryService(config, logger);
      const result = service.getDependencyNames('/mock-package/package.json');
      expect(result).toEqual([
        '@backstage/plugin-catalog-backend',
        '@backstage/plugin-catalog-backend-module-github',
        '@backstage/plugin-catalog-backend-module-gitlab',
      ]);
    });

    it('supports wildcard patterns in exclude list', () => {
      const config = new ConfigReader({
        backend: {
          packages: {
            exclude: ['@backstage/plugin-*-backend-module-*'],
          },
        },
      });
      const service = new PackageDiscoveryService(config, logger);
      const result = service.getDependencyNames('/mock-package/package.json');
      expect(result).toEqual([
        '@backstage/plugin-catalog-backend',
        '@backstage/plugin-scaffolder-backend',
        '@backstage/backend-plugin-api',
      ]);
    });

    it('supports mixing exact names and wildcards', () => {
      const config = new ConfigReader({
        backend: {
          packages: {
            include: [
              '@backstage/plugin-catalog-backend',
              '@backstage/plugin-scaffolder-backend*',
            ],
          },
        },
      });
      const service = new PackageDiscoveryService(config, logger);
      const result = service.getDependencyNames('/mock-package/package.json');
      expect(result).toEqual([
        '@backstage/plugin-catalog-backend',
        '@backstage/plugin-scaffolder-backend',
        '@backstage/plugin-scaffolder-backend-module-github',
      ]);
    });

    it('supports include and exclude together with wildcards', () => {
      const config = new ConfigReader({
        backend: {
          packages: {
            include: ['@backstage/plugin-catalog-backend*'],
            exclude: ['@backstage/plugin-catalog-backend-module-gitlab'],
          },
        },
      });
      const service = new PackageDiscoveryService(config, logger);
      const result = service.getDependencyNames('/mock-package/package.json');
      expect(result).toEqual([
        '@backstage/plugin-catalog-backend',
        '@backstage/plugin-catalog-backend-module-github',
      ]);
    });

    it('include and exclude duplicates are handled gracefully', () => {
      const config = new ConfigReader({
        backend: {
          packages: {
            include: [
              '@backstage/plugin-catalog-backend*',
              '@backstage/plugin-scaffolder-backend',
              '@backstage/plugin-catalog-backend*',
              '@backstage/plugin-scaffolder-backend',
            ],
            exclude: [
              '@backstage/plugin-catalog-backend-module-gitlab',
              '@backstage/plugin-catalog-backend-module-gitlab',
            ],
          },
        },
      });
      const service = new PackageDiscoveryService(config, logger);
      const result = service.getDependencyNames('/mock-package/package.json');
      expect(result).toEqual([
        '@backstage/plugin-catalog-backend',
        '@backstage/plugin-catalog-backend-module-github',
        '@backstage/plugin-scaffolder-backend',
      ]);
    });

    it('returns all dependencies when no include/exclude is set', () => {
      const config = new ConfigReader({
        backend: {
          packages: {},
        },
      });
      const service = new PackageDiscoveryService(config, logger);
      const result = service.getDependencyNames('/mock-package/package.json');
      expect(result).toEqual(Object.keys(mockDependencies));
    });
  });
});
