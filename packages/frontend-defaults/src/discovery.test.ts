/*
 * Copyright 2023 The Backstage Authors
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

import {
  createFrontendFeatureLoader,
  createFrontendPlugin,
} from '@backstage/frontend-plugin-api';
import {
  discoverAvailableFeatures,
  filtersToMatchers,
  patternToRegex,
} from './discovery';
import { ConfigReader } from '@backstage/config';

const globalSpy = jest.fn();
Object.defineProperty(global, '__@backstage/discovered__', {
  get: globalSpy,
});

const config = new ConfigReader({
  app: { packages: 'all' },
});

describe('discoverAvailableFeatures', () => {
  afterEach(jest.resetAllMocks);

  it('should discover nothing with undefined global', () => {
    expect(discoverAvailableFeatures(config)).toEqual({ features: [] });
  });

  it('should discover nothing with empty global', () => {
    globalSpy.mockReturnValue({
      modules: [],
    });
    expect(discoverAvailableFeatures(config)).toEqual({ features: [] });
  });

  it('should discover a plugin', () => {
    const testPlugin = createFrontendPlugin({ pluginId: 'test' });
    globalSpy.mockReturnValue({
      modules: [{ default: testPlugin }],
    });
    expect(discoverAvailableFeatures(config)).toEqual({
      features: [testPlugin],
    });
  });

  it('should discover a frontend feature loader', () => {
    const testLoader = createFrontendFeatureLoader({
      loader() {
        return [];
      },
    });
    globalSpy.mockReturnValue({
      modules: [{ default: testLoader }],
    });
    expect(discoverAvailableFeatures(config)).toEqual({
      features: [testLoader],
    });
  });

  it('should ignore garbage', () => {
    globalSpy.mockReturnValueOnce({ modules: [{ default: null }] });
    expect(discoverAvailableFeatures(config)).toEqual({ features: [] });
    globalSpy.mockReturnValueOnce({ modules: [{ default: undefined }] });
    expect(discoverAvailableFeatures(config)).toEqual({ features: [] });
    globalSpy.mockReturnValueOnce({ modules: [{ default: Symbol() }] });
    expect(discoverAvailableFeatures(config)).toEqual({ features: [] });
    globalSpy.mockReturnValueOnce({ modules: [{ default: () => {} }] });
    expect(discoverAvailableFeatures(config)).toEqual({ features: [] });
    globalSpy.mockReturnValueOnce({ modules: [{ default: 0 }] });
    expect(discoverAvailableFeatures(config)).toEqual({ features: [] });
    globalSpy.mockReturnValueOnce({ modules: [{ default: false }] });
    expect(discoverAvailableFeatures(config)).toEqual({ features: [] });
    globalSpy.mockReturnValueOnce({ modules: [{ default: true }] });
    expect(discoverAvailableFeatures(config)).toEqual({ features: [] });
  });

  it('should discover multiple plugins', () => {
    const test1Plugin = createFrontendPlugin({ pluginId: 'test1' });
    const test2Plugin = createFrontendPlugin({ pluginId: 'test2' });
    const test3Plugin = createFrontendPlugin({ pluginId: 'test3' });
    globalSpy.mockReturnValue({
      modules: [
        { default: test1Plugin },
        { default: test2Plugin },
        { default: test3Plugin },
      ],
    });
    expect(discoverAvailableFeatures(config)).toEqual({
      features: [test1Plugin, test2Plugin, test3Plugin],
    });
  });

  it('should filter by exact include names', () => {
    const test1Plugin = createFrontendPlugin({ pluginId: 'test1' });
    const test2Plugin = createFrontendPlugin({ pluginId: 'test2' });
    globalSpy.mockReturnValue({
      modules: [
        { name: '@backstage/plugin-test1', default: test1Plugin },
        { name: '@backstage/plugin-test2', default: test2Plugin },
      ],
    });
    const c = new ConfigReader({
      app: { packages: { include: ['@backstage/plugin-test1'] } },
    });
    expect(discoverAvailableFeatures(c)).toEqual({ features: [test1Plugin] });
  });

  it('should filter by exact exclude names', () => {
    const test1Plugin = createFrontendPlugin({ pluginId: 'test1' });
    const test2Plugin = createFrontendPlugin({ pluginId: 'test2' });
    globalSpy.mockReturnValue({
      modules: [
        { name: '@backstage/plugin-test1', default: test1Plugin },
        { name: '@backstage/plugin-test2', default: test2Plugin },
      ],
    });
    const c = new ConfigReader({
      app: { packages: { exclude: ['@backstage/plugin-test1'] } },
    });
    expect(discoverAvailableFeatures(c)).toEqual({ features: [test2Plugin] });
  });

  it('should filter by wildcard include patterns', () => {
    const catalogPlugin = createFrontendPlugin({ pluginId: 'catalog' });
    const scaffolderPlugin = createFrontendPlugin({ pluginId: 'scaffolder' });
    globalSpy.mockReturnValue({
      modules: [
        { name: '@backstage/plugin-catalog', default: catalogPlugin },
        { name: '@backstage/plugin-scaffolder', default: scaffolderPlugin },
      ],
    });
    const c = new ConfigReader({
      app: { packages: { include: ['@backstage/plugin-catalog*'] } },
    });
    expect(discoverAvailableFeatures(c)).toEqual({
      features: [catalogPlugin],
    });
  });

  it('should filter by wildcard exclude patterns', () => {
    const catalogPlugin = createFrontendPlugin({ pluginId: 'catalog' });
    const scaffolderPlugin = createFrontendPlugin({ pluginId: 'scaffolder' });
    globalSpy.mockReturnValue({
      modules: [
        { name: '@backstage/plugin-catalog', default: catalogPlugin },
        { name: '@backstage/plugin-scaffolder', default: scaffolderPlugin },
      ],
    });
    const c = new ConfigReader({
      app: { packages: { exclude: ['@backstage/plugin-catalog*'] } },
    });
    expect(discoverAvailableFeatures(c)).toEqual({
      features: [scaffolderPlugin],
    });
  });

  it('should support include and exclude wildcards together', () => {
    const catalogPlugin = createFrontendPlugin({ pluginId: 'catalog' });
    const catalogModPlugin = createFrontendPlugin({
      pluginId: 'catalog-module-github',
    });
    const scaffolderPlugin = createFrontendPlugin({ pluginId: 'scaffolder' });
    globalSpy.mockReturnValue({
      modules: [
        { name: '@backstage/plugin-catalog', default: catalogPlugin },
        {
          name: '@backstage/plugin-catalog-module-github',
          default: catalogModPlugin,
        },
        { name: '@backstage/plugin-scaffolder', default: scaffolderPlugin },
      ],
    });
    const c = new ConfigReader({
      app: {
        packages: {
          include: ['@backstage/plugin-catalog*'],
          exclude: ['@backstage/plugin-catalog-module-github'],
        },
      },
    });
    expect(discoverAvailableFeatures(c)).toEqual({
      features: [catalogPlugin],
    });
  });
});

describe('patternToRegex', () => {
  it('matches an exact string with no wildcards', () => {
    const re = patternToRegex('@backstage/plugin-catalog');
    expect(re.test('@backstage/plugin-catalog')).toBe(true);
    expect(re.test('@backstage/plugin-catalog-extra')).toBe(false);
  });

  it('matches a trailing wildcard pattern', () => {
    const re = patternToRegex('@backstage/plugin-catalog*');
    expect(re.test('@backstage/plugin-catalog')).toBe(true);
    expect(re.test('@backstage/plugin-catalog-module-github')).toBe(true);
    expect(re.test('@backstage/plugin-scaffolder')).toBe(false);
  });

  it('matches a wildcard in the middle of a pattern', () => {
    const re = patternToRegex('@backstage/plugin-*-module-*');
    expect(re.test('@backstage/plugin-catalog-module-github')).toBe(true);
    expect(re.test('@backstage/plugin-scaffolder-module-github')).toBe(true);
    expect(re.test('@backstage/plugin-catalog')).toBe(false);
  });

  it('escapes regex special characters in the pattern', () => {
    const re = patternToRegex('@scope/pkg.name+extra');
    expect(re.test('@scope/pkg.name+extra')).toBe(true);
    expect(re.test('@scope/pkgXnameYextra')).toBe(false);
  });
});

describe('filtersToMatchers', () => {
  it('returns undefined when filters are undefined', () => {
    expect(filtersToMatchers(undefined)).toBeUndefined();
  });

  it('returns empty array when filters are an empty array', () => {
    expect(filtersToMatchers([])).toEqual([]);
  });

  it('returns exact-match matchers for non-wildcard filters', () => {
    const matchers = filtersToMatchers([
      '@backstage/plugin-a',
      '@backstage/plugin-b',
    ])!;
    expect(matchers).toHaveLength(2);
    expect(matchers[0]('@backstage/plugin-a')).toBe(true);
    expect(matchers[0]('@backstage/plugin-b')).toBe(false);
    expect(matchers[1]('@backstage/plugin-b')).toBe(true);
    expect(matchers[1]('@backstage/plugin-a')).toBe(false);
  });

  it('returns regex matchers for wildcard filters', () => {
    const matchers = filtersToMatchers(['@backstage/plugin-catalog*'])!;
    expect(matchers).toHaveLength(1);
    expect(matchers[0]('@backstage/plugin-catalog')).toBe(true);
    expect(matchers[0]('@backstage/plugin-catalog-module-github')).toBe(true);
    expect(matchers[0]('@backstage/plugin-scaffolder')).toBe(false);
  });

  it('deduplicates identical filters', () => {
    const matchers = filtersToMatchers([
      '@backstage/plugin-catalog',
      '@backstage/plugin-catalog',
      '@backstage/plugin-catalog*',
      '@backstage/plugin-catalog*',
    ])!;
    expect(matchers).toHaveLength(2);
  });
});
