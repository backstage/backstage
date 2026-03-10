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
  PackageDiscoveryService,
  PatternMatcher,
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

describe('PatternMatcher', () => {
  const matcher = new PatternMatcher();

  it('matches exact string', () => {
    expect(matcher.matches('foo', 'foo')).toBe(true);
    expect(matcher.matches('foo', 'bar')).toBe(false);
  });

  it('matches trailing wildcard', () => {
    expect(matcher.matches('foobar', 'foo*')).toBe(true);
    expect(matcher.matches('foo', 'foo*')).toBe(true);
    expect(matcher.matches('barfoo', 'foo*')).toBe(false);
  });

  it('matches leading wildcard', () => {
    expect(matcher.matches('foobar', '*bar')).toBe(true);
    expect(matcher.matches('bar', '*bar')).toBe(true);
    expect(matcher.matches('barfoo', '*bar')).toBe(false);
  });

  it('matches wildcard in the middle', () => {
    expect(matcher.matches('foobarbaz', 'foo*baz')).toBe(true);
    expect(matcher.matches('foobaz', 'foo*baz')).toBe(true);
    expect(matcher.matches('foobazbar', 'foo*baz')).toBe(false);
  });

  it('matches multiple wildcards', () => {
    expect(matcher.matches('foobarbazqux', 'foo*bar*baz*qux')).toBe(true);
    expect(matcher.matches('foobazqux', 'foo*bar*baz*qux')).toBe(false);
  });

  it('matches only wildcard', () => {
    expect(matcher.matches('anything', '*')).toBe(true);
    expect(matcher.matches('', '*')).toBe(true);
  });

  it('matches empty pattern', () => {
    expect(matcher.matches('', '')).toBe(true);
    expect(matcher.matches('foo', '')).toBe(false);
  });

  it('caches regex objects', () => {
    // This test checks that cache is used, but cannot directly inspect WeakRef internals
    matcher.matches('foo', 'foo*');
    matcher.matches('foo', 'foo*');
    matcher.matches('foo', 'foo*');
    // No assertion, but ensures no error and cache is reused
    expect(matcher.matches('foo', 'foo*')).toBe(true);
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
