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

import {
  ApiHolder,
  ApiRef,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/frontend-plugin-api';
import { createPermission } from '@backstage/plugin-permission-common';
import {
  createPredicateContextLoader,
  localPermissionApiRef,
} from './predicates';

function makeApis(options: { authorize?: jest.Mock; fetch?: jest.Mock }): {
  apis: ApiHolder;
  authorize: jest.Mock;
  fetch: jest.Mock;
} {
  const authorize =
    options.authorize ?? jest.fn().mockResolvedValue({ result: 'ALLOW' });
  const fetch =
    options.fetch ??
    jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ plugins: [] }),
    });
  const map = new Map<ApiRef<unknown>, unknown>([
    [localPermissionApiRef, { authorize }],
    [discoveryApiRef, { getBaseUrl: async () => 'http://x/api/permission' }],
    [fetchApiRef, { fetch }],
  ]);
  return {
    // Each call returns a fresh object so the WeakMap-based registry cache
    // doesn't leak between tests.
    apis: { get: <T>(ref: ApiRef<T>) => map.get(ref) as T | undefined },
    authorize,
    fetch,
  };
}

describe('createPredicateContextLoader', () => {
  beforeEach(() => {
    // Silence the resource-permission warning emitted by the predicate loader
    // during tests that exercise resource permissions.
    jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('authorizes referenced basic permissions using the full Permission shape from the registry', async () => {
    const fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        plugins: [
          {
            pluginId: 'catalog',
            permissions: [
              {
                type: 'basic',
                name: 'catalog.entity.create',
                attributes: { action: 'create' },
              },
              {
                type: 'basic',
                name: 'catalog.location.create',
                attributes: { action: 'create' },
              },
            ],
          },
        ],
      }),
    });
    const { apis, authorize } = makeApis({ fetch });

    const result = await createPredicateContextLoader({
      apis,
      predicateReferences: {
        featureFlags: [],
        permissions: ['catalog.entity.create', 'catalog.location.create'],
      },
    }).load();

    expect(fetch).toHaveBeenCalledWith(
      'http://x/api/permission/.well-known/backstage/permissions/installed',
    );
    expect(authorize).toHaveBeenNthCalledWith(1, {
      permission: {
        type: 'basic',
        name: 'catalog.entity.create',
        attributes: { action: 'create' },
      },
    });
    expect(authorize).toHaveBeenNthCalledWith(2, {
      permission: {
        type: 'basic',
        name: 'catalog.location.create',
        attributes: { action: 'create' },
      },
    });
    expect(result.permissions).toEqual([
      'catalog.entity.create',
      'catalog.location.create',
    ]);
  });

  it('falls back to a basic-permission shape and warns when the registry endpoint is unavailable', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const fetch = jest.fn().mockResolvedValue({ ok: false, status: 404 });
    const { apis, authorize } = makeApis({ fetch });

    await createPredicateContextLoader({
      apis,
      predicateReferences: {
        featureFlags: [],
        permissions: ['some.permission'],
      },
    }).load();

    expect(authorize).toHaveBeenCalledWith({
      permission: {
        type: 'basic',
        name: 'some.permission',
        attributes: {},
      },
    });
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('falling back to basic-permission requests'),
    );
    warnSpy.mockRestore();
  });

  it('skips authorize for resource permissions (no resourceRef context) and treats them as ALLOW with a warning', async () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        plugins: [
          {
            pluginId: 'catalog',
            permissions: [
              {
                type: 'resource',
                name: 'catalog.entity.read',
                attributes: { action: 'read' },
                resourceType: 'catalog-entity',
              },
              {
                type: 'basic',
                name: 'catalog.entity.create',
                attributes: { action: 'create' },
              },
            ],
          },
        ],
      }),
    });
    const { apis, authorize } = makeApis({ fetch });

    const result = await createPredicateContextLoader({
      apis,
      predicateReferences: {
        featureFlags: [],
        permissions: ['catalog.entity.read', 'catalog.entity.create'],
      },
    }).load();

    // Resource permission is never sent to the backend.
    expect(authorize).toHaveBeenCalledTimes(1);
    expect(authorize).toHaveBeenCalledWith({
      permission: {
        type: 'basic',
        name: 'catalog.entity.create',
        attributes: { action: 'create' },
      },
    });
    // Both names are reported as allowed: the resource one is treated as
    // ALLOW without a backend round-trip; the basic one is allowed by the
    // mocked authorize.
    expect(result.permissions).toEqual([
      'catalog.entity.read',
      'catalog.entity.create',
    ]);
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining(`'catalog.entity.read'`),
    );
    warnSpy.mockRestore();
  });

  it('reuses the cached registry across loaders sharing an ApiHolder', async () => {
    const { apis, fetch } = makeApis({});

    await createPredicateContextLoader({
      apis,
      predicateReferences: { featureFlags: [], permissions: ['a'] },
    }).load();
    await createPredicateContextLoader({
      apis,
      predicateReferences: { featureFlags: [], permissions: ['b'] },
    }).load();

    expect(fetch).toHaveBeenCalledTimes(1);
  });

  // This is the regression test for backstage/backstage#33912: previously the
  // `if` predicate built every authorize request as `{ name, type: 'basic',
  // attributes: {} }`, which caused attribute-based policies to deny actions
  // they should have allowed. With the registry, the predicate must pass the
  // exact Permission registered by the backend for basic permissions —
  // including their action attributes — so attribute-aware policies see the
  // same request the rest of the app would send. Resource permissions are
  // skipped at predicate time (they need a resourceRef) and treated as ALLOW.
  it('routes the correct basic Permission (with action attribute) to authorize and skips resource permissions', async () => {
    const catalogCreate = createPermission({
      name: 'catalog.entity.create',
      attributes: { action: 'create' },
    });
    const catalogRead = createPermission({
      name: 'catalog.entity.read',
      attributes: { action: 'read' },
      resourceType: 'catalog-entity',
    });
    const catalogDelete = createPermission({
      name: 'catalog.entity.delete',
      attributes: { action: 'delete' },
      resourceType: 'catalog-entity',
    });
    const scaffolderExecute = createPermission({
      name: 'scaffolder.task.create',
      attributes: { action: 'create' },
    });

    // The authorize mock branches on attributes the way a realistic policy
    // would, so the test fails loudly if the predicate strips attributes
    // before they reach the policy.
    const authorize = jest.fn(async (req: { permission: any }) => {
      const { name, attributes, type } = req.permission;
      if (
        name === 'catalog.entity.create' &&
        attributes?.action === 'create' &&
        type === 'basic'
      ) {
        return { result: 'ALLOW' };
      }
      if (
        name === 'scaffolder.task.create' &&
        attributes?.action === 'create' &&
        type === 'basic'
      ) {
        return { result: 'ALLOW' };
      }
      // Any miss — including the legacy "stripped attributes" shape — denies.
      return { result: 'DENY' };
    });
    const fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        plugins: [
          {
            pluginId: 'catalog',
            permissions: [catalogCreate, catalogRead, catalogDelete],
          },
          { pluginId: 'scaffolder', permissions: [scaffolderExecute] },
        ],
      }),
    });
    const { apis } = makeApis({ authorize, fetch });

    const result = await createPredicateContextLoader({
      apis,
      predicateReferences: {
        featureFlags: [],
        permissions: [
          'catalog.entity.create',
          'catalog.entity.read',
          'catalog.entity.delete',
          'scaffolder.task.create',
        ],
      },
    }).load();

    // Only basic permissions reach authorize — and they carry the correct
    // attributes, so the attribute-aware mock policy ALLOWs them.
    expect(authorize).toHaveBeenCalledTimes(2);
    expect(authorize).toHaveBeenCalledWith({ permission: catalogCreate });
    expect(authorize).toHaveBeenCalledWith({ permission: scaffolderExecute });

    // Resource permissions are treated as ALLOW without a backend round-trip;
    // basic permissions are filtered by the policy decision.
    expect(result.permissions).toEqual([
      'catalog.entity.create',
      'catalog.entity.read',
      'catalog.entity.delete',
      'scaffolder.task.create',
    ]);
  });
});
