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

import { Entity } from '@backstage/catalog-model';
import { Logger } from 'winston';
import { CoalescedEntitiesCatalog } from './CoalescedEntitiesCatalog';
import { EntitiesCatalog } from './types';

describe('CoalescedEntitiesCatalog', () => {
  const e1: Entity = {
    apiVersion: 'a',
    kind: 'k',
    metadata: { name: 'n1' },
  };

  const e2: Entity = {
    apiVersion: 'a',
    kind: 'k',
    metadata: { name: 'n2' },
  };

  const c1: jest.Mocked<EntitiesCatalog> = {
    entities: jest.fn(),
    entityByUid: jest.fn(),
    entityByName: jest.fn(),
    addOrUpdateEntity: jest.fn(),
    removeEntityByUid: jest.fn(),
  };

  const c2: jest.Mocked<EntitiesCatalog> = {
    entities: jest.fn(),
    entityByUid: jest.fn(),
    entityByName: jest.fn(),
    addOrUpdateEntity: jest.fn(),
    removeEntityByUid: jest.fn(),
  };

  const mockLogger = {
    warn: jest.fn(),
  };
  const logger = (mockLogger as unknown) as Logger;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('entities', () => {
    it('flattens results from multiple sources', async () => {
      c1.entities.mockResolvedValueOnce([e1]);
      c2.entities.mockResolvedValueOnce([e2]);
      const catalog = new CoalescedEntitiesCatalog([c1, c2], logger);
      await expect(catalog.entities()).resolves.toEqual(
        expect.arrayContaining([e1, e2]),
      );
      expect(c1.entities).toBeCalledTimes(1);
      expect(c2.entities).toBeCalledTimes(1);
    });

    it('logs an error if any source throws', async () => {
      c1.entities.mockResolvedValueOnce([e1]);
      c2.entities.mockRejectedValueOnce(new Error('boo'));
      const catalog = new CoalescedEntitiesCatalog([c1, c2], logger);
      await expect(catalog.entities()).resolves.toEqual([e1]);
      expect(c1.entities).toBeCalledTimes(1);
      expect(c2.entities).toBeCalledTimes(1);
      expect(mockLogger.warn).toBeCalledWith(expect.stringMatching(/boo/));
    });
  });

  describe('entityByUid', () => {
    it('returns the first non-undefined result', async () => {
      c1.entityByUid.mockResolvedValueOnce(undefined);
      c2.entityByUid.mockResolvedValueOnce(e2);
      const catalog = new CoalescedEntitiesCatalog([c1, c2], logger);
      await expect(catalog.entityByUid('e2')).resolves.toBe(e2);
      expect(c1.entityByUid).toBeCalledTimes(1);
      expect(c2.entityByUid).toBeCalledTimes(1);
    });

    it('returns undefined if all results were undefined', async () => {
      c1.entityByUid.mockResolvedValueOnce(undefined);
      c2.entityByUid.mockResolvedValueOnce(undefined);
      const catalog = new CoalescedEntitiesCatalog([c1, c2], logger);
      await expect(catalog.entityByUid('e2')).resolves.toBeUndefined();
      expect(c1.entityByUid).toBeCalledTimes(1);
      expect(c2.entityByUid).toBeCalledTimes(1);
    });

    it('logs an error if any source throws', async () => {
      c1.entityByUid.mockResolvedValueOnce(e1);
      c2.entityByUid.mockRejectedValueOnce(new Error('boo'));
      const catalog = new CoalescedEntitiesCatalog([c1, c2], logger);
      await expect(catalog.entityByUid('e2')).resolves.toBe(e1);
      expect(c1.entityByUid).toBeCalledTimes(1);
      expect(c2.entityByUid).toBeCalledTimes(1);
      expect(mockLogger.warn).toBeCalledWith(expect.stringMatching(/boo/));
    });
  });

  describe('entityByName', () => {
    it('returns the first non-undefined result', async () => {
      c1.entityByName.mockResolvedValueOnce(undefined);
      c2.entityByName.mockResolvedValueOnce(e2);
      const catalog = new CoalescedEntitiesCatalog([c1, c2], logger);
      await expect(catalog.entityByName('k', undefined, 'n2')).resolves.toBe(
        e2,
      );
      expect(c1.entityByName).toBeCalledTimes(1);
      expect(c2.entityByName).toBeCalledTimes(1);
    });

    it('returns undefined if all results were undefined', async () => {
      c1.entityByName.mockResolvedValueOnce(undefined);
      c2.entityByName.mockResolvedValueOnce(undefined);
      const catalog = new CoalescedEntitiesCatalog([c1, c2], logger);
      await expect(
        catalog.entityByName('k', undefined, 'n2'),
      ).resolves.toBeUndefined();
      expect(c1.entityByName).toBeCalledTimes(1);
      expect(c2.entityByName).toBeCalledTimes(1);
    });

    it('logs an error if any source throws', async () => {
      c1.entityByName.mockResolvedValueOnce(e1);
      c2.entityByName.mockRejectedValueOnce(new Error('boo'));
      const catalog = new CoalescedEntitiesCatalog([c1, c2], logger);
      await expect(catalog.entityByName('k', undefined, 'n2')).resolves.toBe(
        e1,
      );
      expect(c1.entityByName).toBeCalledTimes(1);
      expect(c2.entityByName).toBeCalledTimes(1);
      expect(mockLogger.warn).toBeCalledWith(expect.stringMatching(/boo/));
    });
  });
});
