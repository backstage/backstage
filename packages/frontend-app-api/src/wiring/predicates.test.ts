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
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import {
  createPredicateContextLoader,
  localPermissionApiRef,
} from './predicates';

function makeApis(options: { fetch?: jest.Mock; authorize?: jest.Mock }): {
  apis: ApiHolder;
  fetch: jest.Mock;
  authorize: jest.Mock;
} {
  const fetch =
    options.fetch ??
    jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ items: [] }),
    });
  const authorize =
    options.authorize ?? jest.fn().mockResolvedValue({ result: 'ALLOW' });
  const map = new Map<ApiRef<unknown>, unknown>([
    [localPermissionApiRef, { authorize }],
    [discoveryApiRef, { getBaseUrl: async () => 'http://x/api/permission' }],
    [fetchApiRef, { fetch }],
  ]);
  return {
    apis: { get: <T>(ref: ApiRef<T>) => map.get(ref) as T | undefined },
    fetch,
    authorize,
  };
}

describe('createPredicateContextLoader', () => {
  it('issues a single batched authorize-by-name request and reports allowed names', async () => {
    const fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [
          { id: '0', result: AuthorizeResult.ALLOW },
          { id: '1', result: AuthorizeResult.DENY },
          { id: '2', result: AuthorizeResult.ALLOW },
        ],
      }),
    });
    const { apis } = makeApis({ fetch });

    const result = await createPredicateContextLoader({
      apis,
      predicateReferences: {
        featureFlags: [],
        permissions: [
          'catalog.entity.create',
          'catalog.entity.delete',
          'scaffolder.task.create',
        ],
      },
    }).load();

    expect(fetch).toHaveBeenCalledTimes(1);
    const [url, init] = fetch.mock.calls[0];
    expect(url).toEqual('http://x/api/permission/authorize/by-name');
    expect(init).toMatchObject({
      method: 'POST',
      headers: { 'content-type': 'application/json' },
    });
    expect(JSON.parse(init.body)).toEqual({
      items: [
        { id: '0', name: 'catalog.entity.create' },
        { id: '1', name: 'catalog.entity.delete' },
        { id: '2', name: 'scaffolder.task.create' },
      ],
    });
    expect(result.permissions).toEqual([
      'catalog.entity.create',
      'scaffolder.task.create',
    ]);
  });

  it('does not call the local permissionApi.authorize — naming is the only input', async () => {
    const fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [{ id: '0', result: AuthorizeResult.ALLOW }],
      }),
    });
    const { apis, authorize } = makeApis({ fetch });

    await createPredicateContextLoader({
      apis,
      predicateReferences: {
        featureFlags: [],
        permissions: ['some.permission'],
      },
    }).load();

    expect(authorize).not.toHaveBeenCalled();
  });

  it('forwards backend errors as ForwardedError so the app surfaces them', async () => {
    const fetch = jest.fn().mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Server Error',
    });
    const { apis } = makeApis({ fetch });

    await expect(
      createPredicateContextLoader({
        apis,
        predicateReferences: {
          featureFlags: [],
          permissions: ['p'],
        },
      }).load(),
    ).rejects.toThrow('Failed to authorize extension permissions');
  });

  it('returns no allowed permissions when there are no referenced names (no backend round-trip)', async () => {
    const { apis, fetch } = makeApis({});

    const result = await createPredicateContextLoader({
      apis,
      predicateReferences: { featureFlags: [], permissions: [] },
    }).load();

    expect(fetch).not.toHaveBeenCalled();
    expect(result.permissions).toEqual([]);
  });
});
