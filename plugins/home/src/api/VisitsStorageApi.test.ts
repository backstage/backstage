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
import { VisitsStorageApi } from './VisitsStorageApi';
import { MockStorageApi } from '@backstage/test-utils';
import { Visit, VisitsApi } from './VisitsApi';

describe('VisitsStorageApi.create', () => {
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
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.useRealTimers();
    window.localStorage.clear();
  });

  it('instantiates', () => {
    const api = VisitsStorageApi.create({
      storageApi: MockStorageApi.create(),
      identityApi: mockIdentityApi,
    });
    expect(api).toBeTruthy();
  });

  describe('.save()', () => {
    it('saves a visit', async () => {
      const api = VisitsStorageApi.create({
        storageApi: MockStorageApi.create(),
        identityApi: mockIdentityApi,
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

    it('can control the number of stored entities', async () => {
      const api = VisitsStorageApi.create({
        storageApi: MockStorageApi.create(),
        identityApi: mockIdentityApi,
        limit: 2,
      });
      const baseDate = Date.now();
      const visit1 = {
        pathname: '/catalog/default/component/playback-order-1',
        entityRef: 'component:default/playback-order',
        name: 'Playback Order',
      };
      jest.setSystemTime(baseDate);
      await api.save({ visit: visit1 });
      const visit2 = {
        pathname: '/catalog/default/component/playback-order-2',
        entityRef: 'component:default/playback-order',
        name: 'Playback Order',
      };
      jest.setSystemTime(baseDate + 360_000);
      await api.save({ visit: visit2 });
      const visit3 = {
        pathname: '/catalog/default/component/playback-order-3',
        entityRef: 'component:default/playback-order',
        name: 'Playback Order',
      };
      jest.setSystemTime(baseDate + 360_000 * 2);
      await api.save({ visit: visit3 });
      const visits = await api.list();
      expect(visits).toHaveLength(2);
      expect(visits).toContainEqual(expect.objectContaining(visit2));
      expect(visits).toContainEqual(expect.objectContaining(visit3));
    });

    it('correctly bumps the hits from a previous visit', async () => {
      const api = VisitsStorageApi.create({
        storageApi: MockStorageApi.create(),
        identityApi: mockIdentityApi,
      });
      const visit = {
        pathname: '/catalog/default/component/playback-order',
        entityRef: 'component:default/playback-order',
        name: 'Playback Order',
      };
      const visit1 = await api.save({ visit });
      const visit2 = await api.save({ visit });
      const visits = await api.list();
      expect(visits).toHaveLength(1);
      expect(visits).toContainEqual(expect.objectContaining(visit));
      // keeps the original id created on the first visit
      expect(visits).toContainEqual(expect.objectContaining({ id: visit1.id }));
      // updates timestamp and hits
      expect(visits).toContainEqual(
        expect.objectContaining({ timestamp: visit2.timestamp, hits: 2 }),
      );
    });
  });

  describe('.list()', () => {
    let api: VisitsApi;
    let visitsToSave: Array<Omit<Visit, 'id' | 'hits' | 'timestamp'>>;
    let baseDate: number;

    beforeEach(() => {
      api = VisitsStorageApi.create({
        storageApi: MockStorageApi.create(),
        identityApi: mockIdentityApi,
      });
      visitsToSave = [
        {
          pathname: '/catalog/default/component/playback-order-1',
          entityRef: 'component:default/playback-order-1',
          name: 'Playback Order Odd',
        },
        {
          pathname: '/catalog/default/component/playback-order-2',
          entityRef: 'component:default/playback-order-2',
          name: 'Playback Order Even',
        },
        {
          pathname: '/catalog/default/component/playback-order-3',
          entityRef: 'component:default/playback-order-3',
          name: 'Playback Order Odd',
        },
      ];
      baseDate = Date.now();
      // Chaining items to ensure the right setSystemTime
      return visitsToSave.reduce(
        (acc, visit, index) =>
          acc.then(() => {
            jest.setSystemTime(baseDate + 360_000 * index);
            return api.save({ visit });
          }),
        Promise.resolve({}),
      );
    });

    it('retrieves visits', async () => {
      const visits = await api.list();
      expect(visits).toHaveLength(3);
      expect(visits).toEqual([
        expect.objectContaining(visitsToSave[2]),
        expect.objectContaining(visitsToSave[1]),
        expect.objectContaining(visitsToSave[0]),
      ]);
    });

    it('orders by timestamp asc', async () => {
      const visits = await api.list({
        orderBy: [{ field: 'timestamp', direction: 'asc' }],
      });
      expect(visits).toEqual([
        expect.objectContaining(visitsToSave[0]),
        expect.objectContaining(visitsToSave[1]),
        expect.objectContaining(visitsToSave[2]),
      ]);
    });

    it('orders by timestamp desc', async () => {
      const visits = await api.list({
        orderBy: [{ field: 'timestamp', direction: 'desc' }],
      });
      expect(visits).toEqual([
        expect.objectContaining(visitsToSave[2]),
        expect.objectContaining(visitsToSave[1]),
        expect.objectContaining(visitsToSave[0]),
      ]);
    });

    it('orders by entityRef asc', async () => {
      const visits = await api.list({
        orderBy: [{ field: 'entityRef', direction: 'asc' }],
      });
      expect(visits).toEqual([
        expect.objectContaining(visitsToSave[0]),
        expect.objectContaining(visitsToSave[1]),
        expect.objectContaining(visitsToSave[2]),
      ]);
    });

    it('orders by entityRef desc', async () => {
      const visits = await api.list({
        orderBy: [{ field: 'entityRef', direction: 'desc' }],
      });
      expect(visits).toEqual([
        expect.objectContaining(visitsToSave[2]),
        expect.objectContaining(visitsToSave[1]),
        expect.objectContaining(visitsToSave[0]),
      ]);
    });

    it('orders by name asc then by entityRef asc', async () => {
      const visits = await api.list({
        orderBy: [
          { field: 'name', direction: 'asc' },
          { field: 'entityRef', direction: 'asc' },
        ],
      });
      expect(visits).toEqual([
        expect.objectContaining(visitsToSave[1]), // Playback Order Even, playback-order-2
        expect.objectContaining(visitsToSave[0]), // Playback Order Odd, playback-order-1
        expect.objectContaining(visitsToSave[2]), // Playback Order Odd, playback-order-3
      ]);
    });

    it('orders by name desc then by entityRef asc', async () => {
      const visits = await api.list({
        orderBy: [
          { field: 'name', direction: 'desc' },
          { field: 'entityRef', direction: 'asc' },
        ],
      });
      expect(visits).toEqual([
        expect.objectContaining(visitsToSave[0]), // Playback Order Odd, playback-order-1
        expect.objectContaining(visitsToSave[2]), // Playback Order Odd, playback-order-3
        expect.objectContaining(visitsToSave[1]), // Playback Order Even, playback-order-2
      ]);
    });

    it('filters by timestamp with value >', async () => {
      const visits = await api.list({
        filterBy: [{ field: 'timestamp', operator: '>', value: baseDate }],
      });
      expect(visits).toHaveLength(2);
      expect(visits).toEqual([
        expect.objectContaining(visitsToSave[2]),
        expect.objectContaining(visitsToSave[1]),
      ]);
    });

    it('filters by timestamp with >=', async () => {
      const visits = await api.list({
        filterBy: [
          { field: 'timestamp', operator: '>=', value: baseDate + 360_000 * 2 },
        ],
      });
      expect(visits).toHaveLength(1);
      expect(visits).toEqual([expect.objectContaining(visitsToSave[2])]);
    });

    it('filters by timestamp with <', async () => {
      const visits = await api.list({
        filterBy: [{ field: 'timestamp', operator: '<', value: baseDate + 1 }],
      });
      expect(visits).toHaveLength(1);
      expect(visits).toEqual([expect.objectContaining(visitsToSave[0])]);
    });

    it('filters by timestamp with <=', async () => {
      const visits = await api.list({
        filterBy: [
          { field: 'timestamp', operator: '<=', value: baseDate + 360_000 },
        ],
      });
      expect(visits).toHaveLength(2);
      expect(visits).toEqual([
        expect.objectContaining(visitsToSave[1]),
        expect.objectContaining(visitsToSave[0]),
      ]);
    });

    it('filters by timestamp with ==', async () => {
      const visits = await api.list({
        filterBy: [
          { field: 'timestamp', operator: '==', value: baseDate + 360_000 },
        ],
      });
      expect(visits).toHaveLength(1);
      expect(visits).toEqual([expect.objectContaining(visitsToSave[1])]);
    });

    it('filters by timestamp with !=', async () => {
      const visits = await api.list({
        filterBy: [
          { field: 'timestamp', operator: '!=', value: baseDate + 360_000 },
        ],
      });
      expect(visits).toHaveLength(2);
      expect(visits).toEqual([
        expect.objectContaining(visitsToSave[2]),
        expect.objectContaining(visitsToSave[0]),
      ]);
    });

    it('filters by entityRef with contains', async () => {
      const visits = await api.list({
        filterBy: [
          { field: 'entityRef', operator: 'contains', value: 'order-2' },
        ],
      });
      expect(visits).toHaveLength(1);
      expect(visits).toEqual([expect.objectContaining(visitsToSave[1])]);
    });

    it('filters by timestamp with <= then by name with contains', async () => {
      const visits = await api.list({
        filterBy: [
          { field: 'timestamp', operator: '<=', value: baseDate + 360_000 },
          { field: 'name', operator: 'contains', value: 'Odd' },
        ],
      });
      expect(visits).toHaveLength(1);
      expect(visits).toEqual([expect.objectContaining(visitsToSave[0])]);
    });
  });
});
