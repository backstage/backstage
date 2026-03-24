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

import { ConfigReader } from '@backstage/config';
import { mockApis } from '@backstage/test-utils';
import {
  createPermission,
  PermissionClient,
} from '@backstage/plugin-permission-common';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { IdentityPermissionApi } from './IdentityPermissionApi';

describe('IdentityPermissionApi', () => {
  const permission = createPermission({
    name: 'test.permission',
    attributes: {},
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should batch requests that arrive on the same tick', async () => {
    const authorizeSpy = jest
      .spyOn(PermissionClient.prototype, 'authorize')
      .mockResolvedValue([
        { result: AuthorizeResult.ALLOW },
        { result: AuthorizeResult.DENY },
      ]);
    const api = IdentityPermissionApi.create({
      config: new ConfigReader({}),
      discovery: mockApis.discovery(),
      identity: mockApis.identity(),
    });

    const firstRequest = { permission };
    const secondRequest = { permission };
    const [firstResponse, secondResponse] = await Promise.all([
      api.authorize(firstRequest),
      api.authorize(secondRequest),
    ]);

    expect(firstResponse.result).toBe(AuthorizeResult.ALLOW);
    expect(secondResponse.result).toBe(AuthorizeResult.DENY);
    expect(authorizeSpy).toHaveBeenCalledTimes(1);
    expect(authorizeSpy).toHaveBeenCalledWith(
      [firstRequest, secondRequest],
      expect.anything(),
    );
  });

  it('should not cache requests across ticks', async () => {
    const authorizeSpy = jest
      .spyOn(PermissionClient.prototype, 'authorize')
      .mockResolvedValue([{ result: AuthorizeResult.ALLOW }]);
    const identityApi = mockApis.identity();
    const credentialsSpy = jest
      .spyOn(identityApi, 'getCredentials')
      .mockResolvedValueOnce({ token: 'first-token' })
      .mockResolvedValueOnce({ token: 'second-token' });
    const api = IdentityPermissionApi.create({
      config: new ConfigReader({}),
      discovery: mockApis.discovery(),
      identity: identityApi,
    });

    const request = { permission };
    await api.authorize(request);
    await api.authorize(request);

    expect(authorizeSpy).toHaveBeenCalledTimes(2);
    expect(credentialsSpy).toHaveBeenCalledTimes(2);
    expect(authorizeSpy).toHaveBeenNthCalledWith(
      1,
      [request],
      expect.objectContaining({ token: 'first-token' }),
    );
    expect(authorizeSpy).toHaveBeenNthCalledWith(
      2,
      [request],
      expect.objectContaining({ token: 'second-token' }),
    );
  });
});
