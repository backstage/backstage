/*
 * Copyright 2021 The Backstage Authors
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

import { NotAllowedError } from '@backstage/errors';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { ServerPermissionClient } from '@backstage/plugin-permission-node';
import { AuthorizedRefreshService } from './AuthorizedRefreshService';

describe('AuthorizedRefreshService', () => {
  const refreshService = {
    refresh: jest.fn(),
  };
  const permissionApi = {
    authorize: jest.fn(),
    query: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('throws AuthorizationError on deny', async () => {
    permissionApi.authorize.mockResolvedValueOnce([
      {
        result: AuthorizeResult.DENY,
      },
    ]);
    const authorizedService = new AuthorizedRefreshService(
      refreshService,
      permissionApi as unknown as ServerPermissionClient,
    );

    await expect(() =>
      authorizedService.refresh({
        entityRef: 'some entity ref',
        authorizationToken: 'some auth token',
      }),
    ).rejects.toThrow(NotAllowedError);
  });

  it('calls refresh on allow', async () => {
    permissionApi.authorize.mockResolvedValueOnce([
      {
        result: AuthorizeResult.ALLOW,
      },
    ]);
    const authorizedService = new AuthorizedRefreshService(
      refreshService,
      permissionApi as unknown as ServerPermissionClient,
    );

    const options = {
      entityRef: 'some entity ref',
      authorizationToken: 'some auth token',
    };
    await authorizedService.refresh(options);

    expect(refreshService.refresh).toHaveBeenCalledWith(options);
  });
});
