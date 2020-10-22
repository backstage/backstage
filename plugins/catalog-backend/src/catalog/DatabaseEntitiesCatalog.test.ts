/*
 * Copyright 2020 Spotify AB
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

import { getVoidLogger } from '@backstage/backend-common';
import type { Entity } from '@backstage/catalog-model';
import { Database, DatabaseManager } from '../database';
import { DatabaseEntitiesCatalog } from './DatabaseEntitiesCatalog';

describe('DatabaseEntitiesCatalog', () => {
  let db: jest.Mocked<Database>;

  beforeAll(() => {
    db = {
      transaction: jest.fn(),
      addEntities: jest.fn(),
      updateEntity: jest.fn(),
      entities: jest.fn(),
      entityByName: jest.fn(),
      entityByUid: jest.fn(),
      removeEntityByUid: jest.fn(),
      setRelations: jest.fn(),
      addLocation: jest.fn(),
      removeLocation: jest.fn(),
      location: jest.fn(),
      locations: jest.fn(),
      locationHistory: jest.fn(),
      addLocationUpdateLogEvent: jest.fn(),
    };
  });

  beforeEach(() => {
    jest.resetAllMocks();
    db.transaction.mockImplementation(async f => f('tx'));
  });

  describe('addOrUpdateEntity', () => {
    it('adds when no given uid and no matching by name', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
          namespace: 'd',
        },
      };

      db.entities.mockResolvedValue([]);
      db.addEntities.mockResolvedValue([{ entity }]);

      const catalog = new DatabaseEntitiesCatalog(db, getVoidLogger());
      const result = await catalog.addOrUpdateEntity(entity);

      expect(db.entityByName).toHaveBeenCalledTimes(1);
      expect(db.entityByName).toHaveBeenCalledWith(expect.anything(), {
        kind: 'b',
        namespace: 'd',
        name: 'c',
      });
      expect(db.addEntities).toHaveBeenCalledTimes(1);
      expect(result).toBe(entity);
    });

    it('updates when given uid', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          uid: 'u',
          name: 'c',
          namespace: 'd',
        },
      };

      db.entityByUid.mockResolvedValue({
        entity: {
          apiVersion: 'a',
          kind: 'b',
          metadata: {
            uid: 'u',
            etag: 'e',
            generation: 1,
            name: 'c',
            namespace: 'd',
          },
        },
      });
      db.updateEntity.mockResolvedValue({ entity });

      const catalog = new DatabaseEntitiesCatalog(db, getVoidLogger());
      const result = await catalog.addOrUpdateEntity(entity);

      expect(db.entities).toHaveBeenCalledTimes(0);
      expect(db.entityByUid).toHaveBeenCalledTimes(1);
      expect(db.entityByUid).toHaveBeenCalledWith(expect.anything(), 'u');
      expect(db.updateEntity).toHaveBeenCalledTimes(1);
      expect(db.updateEntity).toHaveBeenCalledWith(
        expect.anything(),
        {
          entity: {
            apiVersion: 'a',
            kind: 'b',
            metadata: {
              uid: 'u',
              etag: 'e',
              generation: 1,
              name: 'c',
              namespace: 'd',
            },
          },
        },
        'e',
        1,
      );
      expect(result).toBe(entity);
    });

    it('update when no given uid and matching by name', async () => {
      const added: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          name: 'c',
          namespace: 'd',
        },
      };
      const existing: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          uid: 'u',
          etag: 'e',
          generation: 1,
          name: 'c',
          namespace: 'd',
        },
      };

      db.entityByName.mockResolvedValue({ entity: existing });
      db.updateEntity.mockResolvedValue({ entity: existing });

      const catalog = new DatabaseEntitiesCatalog(db, getVoidLogger());
      const result = await catalog.addOrUpdateEntity(added);

      expect(db.entityByName).toHaveBeenCalledTimes(1);
      expect(db.entityByName).toHaveBeenCalledWith(expect.anything(), {
        kind: 'b',
        namespace: 'd',
        name: 'c',
      });
      expect(db.updateEntity).toHaveBeenCalledTimes(1);
      expect(db.updateEntity).toHaveBeenCalledWith(
        expect.anything(),
        {
          entity: {
            apiVersion: 'a',
            kind: 'b',
            metadata: {
              uid: 'u',
              etag: 'e',
              generation: 1,
              name: 'c',
              namespace: 'd',
            },
          },
        },
        'e',
        1,
      );
      expect(result).toEqual(existing);
    });
  });

  describe('batchAddOrUpdateEntities', () => {
    it('both adds and updates', async () => {
      const catalog = new DatabaseEntitiesCatalog(
        await DatabaseManager.createTestDatabase(),
        getVoidLogger(),
      );
      const entities: Entity[] = [];
      for (let i = 0; i < 500; ++i) {
        entities.push({
          apiVersion: 'a',
          kind: 'k',
          metadata: { name: `n${i}` },
        });
      }

      await catalog.batchAddOrUpdateEntities(entities);
      const afterFirst = await catalog.entities();
      expect(afterFirst.length).toBe(500);

      entities[40].metadata.op = 'changed';
      entities.push({
        apiVersion: 'a',
        kind: 'k',
        metadata: { name: `n500`, op: 'added' },
      });

      await catalog.batchAddOrUpdateEntities(entities);
      const afterSecond = await catalog.entities();
      expect(afterSecond.length).toBe(501);
      expect(afterSecond.find(e => e.metadata.op === 'changed')).toBeDefined();
      expect(afterSecond.find(e => e.metadata.op === 'added')).toBeDefined();
    });
  });
});
