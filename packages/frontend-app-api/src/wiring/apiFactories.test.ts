/*
 * Copyright 2025 The Backstage Authors
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
  createFrontendPlugin,
  createFrontendModule,
  featureFlagsApiRef,
  createApiRef,
  type FeatureFlagsApi,
} from '@backstage/frontend-plugin-api';
import {
  registerFeatureFlagDeclarationsInHolder,
  wrapFeatureFlagApiFactory,
} from './apiFactories';
import { createErrorCollector } from './createErrorCollector';

function createValidatingMockFeatureFlagsApi(): FeatureFlagsApi & {
  flags: Array<{ name: string; pluginId: string }>;
} {
  const flagNameRegex = /^[a-z]+[a-z0-9-]+$/;
  const flags = new Array<{ name: string; pluginId: string }>();
  return {
    flags,
    registerFlag(flag) {
      if (!flagNameRegex.test(flag.name)) {
        throw new Error(
          `The '${flag.name}' feature flag must start with a lowercase letter and only contain lowercase letters, numbers and hyphens.`,
        );
      }
      flags.push(flag);
    },
    getRegisteredFlags() {
      return flags;
    },
    isActive() {
      return false;
    },
    save() {},
  };
}

describe('registerFeatureFlagDeclarationsInHolder', () => {
  it('should isolate invalid flags and still register valid ones from a plugin', () => {
    const featureFlagsApi = createValidatingMockFeatureFlagsApi();
    const collector = createErrorCollector();

    const plugin = createFrontendPlugin({
      pluginId: 'test',
      featureFlags: [
        { name: 'valid-flag' },
        { name: 'bad/flag' },
        { name: 'another-valid' },
      ],
      extensions: [],
    });

    registerFeatureFlagDeclarationsInHolder(
      {
        get: ref =>
          (ref.id === featureFlagsApiRef.id
            ? featureFlagsApi
            : undefined) as any,
      },
      [plugin],
      collector,
    );

    expect(featureFlagsApi.flags).toEqual([
      expect.objectContaining({ name: 'valid-flag', pluginId: 'test' }),
      expect.objectContaining({ name: 'another-valid', pluginId: 'test' }),
    ]);

    const errors = collector.collectErrors()!;
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      code: 'FEATURE_FLAG_INVALID',
      context: { pluginId: 'test', flagName: 'bad/flag' },
    });
    expect(errors[0].message).toContain("Plugin 'test'");
    expect(errors[0].message).toContain("'bad/flag'");
  });

  it('should report each invalid flag independently across multiple plugins', () => {
    const featureFlagsApi = createValidatingMockFeatureFlagsApi();
    const collector = createErrorCollector();

    const pluginA = createFrontendPlugin({
      pluginId: 'alpha',
      featureFlags: [{ name: 'ok-flag' }, { name: 'UPPER' }],
      extensions: [],
    });
    const pluginB = createFrontendPlugin({
      pluginId: 'beta',
      featureFlags: [{ name: 'x/y' }, { name: 'good-one' }],
      extensions: [],
    });

    registerFeatureFlagDeclarationsInHolder(
      {
        get: ref =>
          (ref.id === featureFlagsApiRef.id
            ? featureFlagsApi
            : undefined) as any,
      },
      [pluginA, pluginB],
      collector,
    );

    expect(featureFlagsApi.flags).toEqual([
      expect.objectContaining({ name: 'ok-flag', pluginId: 'alpha' }),
      expect.objectContaining({ name: 'good-one', pluginId: 'beta' }),
    ]);

    const errors = collector.collectErrors()!;
    expect(errors).toHaveLength(2);
    expect(errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          code: 'FEATURE_FLAG_INVALID',
          context: expect.objectContaining({
            pluginId: 'alpha',
            flagName: 'UPPER',
          }),
        }),
        expect.objectContaining({
          code: 'FEATURE_FLAG_INVALID',
          context: expect.objectContaining({
            pluginId: 'beta',
            flagName: 'x/y',
          }),
        }),
      ]),
    );
  });

  it('should isolate invalid flags declared by a frontend module', () => {
    const featureFlagsApi = createValidatingMockFeatureFlagsApi();
    const collector = createErrorCollector();

    const mod = createFrontendModule({
      pluginId: 'my-plugin',
      featureFlags: [{ name: 'mod-valid' }, { name: 'mod/invalid' }],
      extensions: [],
    });

    registerFeatureFlagDeclarationsInHolder(
      {
        get: ref =>
          (ref.id === featureFlagsApiRef.id
            ? featureFlagsApi
            : undefined) as any,
      },
      [mod],
      collector,
    );

    expect(featureFlagsApi.flags).toEqual([
      expect.objectContaining({ name: 'mod-valid', pluginId: 'my-plugin' }),
    ]);

    const errors = collector.collectErrors()!;
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      code: 'FEATURE_FLAG_INVALID',
      context: { pluginId: 'my-plugin', flagName: 'mod/invalid' },
    });
    expect(errors[0].message).toContain("Module for plugin 'my-plugin'");
    expect(errors[0].message).toContain("'mod/invalid'");
  });

  it('should isolate non-validation errors thrown by registerFlag', () => {
    const featureFlagsApi: FeatureFlagsApi = {
      registerFlag() {
        throw new Error('database connection lost');
      },
      getRegisteredFlags: () => [],
      isActive: () => false,
      save() {},
    };
    const collector = createErrorCollector();

    const plugin = createFrontendPlugin({
      pluginId: 'broken',
      featureFlags: [{ name: 'any-flag' }],
      extensions: [],
    });

    registerFeatureFlagDeclarationsInHolder(
      {
        get: ref =>
          (ref.id === featureFlagsApiRef.id
            ? featureFlagsApi
            : undefined) as any,
      },
      [plugin],
      collector,
    );

    const errors = collector.collectErrors()!;
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      code: 'FEATURE_FLAG_INVALID',
      context: expect.objectContaining({
        pluginId: 'broken',
        flagName: 'any-flag',
      }),
    });
    expect(errors[0].message).toContain('database connection lost');
  });
});

describe('wrapFeatureFlagApiFactory', () => {
  it('should not wrap factories for non-feature-flag APIs', () => {
    const otherApiRef = createApiRef<{}>({ id: 'test.other' });
    const factory = {
      api: otherApiRef,
      deps: {},
      factory: () => ({}),
    };
    const collector = createErrorCollector();

    const result = wrapFeatureFlagApiFactory(factory, [], collector);
    expect(result).toBe(factory);
  });

  it('should wrap the feature flags factory and isolate invalid flags', () => {
    const featureFlagsApi = createValidatingMockFeatureFlagsApi();
    const collector = createErrorCollector();

    const plugin = createFrontendPlugin({
      pluginId: 'test',
      featureFlags: [{ name: 'good-flag' }, { name: 'bad/flag' }],
      extensions: [],
    });

    const factory = {
      api: featureFlagsApiRef,
      deps: {},
      factory: () => featureFlagsApi,
    };

    const wrapped = wrapFeatureFlagApiFactory(factory, [plugin], collector);
    expect(wrapped).not.toBe(factory);

    const result = wrapped.factory({});
    expect(result).toBe(featureFlagsApi);
    expect(featureFlagsApi.flags).toEqual([
      expect.objectContaining({ name: 'good-flag', pluginId: 'test' }),
    ]);

    const errors = collector.collectErrors()!;
    expect(errors).toHaveLength(1);
    expect(errors[0]).toMatchObject({
      code: 'FEATURE_FLAG_INVALID',
      context: { pluginId: 'test', flagName: 'bad/flag' },
    });
  });

  it('should not throw from the wrapped factory when flags are invalid', () => {
    const featureFlagsApi = createValidatingMockFeatureFlagsApi();
    const collector = createErrorCollector();

    const plugin = createFrontendPlugin({
      pluginId: 'crashy',
      featureFlags: [{ name: 'inspt/show-test-banner' }],
      extensions: [],
    });

    const factory = {
      api: featureFlagsApiRef,
      deps: {},
      factory: () => featureFlagsApi,
    };

    const wrapped = wrapFeatureFlagApiFactory(factory, [plugin], collector);

    expect(() => wrapped.factory({})).not.toThrow();
    expect(featureFlagsApi.flags).toEqual([]);

    const errors = collector.collectErrors()!;
    expect(errors).toHaveLength(1);
    expect(errors[0].code).toBe('FEATURE_FLAG_INVALID');
  });
});
