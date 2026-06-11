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

import { FilterPredicate } from '@backstage/filter-predicates';
import {
  collectPredicateReferences,
  createPredicateContextLoader,
  EMPTY_PREDICATE_CONTEXT,
} from './predicates';

describe('createPredicateContextLoader', () => {
  it('should return immediate context when there are no providers or permissions', () => {
    const loader = createPredicateContextLoader({
      apis: { get: () => undefined },
      predicateReferences: EMPTY_PREDICATE_CONTEXT,
    });

    const result = loader.getImmediate();
    expect(result).toEqual({ featureFlags: [], permissions: [] });
  });

  it('should return undefined from getImmediate when a referenced async provider exists', () => {
    const loader = createPredicateContextLoader({
      apis: { get: () => undefined },
      predicateReferences: EMPTY_PREDICATE_CONTEXT,
      referencedNamespaces: new Set(['test-plugin/features']),
      providerEntries: [
        {
          type: 'async',
          namespace: 'test-plugin/features',
          loader: async () => ['enabled'],
        },
      ],
    });

    expect(loader.getImmediate()).toBeUndefined();
  });

  it('should resolve sync providers in getImmediate', () => {
    const loader = createPredicateContextLoader({
      apis: { get: () => undefined },
      predicateReferences: EMPTY_PREDICATE_CONTEXT,
      referencedNamespaces: new Set(['my-plugin']),
      providerEntries: [
        {
          type: 'sync',
          namespace: 'my-plugin',
          resolver: () => ['value-a', 'value-b'],
        },
      ],
    });

    expect(loader.getImmediate()).toEqual({
      featureFlags: [],
      permissions: [],
      'my-plugin': ['value-a', 'value-b'],
    });
  });

  it('should allow immediate context when providers exist but none are referenced', () => {
    const loader = createPredicateContextLoader({
      apis: { get: () => undefined },
      predicateReferences: EMPTY_PREDICATE_CONTEXT,
      referencedNamespaces: new Set(),
      providerEntries: [
        {
          type: 'async',
          namespace: 'unreferenced-plugin',
          loader: async () => ['value'],
        },
      ],
    });

    expect(loader.getImmediate()).toEqual({
      featureFlags: [],
      permissions: [],
    });
  });

  it('should only invoke referenced provider loaders during load', async () => {
    const referencedLoader = jest.fn(async () => ['alpha', 'beta']);
    const unreferencedLoader = jest.fn(async () => ['gamma']);

    const loader = createPredicateContextLoader({
      apis: { get: () => undefined },
      predicateReferences: EMPTY_PREDICATE_CONTEXT,
      referencedNamespaces: new Set(['plugin-a/features']),
      providerEntries: [
        {
          type: 'async',
          namespace: 'plugin-a/features',
          loader: referencedLoader,
        },
        {
          type: 'async',
          namespace: 'plugin-b',
          loader: unreferencedLoader,
        },
      ],
    });

    const result = await loader.load();
    expect(result).toEqual({
      featureFlags: [],
      permissions: [],
      'plugin-a/features': ['alpha', 'beta'],
    });
    expect(referencedLoader).toHaveBeenCalled();
    expect(unreferencedLoader).not.toHaveBeenCalled();
  });

  it('should include both sync and async results in load', async () => {
    const loader = createPredicateContextLoader({
      apis: { get: () => undefined },
      predicateReferences: EMPTY_PREDICATE_CONTEXT,
      referencedNamespaces: new Set(['sync-plugin', 'async-plugin']),
      providerEntries: [
        {
          type: 'sync',
          namespace: 'sync-plugin',
          resolver: () => ['sync-value'],
        },
        {
          type: 'async',
          namespace: 'async-plugin',
          loader: async () => ['async-value'],
        },
      ],
    });

    const result = await loader.load();
    expect(result).toEqual({
      featureFlags: [],
      permissions: [],
      'sync-plugin': ['sync-value'],
      'async-plugin': ['async-value'],
    });
  });

  it('should isolate failed async provider loaders and log the error', async () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const testError = new Error('network failure');
    const loader = createPredicateContextLoader({
      apis: { get: () => undefined },
      predicateReferences: EMPTY_PREDICATE_CONTEXT,
      referencedNamespaces: new Set(['good-plugin', 'bad-plugin']),
      providerEntries: [
        {
          type: 'async',
          namespace: 'good-plugin',
          loader: async () => ['value'],
        },
        {
          type: 'async',
          namespace: 'bad-plugin',
          loader: async () => {
            throw testError;
          },
        },
      ],
    });

    const result = await loader.load();

    expect(result).toEqual({
      featureFlags: [],
      permissions: [],
      'good-plugin': ['value'],
    });
    expect(result).not.toHaveProperty('bad-plugin');
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to load extension predicate context provider:',
      testError,
    );

    consoleSpy.mockRestore();
  });

  it('should isolate failed sync provider resolvers and log the error', () => {
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const testError = new Error('resolver failure');
    const loader = createPredicateContextLoader({
      apis: { get: () => undefined },
      predicateReferences: EMPTY_PREDICATE_CONTEXT,
      referencedNamespaces: new Set(['good-plugin', 'bad-plugin']),
      providerEntries: [
        {
          type: 'sync',
          namespace: 'good-plugin',
          resolver: () => ['value'],
        },
        {
          type: 'sync',
          namespace: 'bad-plugin',
          resolver: () => {
            throw testError;
          },
        },
      ],
    });

    const result = loader.getImmediate();

    expect(result).toEqual({
      featureFlags: [],
      permissions: [],
      'good-plugin': ['value'],
    });
    expect(consoleSpy).toHaveBeenCalledWith(
      'Failed to resolve extension predicate context provider:',
      testError,
    );

    consoleSpy.mockRestore();
  });

  it('should behave identically to the original when no providers are given', async () => {
    const loader = createPredicateContextLoader({
      apis: { get: () => undefined },
      predicateReferences: { featureFlags: [], permissions: [] },
    });

    const immediate = loader.getImmediate();
    expect(immediate).toEqual({ featureFlags: [], permissions: [] });

    const loaded = await loader.load();
    expect(loaded).toEqual({ featureFlags: [], permissions: [] });
  });
});

