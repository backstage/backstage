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

import { BackstageUserIdentity, IdentityApi } from '@backstage/core-plugin-api';
import { CoreStorageVisitsApi } from './CoreStorageVisitsApi';
import { MockStorageApi } from '@backstage/test-utils';

describe('new CoreStorageVisitsApi({ storageApi: MockStorageApi.create() })', () => {
  const mockRandomUUID = () =>
    '068f3129-7440-4e0e-8fd4-xxxxxxxxxxxx'.replace(
      /x/g,
      () => Math.floor(Math.random() * 16).toString(16), // 0x0 to 0xf
    ) as `${string}-${string}-${string}-${string}-${string}`;

  const mockIdentityApi: IdentityApi = {
    signOut: jest.fn(),
    getProfileInfo: jest.fn(),
    getBackstageIdentity: async () =>
      ({ userEntityRef: 'user:default/guest' } as BackstageUserIdentity),
    getCredentials: jest.fn(),
  };

  beforeEach(() => {
    window.crypto.randomUUID = mockRandomUUID;
  });

  afterEach(() => {
    window.localStorage.clear();
  });

  it('instantiates', () => {
    const api = new CoreStorageVisitsApi({
      storageApi: MockStorageApi.create(),
      identityApi: mockIdentityApi,
    });
    expect(api).toBeTruthy();
  });

  it('saves a visit', async () => {
    const api = new CoreStorageVisitsApi({
      storageApi: MockStorageApi.create(),
      identityApi: mockIdentityApi,
    });
    const visit = {
      pathname: '/catalog/default/component/playback-order',
      entityRef: 'component:default/playback-order',
      name: 'Playback Order',
    };
    const returnedVisit = await api.saveVisit({ visit });
    expect(returnedVisit).toEqual(expect.objectContaining(visit));
    expect(returnedVisit.id).toBeTruthy();
    expect(returnedVisit.timestamp).toBeTruthy();
    expect(returnedVisit.hits).toBeTruthy();
  });

  it('retrieves visits', async () => {
    const api = new CoreStorageVisitsApi({
      storageApi: MockStorageApi.create(),
      identityApi: mockIdentityApi,
    });
    const visit = {
      pathname: '/catalog/default/component/playback-order',
      entityRef: 'component:default/playback-order',
      name: 'Playback Order',
    };
    const returnedVisit = await api.saveVisit({ visit });
    const visits = await api.listVisits();
    expect(visits).toHaveLength(1);
    expect(visits).toEqual([expect.objectContaining(visit)]);
    expect(visits).toEqual([returnedVisit]);
  });
});
