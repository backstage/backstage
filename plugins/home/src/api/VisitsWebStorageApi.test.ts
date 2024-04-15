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
import { VisitsWebStorageApi } from './VisitsWebStorageApi';

describe('VisitsWebStorageApi.create()', () => {
  const mockRandomUUID = () =>
    '068f3129-7440-4e0e-8fd4-xxxxxxxxxxxx'.replace(
      /x/g,
      () => Math.floor(Math.random() * 16).toString(16), // 0x0 to 0xf
    ) as `${string}-${string}-${string}-${string}-${string}`;

  const mockIdentityApi: IdentityApi = {
    signOut: jest.fn(),
    getProfileInfo: jest.fn(),
    getBackstageIdentity: async () =>
      ({ userEntityRef: 'user:default/guest' }) as BackstageUserIdentity,
    getCredentials: jest.fn(),
  };

  const mockErrorApi = { post: jest.fn(), error$: jest.fn() };

  beforeEach(() => {
    window.crypto.randomUUID = mockRandomUUID;
  });

  afterEach(() => {
    window.localStorage.clear();
    jest.resetAllMocks();
  });

  it('instantiates with only identitiyApi', () => {
    const api = VisitsWebStorageApi.create({
      identityApi: mockIdentityApi,
      errorApi: mockErrorApi,
    });
    expect(api).toBeTruthy();
  });

  it('saves a visit', async () => {
    const api = VisitsWebStorageApi.create({
      identityApi: mockIdentityApi,
      errorApi: mockErrorApi,
    });
    const visit = {
      pathname: '/catalog/default/component/playback-order',
      entityRef: 'component:default/playback-order',
      name: 'Playback Order',
    };
    const returnedVisit = await api.save({ visit });
    expect(returnedVisit).toEqual(expect.objectContaining(visit));
    expect(returnedVisit.id).toBeTruthy();
    expect(returnedVisit.timestamp).toBeTruthy();
    expect(returnedVisit.hits).toBeTruthy();
  });

  it('retrieves visits', async () => {
    const api = VisitsWebStorageApi.create({
      identityApi: mockIdentityApi,
      errorApi: mockErrorApi,
    });
    const visit = {
      pathname: '/catalog/default/component/playback-order',
      entityRef: 'component:default/playback-order',
      name: 'Playback Order',
    };
    const returnedVisit = await api.save({ visit });
    const visits = await api.list();
    expect(visits).toHaveLength(1);
    expect(visits).toEqual([expect.objectContaining(visit)]);
    expect(visits).toEqual([returnedVisit]);
  });
});
