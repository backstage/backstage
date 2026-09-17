/*
 * Copyright 2024 The Backstage Authors
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

import { DefaultHttpAuthService } from './httpAuthServiceFactory';
import { mockCredentials, mockServices } from '@backstage/backend-test-utils';
import { createRequest } from 'node-mocks-http';

describe('DefaultHttpAuthService', () => {
  it('should extract token from custom header', async () => {
    const auth = mockServices.auth.mock();
    const httpAuthService = DefaultHttpAuthService.create({
      discovery: mockServices.discovery(),
      auth,
      pluginId: 'test',
      getTokenFromRequest: req => {
        let token: string | undefined;
        const header = req.headers.test;
        if (typeof header === 'string') {
          token = header;
        }
        return { token };
      },
    });
    await httpAuthService.credentials(
      createRequest({ headers: { test: 'mock-user-token' } }),
    );
    expect(auth.authenticate).toHaveBeenCalledWith('mock-user-token');
  });

  it('keeps credentials scoped to each service instance', async () => {
    const request = createRequest({
      headers: {
        authorization: mockCredentials.service.header({
          onBehalfOf: mockCredentials.service('external:test'),
          targetPluginId: 'Catalog',
        }),
      },
    });
    const firstService = DefaultHttpAuthService.create({
      discovery: mockServices.discovery(),
      auth: mockServices.auth({ pluginId: 'Catalog' }),
      pluginId: 'Catalog',
    });
    const secondAuth = mockServices.auth({ pluginId: 'catalog' });
    const secondAuthenticate = jest.spyOn(secondAuth, 'authenticate');
    const secondService = DefaultHttpAuthService.create({
      discovery: mockServices.discovery(),
      auth: secondAuth,
      pluginId: 'catalog',
    });

    await expect(firstService.credentials(request)).resolves.toEqual(
      mockCredentials.service('external:test'),
    );
    await expect(secondService.credentials(request)).rejects.toThrow();
    expect(secondAuthenticate).toHaveBeenCalledTimes(1);
  });
});
