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
  featureFlagsApiRef,
  type FeatureFlagsApi,
} from '@backstage/frontend-plugin-api';
import type {
  EvaluatePermissionRequest,
  EvaluatePermissionResponse,
} from '@backstage/plugin-permission-common';
import {
  collectPredicateReferences,
  createPredicateContextLoader,
  localPermissionApiRef,
} from './predicates';

function makeFeatureFlagsApi(activeFlags: string[] = []): FeatureFlagsApi {
  return {
    registerFlag: jest.fn(),
    getRegisteredFlags: () => [],
    isActive: (name: string) => activeFlags.includes(name),
    save: jest.fn(),
  };
}

type MinimalPermissionApi = {
  authorize(
    request: EvaluatePermissionRequest,
  ): Promise<EvaluatePermissionResponse>;
};

function makePermissionApi(
  handler: (
    req: EvaluatePermissionRequest,
  ) => Promise<EvaluatePermissionResponse>,
): MinimalPermissionApi {
  return { authorize: handler };
}

function makeAllowPermissionApi(allowedNames: string[]): MinimalPermissionApi {
  return makePermissionApi(async req => ({
    result: allowedNames.includes(req.permission.name) ? 'ALLOW' : 'DENY',
  }));
}

function makeApiHolder(
  featureFlagsApi?: FeatureFlagsApi,
  permissionApi?: MinimalPermissionApi,
) {
  return {
    get(ref: { id: string }) {
      if (ref.id === featureFlagsApiRef.id) return featureFlagsApi as any;
      if (ref.id === localPermissionApiRef.id) return permissionApi as any;
      return undefined;
    },
  };
}

describe('collectPredicateReferences', () => {
  it('returns empty arrays when no nodes have predicates', () => {
    const result = collectPredicateReferences([
      { spec: {} },
      { spec: { if: undefined } },
    ]);
    expect(result).toEqual({ featureFlags: [], permissions: [] });
  });

  it('collects feature flag names from $contains expressions', () => {
    const result = collectPredicateReferences([
      { spec: { if: { featureFlags: { $contains: 'my-flag' } } } },
    ]);
    expect(result.featureFlags).toEqual(['my-flag']);
    expect(result.permissions).toEqual([]);
  });

  it('collects permission names from $contains expressions', () => {
    const result = collectPredicateReferences([
      { spec: { if: { permissions: { $contains: 'catalog.entity.read' } } } },
    ]);
    expect(result.permissions).toEqual(['catalog.entity.read']);
    expect(result.featureFlags).toEqual([]);
  });

  it('collects permission names with #action suffix', () => {
    const result = collectPredicateReferences([
      {
        spec: {
          if: { permissions: { $contains: 'catalog.entity.read#read' } },
        },
      },
    ]);
    expect(result.permissions).toEqual(['catalog.entity.read#read']);
  });

  it('deduplicates names across multiple nodes', () => {
    const result = collectPredicateReferences([
      { spec: { if: { featureFlags: { $contains: 'flag-a' } } } },
      { spec: { if: { featureFlags: { $contains: 'flag-a' } } } },
      { spec: { if: { featureFlags: { $contains: 'flag-b' } } } },
    ]);
    expect(result.featureFlags).toEqual(['flag-a', 'flag-b']);
  });

  it('collects names from $all predicate', () => {
    const result = collectPredicateReferences([
      {
        spec: {
          if: {
            $all: [
              { featureFlags: { $contains: 'flag-a' } },
              { permissions: { $contains: 'my.permission' } },
            ],
          },
        },
      },
    ]);
    expect(result.featureFlags).toEqual(['flag-a']);
    expect(result.permissions).toEqual(['my.permission']);
  });

  it('collects names from $any predicate', () => {
    const result = collectPredicateReferences([
      {
        spec: {
          if: {
            $any: [
              { featureFlags: { $contains: 'flag-x' } },
              { featureFlags: { $contains: 'flag-y' } },
            ],
          },
        },
      },
    ]);
    expect(result.featureFlags).toEqual(['flag-x', 'flag-y']);
  });

  it('collects names from $not predicate', () => {
    const result = collectPredicateReferences([
      {
        spec: {
          if: {
            $not: { permissions: { $contains: 'admin.access' } },
          },
        },
      },
    ]);
    expect(result.permissions).toEqual(['admin.access']);
  });

  it('collects names from deeply nested predicates', () => {
    const result = collectPredicateReferences([
      {
        spec: {
          if: {
            $all: [
              { featureFlags: { $contains: 'outer-flag' } },
              {
                $any: [
                  { $not: { permissions: { $contains: 'deep.permission' } } },
                  { featureFlags: { $contains: 'inner-flag' } },
                ],
              },
            ],
          },
        },
      },
    ]);
    expect(result.featureFlags).toEqual(['outer-flag', 'inner-flag']);
    expect(result.permissions).toEqual(['deep.permission']);
  });
});

