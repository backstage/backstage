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

import { BackstageUserIdentity, ProfileInfo } from '@backstage/core-plugin-api';
import { UserIdentity } from './UserIdentity';

describe('UserIdentity', () => {
  it('should cache a successful response from the AuthApi for getProfile', async () => {
    const mockIdentity: BackstageUserIdentity = {
      type: 'user',
      userEntityRef: 'user:default/blam',
      ownershipEntityRefs: [],
    };

    const mockProfileInfo: ProfileInfo = {
      displayName: 'Blam',
      email: 'blob@boop.com',
    };

    const mockAuthApi: any = {
      getProfile: jest.fn().mockResolvedValue(mockProfileInfo),
    };

    const userIdentity = UserIdentity.create({
      authApi: mockAuthApi,
      identity: mockIdentity,
    });

    await userIdentity.getProfileInfo();
    await userIdentity.getProfileInfo();

    const response = await userIdentity.getProfileInfo();

    expect(mockAuthApi.getProfile).toHaveBeenCalledTimes(1);

    expect(response).toEqual(mockProfileInfo);
  });

  it('should not cache failures for the AuthApi for getProfile', async () => {
    const mockIdentity: BackstageUserIdentity = {
      type: 'user',
      userEntityRef: 'user:default/blam',
      ownershipEntityRefs: [],
    };

    const mockProfileInfo: ProfileInfo = {
      displayName: 'Blam',
      email: 'blob@boop.com',
    };

    const mockAuthApi: any = {
      getProfile: jest
        .fn()
        .mockRejectedValueOnce(new Error('boop'))
        .mockResolvedValueOnce(mockProfileInfo),
    };

    const userIdentity = UserIdentity.create({
      authApi: mockAuthApi,
      identity: mockIdentity,
    });

    await expect(() => userIdentity.getProfileInfo()).rejects.toThrow('boop');
    const response = await userIdentity.getProfileInfo();

    expect(mockAuthApi.getProfile).toHaveBeenCalledTimes(2);

    expect(response).toEqual(mockProfileInfo);
  });
});
