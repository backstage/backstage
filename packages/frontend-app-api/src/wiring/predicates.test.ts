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

import { ApiHolder, ApiRef } from '@backstage/frontend-plugin-api';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import {
  createPredicateContextLoader,
  localPermissionApiRef,
} from './predicates';

function makeApis(options: {
  authorizeByName?: jest.Mock;
  authorize?: jest.Mock;
  includeAuthorizeByName?: boolean;
}): {
  apis: ApiHolder;
  authorizeByName: jest.Mock;
  authorize: jest.Mock;
} {
  const authorizeByName =
    options.authorizeByName ??
    jest.fn().mockResolvedValue({ result: AuthorizeResult.ALLOW });
  const authorize =
    options.authorize ?? jest.fn().mockResolvedValue({ result: 'ALLOW' });
  const permissionApi: Record<string, unknown> = { authorize };
  if (options.includeAuthorizeByName !== false) {
    permissionApi.authorizeByName = authorizeByName;
  }
  const map = new Map<ApiRef<unknown>, unknown>([
    [localPermissionApiRef, permissionApi],
  ]);
  return {
    apis: { get: <T>(ref: ApiRef<T>) => map.get(ref) as T | undefined },
    authorizeByName,
    authorize,
  };
}

describe('createPredicateContextLoader', () => {
  it('calls authorizeByName for each referenced permission and reports allowed names', async () => {
    const authorizeByName = jest.fn(async ({ name }) => {
      if (name === 'catalog.entity.delete') {
        return { result: AuthorizeResult.DENY };
      }
      return { result: AuthorizeResult.ALLOW };
    });
    const { apis } = makeApis({ authorizeByName });

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

    expect(authorizeByName).toHaveBeenCalledTimes(3);
    expect(authorizeByName).toHaveBeenNthCalledWith(1, {
      name: 'catalog.entity.create',
    });
    expect(authorizeByName).toHaveBeenNthCalledWith(2, {
      name: 'catalog.entity.delete',
    });
    expect(authorizeByName).toHaveBeenNthCalledWith(3, {
      name: 'scaffolder.task.create',
    });
    expect(result.permissions).toEqual([
      'catalog.entity.create',
      'scaffolder.task.create',
    ]);
  });

  it('does not call the local permissionApi.authorize — authorizeByName is the only entrypoint', async () => {
    const { apis, authorize } = makeApis({});

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
    const authorizeByName = jest
      .fn()
      .mockRejectedValue(new Error('backend down'));
    const { apis } = makeApis({ authorizeByName });

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

  it('treats missing authorizeByName capability as deny-all without throwing', async () => {
    const { apis, authorizeByName } = makeApis({
      includeAuthorizeByName: false,
    });

    const result = await createPredicateContextLoader({
      apis,
      predicateReferences: { featureFlags: [], permissions: ['p'] },
    }).load();

    expect(authorizeByName).not.toHaveBeenCalled();
    expect(result.permissions).toEqual([]);
  });

  it('returns no allowed permissions when there are no referenced names (no backend round-trip)', async () => {
    const { apis, authorizeByName } = makeApis({});

    const result = await createPredicateContextLoader({
      apis,
      predicateReferences: { featureFlags: [], permissions: [] },
    }).load();

    expect(authorizeByName).not.toHaveBeenCalled();
    expect(result.permissions).toEqual([]);
  });
});
