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

import { BackstageUserIdentity, ProfileInfo } from '@backstage/core-plugin-api';
import { GuestUserIdentity } from './GuestUserIdentity';
import { Config, ConfigReader } from '@backstage/config';
import nJwt from 'njwt';
import { GUEST_USER_PRIVATE_KEY } from '@backstage/plugin-auth-common';

describe('GuestUserIdentity', () => {
  let config: Config;
  const mockIdentity: BackstageUserIdentity = {
    type: 'user',
    userEntityRef: 'user:default/guest',
    ownershipEntityRefs: ['user:default/guest'],
  };
  const mockProfileInfo: ProfileInfo = {
    displayName: 'Guest',
    email: 'guest@example.com',
  };

  beforeAll(() => {
    config = new ConfigReader({
      auth: {
        allowGuestMode: true,
      },
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('getUserId() returns guest user Id', () => {
    const guestUserIdentity = new GuestUserIdentity();

    const response = guestUserIdentity.getUserId();

    expect(response).toEqual('guest');
  });

  it('getIdToken() returns undefined when guestUserIdentity is not passed a config value', async () => {
    const guestUserIdentity = new GuestUserIdentity();

    const response = await guestUserIdentity.getIdToken();

    expect(response).toEqual(undefined);
  });

  it('getIdToken() returns a token when guestUserIdentity is passed a config value', async () => {
    const guestUserIdentity = GuestUserIdentity.fromConfig(config);
    // covers edgecase where response is undefined and would be compared to an undefined verifiedtoken
    const response = (await guestUserIdentity.getIdToken()) ?? 'no token';

    const verifiedToken = nJwt.verify(
      response,
      GUEST_USER_PRIVATE_KEY,
      'ES256',
    );

    expect(response).toEqual(verifiedToken?.toString());
  });

  it('getProfile() returns guestProfile info', () => {
    const guestUserIdentity = new GuestUserIdentity();

    const response = guestUserIdentity.getProfile();

    expect(response).toEqual(mockProfileInfo);
  });

  it('getProfileInfo() returns guest user info', async () => {
    const guestUserIdentity = new GuestUserIdentity();

    const response = await guestUserIdentity.getProfileInfo();

    expect(response).toEqual(mockProfileInfo);
  });

  it('getBackstageIdentity() returns guest user identity', async () => {
    const guestUserIdentity = new GuestUserIdentity();

    const response = await guestUserIdentity.getBackstageIdentity();

    expect(response).toEqual(mockIdentity);
  });

  it('getCredentials() returns an empty object when allowGuestMode flag is set to false', async () => {
    config = new ConfigReader({
      auth: {
        allowGuestMode: false,
      },
    });
    const guestUserIdentity = GuestUserIdentity.fromConfig(config);

    const response = await guestUserIdentity.getCredentials();

    expect(response).toEqual({});
  });

  it('getCredentials() returns an empty object when allowGuestMode flag is set to empty object', async () => {
    config = new ConfigReader({
      auth: {},
    });
    const guestUserIdentity = GuestUserIdentity.fromConfig(config);

    const response = await guestUserIdentity.getCredentials();

    expect(response).toEqual({});
  });

  describe('Auth.allowGuestMode flag is set to true in config', () => {
    it('getCredentials() returns a token', async () => {
      config = new ConfigReader({
        auth: {
          allowGuestMode: true,
        },
      });

      const guestUserIdentity = await GuestUserIdentity.fromConfig(config);
      const response = await guestUserIdentity.getCredentials();

      const token = response.token ?? 'no token';

      expect(token).toEqual(
        nJwt.verify(token, GUEST_USER_PRIVATE_KEY, 'ES256')?.toString(),
      );
    });
  });
});