describe('createPredicateContextLoader', () => {
  describe('getImmediate', () => {
    it('returns context synchronously when there are no permission references', () => {
      const loader = createPredicateContextLoader({
        apis: makeApiHolder(makeFeatureFlagsApi(['active-flag'])),
        predicateReferences: {
          featureFlags: ['active-flag', 'inactive-flag'],
          permissions: [],
        },
      });

      expect(loader.getImmediate()).toEqual({
        featureFlags: ['active-flag'],
        permissions: [],
      });
    });

    it('returns context synchronously when permissions are referenced but the permission API is absent', () => {
      const loader = createPredicateContextLoader({
        apis: makeApiHolder(makeFeatureFlagsApi()),
        predicateReferences: {
          featureFlags: [],
          permissions: ['some.permission'],
        },
      });

      expect(loader.getImmediate()).toEqual({
        featureFlags: [],
        permissions: [],
      });
    });

    it('returns undefined when the permission API is present and permissions are referenced', () => {
      const loader = createPredicateContextLoader({
        apis: makeApiHolder(makeFeatureFlagsApi(), makeAllowPermissionApi([])),
        predicateReferences: {
          featureFlags: [],
          permissions: ['some.permission'],
        },
      });

      expect(loader.getImmediate()).toBeUndefined();
    });

    it('returns context synchronously when no feature flags API is available', () => {
      const loader = createPredicateContextLoader({
        apis: makeApiHolder(undefined, undefined),
        predicateReferences: { featureFlags: ['flag'], permissions: [] },
      });

      expect(loader.getImmediate()).toEqual({
        featureFlags: [],
        permissions: [],
      });
    });
  });

  describe('load', () => {
    it('returns only active feature flags when there are no permissions', async () => {
      const loader = createPredicateContextLoader({
        apis: makeApiHolder(makeFeatureFlagsApi(['enabled'])),
        predicateReferences: {
          featureFlags: ['enabled', 'disabled'],
          permissions: [],
        },
      });

      await expect(loader.load()).resolves.toEqual({
        featureFlags: ['enabled'],
        permissions: [],
      });
    });

    it('returns allowed permissions', async () => {
      const loader = createPredicateContextLoader({
        apis: makeApiHolder(
          makeFeatureFlagsApi(),
          makeAllowPermissionApi(['catalog.entity.read']),
        ),
        predicateReferences: {
          featureFlags: [],
          permissions: ['catalog.entity.read', 'catalog.entity.delete'],
        },
      });

      const result = await loader.load();
      expect(result.permissions).toEqual(['catalog.entity.read']);
    });

    it('passes permission name and action attributes for permission#action names', async () => {
      const authorizeRequests: EvaluatePermissionRequest[] = [];
      const permissionApi = makePermissionApi(async req => {
        authorizeRequests.push(req);
        return { result: 'ALLOW' };
      });

      const loader = createPredicateContextLoader({
        apis: makeApiHolder(makeFeatureFlagsApi(), permissionApi),
        predicateReferences: {
          featureFlags: [],
          permissions: ['catalog.entity.read#read'],
        },
      });

      await loader.load();

      expect(authorizeRequests).toHaveLength(1);
      expect(authorizeRequests[0].permission).toEqual({
        name: 'catalog.entity.read',
        type: 'basic',
        attributes: { action: 'read' },
      });
    });

    it('passes empty attributes for plain permission names without action', async () => {
      const authorizeRequests: EvaluatePermissionRequest[] = [];
      const permissionApi = makePermissionApi(async req => {
        authorizeRequests.push(req);
        return { result: 'ALLOW' };
      });

      const loader = createPredicateContextLoader({
        apis: makeApiHolder(makeFeatureFlagsApi(), permissionApi),
        predicateReferences: {
          featureFlags: [],
          permissions: ['catalog.entity.read'],
        },
      });

      await loader.load();

      expect(authorizeRequests[0].permission).toEqual({
        name: 'catalog.entity.read',
        type: 'basic',
        attributes: {},
      });
    });

    it('returns the permission#action name in the allowed set (not the split name)', async () => {
      const loader = createPredicateContextLoader({
        apis: makeApiHolder(
          makeFeatureFlagsApi(),
          makeAllowPermissionApi(['catalog.entity.read']),
        ),
        predicateReferences: {
          featureFlags: [],
          permissions: ['catalog.entity.read#read'],
        },
      });

      const result = await loader.load();
      expect(result.permissions).toEqual(['catalog.entity.read#read']);
    });

    it('throws a ForwardedError when the permission API rejects', async () => {
      const permissionApi = makePermissionApi(async () => {
        throw new Error('connection refused');
      });

      const loader = createPredicateContextLoader({
        apis: makeApiHolder(makeFeatureFlagsApi(), permissionApi),
        predicateReferences: {
          featureFlags: [],
          permissions: ['any.permission'],
        },
      });

      await expect(loader.load()).rejects.toThrow(
        'Failed to authorize extension permissions',
      );
    });

    it('throws on invalid permission names with more than one # separator', async () => {
      const loader = createPredicateContextLoader({
        apis: makeApiHolder(makeFeatureFlagsApi(), makeAllowPermissionApi([])),
        predicateReferences: {
          featureFlags: [],
          permissions: ['catalog.entity.read#read#extra'],
        },
      });

      await expect(loader.load()).rejects.toThrow(
        'Invalid permission name: catalog.entity.read#read#extra',
      );
    });

    it('returns empty permissions when no permission API is registered', async () => {
      const loader = createPredicateContextLoader({
        apis: makeApiHolder(makeFeatureFlagsApi(['active'])),
        predicateReferences: {
          featureFlags: ['active'],
          permissions: ['some.permission'],
        },
      });

      await expect(loader.load()).resolves.toEqual({
        featureFlags: ['active'],
        permissions: [],
      });
    });
  });
});
