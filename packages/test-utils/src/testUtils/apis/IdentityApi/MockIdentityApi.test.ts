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

import { MockIdentityApi } from './MockIdentityApi';
import { BackstageUserIdentity, ProfileInfo } from '@backstage/core-plugin-api';

describe('MockIdentityApi', () => {
  it('should collect profile info', async () => {
    const api = new MockIdentityApi();
    const userInfo: ProfileInfo = {
      email: 'firstName.lastName@domain.com',
      displayName: 'displayName',
      picture: 'picture',
    };

    api.createProfileInfo(userInfo);

    expect(await api.getProfileInfo()).toEqual(userInfo);
  });

  it('should collect the backstage identity', async () => {
    const api = new MockIdentityApi();
    const backstageIdentity: BackstageUserIdentity = {
      type: 'user',
      userEntityRef: 'userEntityRef',
      ownershipEntityRefs: [
        'ownershipEntityRefs-one',
        'ownershipEntityRefs-two',
      ],
    };

    api.createBackstageIdentity(backstageIdentity);

    expect(await api.getBackstageIdentity()).toEqual(backstageIdentity);
  });

  it('should collect the credentials', async () => {
    const api = new MockIdentityApi();

    expect(await api.getCredentials()).toEqual({ token: '' });
  });
});
