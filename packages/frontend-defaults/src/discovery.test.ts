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
  discoverAvailableAndDeferredFeatures,
  discoverAvailableFeatures,
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

  it('should split eager and lazy entries, keeping include and exclude filtering', async () => {
    const eagerPlugin = createFrontendPlugin({ pluginId: 'eager' });
    const lazyPlugin = createFrontendPlugin({ pluginId: 'lazy' });
    const manifest = {
      manifestVersion: 1 as const,
      type: 'plugin' as const,
      pluginId: 'lazy',
      deferrable: true,
      routes: [],
      externalRoutes: [],
      extensions: [],
    };
    const load = jest.fn(async () => ({ default: lazyPlugin }));
    const notDeferrableLoad = jest.fn(async () => ({ default: lazyPlugin }));
    globalSpy.mockReturnValue({
      modules: [
        { name: 'eager-pkg', default: eagerPlugin },
        { name: 'lazy-pkg', manifest, load },
        {
          name: 'not-deferrable-pkg',
          manifest: { ...manifest, deferrable: false },
          load: notDeferrableLoad,
        },
        { name: 'excluded-pkg', manifest, load },
      ],
    });

    const result = discoverAvailableAndDeferredFeatures(
      new ConfigReader({
        app: { packages: { exclude: ['excluded-pkg'] } },
      }),
    );
    expect(result.features).toHaveLength(2);
    expect(result.features[0]).toBe(eagerPlugin);
    expect(result.features[1]).toMatchObject({
      $$type: '@backstage/FrontendFeatureLoader',
    });
    expect(result.deferred).toEqual([{ name: 'lazy-pkg', manifest, load }]);
    expect(load).not.toHaveBeenCalled();
    expect(notDeferrableLoad).not.toHaveBeenCalled();

    // The public discovery loads deferred plugins before the app starts
    const publicResult = discoverAvailableFeatures(
      new ConfigReader({ app: { packages: { include: ['lazy-pkg'] } } }),
    );
    expect(publicResult.features).toEqual([
      expect.objectContaining({ $$type: '@backstage/FrontendFeatureLoader' }),
    ]);
    expect(
      discoverAvailableAndDeferredFeatures(
        new ConfigReader({ app: { packages: { include: ['eager-pkg'] } } }),
      ),
    ).toEqual({ features: [eagerPlugin], deferred: [] });
  });
});
