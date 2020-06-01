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

import type { MockedMemberFunctions } from '@backstage/backend-common';
import type { Entity, EntityPolicy } from '@backstage/catalog-model';
import type { Database } from '../database';
import { DatabaseEntitiesCatalog } from './DatabaseEntitiesCatalog';

describe('DatabaseEntitiesCatalog', () => {
  let db: MockedMemberFunctions<Database>;
  let policy: EntityPolicy;

  beforeEach(() => {
    db = {
      transaction: jest.fn(),
      addEntity: jest.fn(),
      updateEntity: jest.fn(),
      entities: jest.fn(),
      entity: jest.fn(),
      removeEntity: jest.fn(),
      addLocation: jest.fn(),
      removeLocation: jest.fn(),
      location: jest.fn(),
      locations: jest.fn(),
      locationHistory: jest.fn(),
      addLocationUpdateLogEvent: jest.fn(),
    };
    db.transaction.mockImplementation(async f => f('tx'));
    policy = { enforce: jest.fn(async x => x) };
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
      db.addEntity.mockResolvedValue({ entity });

      const catalog = new DatabaseEntitiesCatalog(db, policy);
      const result = await catalog.addOrUpdateEntity(entity);

      expect(policy.enforce).toBeCalledWith(entity);
      expect(db.entities).toHaveBeenCalledTimes(1);
      expect(db.addEntity).toHaveBeenCalledTimes(1);
      expect(result).toBe(entity);
    });

    it('updates when given uid', async () => {
      const entity: Entity = {
        apiVersion: 'a',
        kind: 'b',
        metadata: {
          uid: 'uuuu',
          name: 'c',
          namespace: 'd',
        },
      };

      db.entities.mockResolvedValue([]);
      db.updateEntity.mockResolvedValue({ entity });

      const catalog = new DatabaseEntitiesCatalog(db, policy);
      const result = await catalog.addOrUpdateEntity(entity);

      expect(policy.enforce).toBeCalledWith(entity);
      expect(db.entities).toHaveBeenCalledTimes(0);
      expect(db.updateEntity).toHaveBeenCalledTimes(1);
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
          name: 'c',
          namespace: 'd',
        },
      };

      db.entities.mockResolvedValue([{ entity: existing }]);
      db.updateEntity.mockResolvedValue({ entity: added });

      const catalog = new DatabaseEntitiesCatalog(db, policy);
      const result = await catalog.addOrUpdateEntity(added);

      expect(policy.enforce).toBeCalledWith(added);
      expect(db.entities).toHaveBeenCalledTimes(1);
      expect(db.updateEntity).toHaveBeenCalledTimes(1);
      expect(result).toEqual(existing);
    });
  });
});
