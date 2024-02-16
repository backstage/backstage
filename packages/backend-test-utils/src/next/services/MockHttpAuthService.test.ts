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

import { Request } from 'express';
import { MockHttpAuthService } from './MockHttpAuthService';
import { mockCredentials } from './mockCredentials';

describe('MockHttpAuthService', () => {
  const httpAuth = new MockHttpAuthService('test');

  it('should authenticate requests', async () => {
    await expect(
      httpAuth.credentials({
        headers: {},
      } as Request),
    ).resolves.toEqual(mockCredentials.none());

    await expect(
      httpAuth.credentials({
        headers: {
          authorization: mockCredentials.user.header(),
        },
      } as Request),
    ).resolves.toEqual(mockCredentials.user());

    await expect(
      httpAuth.credentials({
        headers: {
          authorization: mockCredentials.user.header('user:default/other'),
        },
      } as Request),
    ).resolves.toEqual(mockCredentials.user('user:default/other'));

    await expect(
      httpAuth.credentials({
        headers: {
          authorization: mockCredentials.service.header(),
        },
      } as Request),
    ).resolves.toEqual(mockCredentials.service());

    await expect(
      httpAuth.credentials({
        headers: {
          authorization: mockCredentials.service.header({
            subject: 'plugin:other',
          }),
        },
      } as Request),
    ).resolves.toEqual(mockCredentials.service('plugin:other'));
  });

  it('should reject invalid credentials', async () => {
    await expect(
      httpAuth.credentials({
        headers: {
          authorization: 'Bearer bad',
        },
      } as Request),
    ).rejects.toThrow("Unknown mock token 'bad'");

    await expect(
      httpAuth.credentials({
        headers: {
          authorization: mockCredentials.user.invalidHeader(),
        },
      } as Request),
    ).rejects.toThrow('User token is invalid');

    await expect(
      httpAuth.credentials({
        headers: {
          authorization: mockCredentials.service.invalidHeader(),
        },
      } as Request),
    ).rejects.toThrow('Service token is invalid');
  });
});
