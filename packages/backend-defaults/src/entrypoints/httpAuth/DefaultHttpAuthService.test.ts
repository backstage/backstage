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
import { mockServices } from '@backstage/backend-test-utils';
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
});