describe('collectPredicateReferences', () => {
  it('should extract custom namespace references from predicates', () => {
    const nodes: Array<{ spec: { if?: FilterPredicate } }> = [
      { spec: { if: { featureFlags: { $contains: 'my-flag' } } } },
      { spec: { if: { 'my-plugin/features': { $contains: 'enabled' } } } },
      { spec: { if: undefined } },
    ];

    const { predicateReferences, referencedNamespaces } =
      collectPredicateReferences(nodes);

    expect(predicateReferences.featureFlags).toEqual(['my-flag']);
    expect(predicateReferences.permissions).toEqual([]);
    expect(referencedNamespaces).toEqual(new Set(['my-plugin/features']));
  });

  it('should extract namespaces from nested logical operators', () => {
    const nodes: Array<{ spec: { if?: FilterPredicate } }> = [
      {
        spec: {
          if: {
            $all: [
              { 'plugin-a': { $contains: 'x' } },
              { $any: [{ 'plugin-b/ctx': { $contains: 'y' } }] },
            ],
          },
        },
      },
    ];

    const { referencedNamespaces } = collectPredicateReferences(nodes);
    expect(referencedNamespaces).toEqual(new Set(['plugin-a', 'plugin-b/ctx']));
  });

  it('should not include well-known keys as custom namespaces', () => {
    const nodes: Array<{ spec: { if?: FilterPredicate } }> = [
      {
        spec: {
          if: {
            $all: [
              { featureFlags: { $contains: 'flag' } },
              { permissions: { $contains: 'perm' } },
              { 'custom-ns': { $contains: 'val' } },
            ],
          },
        },
      },
    ];

    const { referencedNamespaces } = collectPredicateReferences(nodes);
    expect(referencedNamespaces).toEqual(new Set(['custom-ns']));
  });
});
