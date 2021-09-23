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

import { getVoidLogger } from '@backstage/backend-common';
import { Hash } from 'crypto';
import { DateTime } from 'luxon';
import waitForExpect from 'wait-for-expect';
import { DefaultProcessingDatabase } from './database/DefaultProcessingDatabase';
import { DefaultCatalogProcessingEngine } from './DefaultCatalogProcessingEngine';
import { CatalogProcessingOrchestrator } from './processing/types';
import { Stitcher } from './stitching/Stitcher';

describe('DefaultCatalogProcessingEngine', () => {
  const db = {
    transaction: jest.fn(),
    getProcessableEntities: jest.fn(),
    updateProcessedEntity: jest.fn(),
    updateEntityCache: jest.fn(),
  } as unknown as jest.Mocked<DefaultProcessingDatabase>;
  const orchestrator: jest.Mocked<CatalogProcessingOrchestrator> = {
    process: jest.fn(),
  };
  const stitcher = {
    stitch: jest.fn(),
  } as unknown as jest.Mocked<Stitcher>;
  const hash = {
    update: () => hash,
    digest: jest.fn(),
  } as unknown as jest.Mocked<Hash>;

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should process stuff', async () => {
    orchestrator.process.mockResolvedValue({
      ok: true,
      completedEntity: {
        apiVersion: '1',
        kind: 'Location',
        metadata: { name: 'test' },
      },
      relations: [],
      errors: [],
      deferredEntities: [],
      state: {},
    });
    const engine = new DefaultCatalogProcessingEngine(
      getVoidLogger(),
      [],
      db,
      orchestrator,
      stitcher,
      () => hash,
    );

    db.transaction.mockImplementation(cb => cb((() => {}) as any));

    db.getProcessableEntities
      .mockImplementation(async () => {
        await engine.stop();
        return { items: [] };
      })
      .mockResolvedValueOnce({
        items: [
          {
            entityRef: 'foo',
            id: '1',
            unprocessedEntity: {
              apiVersion: '1',
              kind: 'Location',
              metadata: { name: 'test' },
            },
            resultHash: '',
            state: [] as any,
            nextUpdateAt: DateTime.now(),
            lastDiscoveryAt: DateTime.now(),
          },
        ],
      });

    await engine.start();
    await waitForExpect(() => {
      expect(orchestrator.process).toBeCalledTimes(1);
      expect(orchestrator.process).toBeCalledWith({
        entity: {
          apiVersion: '1',
          kind: 'Location',
          metadata: { name: 'test' },
        },
        state: [], // State is forwarded as is, even if it's a bad format
      });
    });
    await engine.stop();
  });

  it('should process stuff even if the first attempt fail', async () => {
    orchestrator.process.mockResolvedValue({
      ok: true,
      completedEntity: {
        apiVersion: '1',
        kind: 'Location',
        metadata: { name: 'test' },
      },
      relations: [],
      errors: [],
      deferredEntities: [],
      state: {},
    });
    const engine = new DefaultCatalogProcessingEngine(
      getVoidLogger(),
      [],
      db,
      orchestrator,
      stitcher,
      () => hash,
    );

    db.transaction.mockImplementation(cb => cb((() => {}) as any));

    db.getProcessableEntities
      .mockImplementation(async () => {
        await engine.stop();
        return { items: [] };
      })
      .mockRejectedValueOnce(new Error('I FAILED'))
      .mockResolvedValueOnce({
        items: [
          {
            entityRef: 'foo',
            id: '1',
            unprocessedEntity: {
              apiVersion: '1',
              kind: 'Location',
              metadata: { name: 'test' },
            },
            resultHash: '',
            state: { cache: { myProcessor: { myKey: 'myValue' } } },
            nextUpdateAt: DateTime.now(),
            lastDiscoveryAt: DateTime.now(),
          },
        ],
      });

    await engine.start();
    await waitForExpect(() => {
      expect(orchestrator.process).toBeCalledTimes(1);
      expect(orchestrator.process).toBeCalledWith({
        entity: {
          apiVersion: '1',
          kind: 'Location',
          metadata: { name: 'test' },
        },
        state: { cache: { myProcessor: { myKey: 'myValue' } } },
      });
    });
    await engine.stop();
  });

  it('runs fully when hash mismatches, early-outs when hash matches', async () => {
    const entity = {
      apiVersion: '1',
      kind: 'Location',
      metadata: { name: 'test' },
    };

    const refreshState = {
      id: '',
      entityRef: '',
      unprocessedEntity: entity,
      resultHash: 'the matching hash',
      state: {},
      nextUpdateAt: DateTime.now(),
      lastDiscoveryAt: DateTime.now(),
    };

    hash.digest.mockReturnValue('the matching hash');

    orchestrator.process.mockResolvedValue({
      ok: true,
      completedEntity: entity,
      relations: [],
      errors: [],
      deferredEntities: [],
      state: {},
    });

    const engine = new DefaultCatalogProcessingEngine(
      getVoidLogger(),
      [],
      db,
      orchestrator,
      stitcher,
      () => hash,
    );

    db.transaction.mockImplementation(cb => cb((() => {}) as any));

    db.getProcessableEntities
      .mockResolvedValueOnce({
        items: [{ ...refreshState, resultHash: 'NOT RIGHT' }],
      })
      .mockResolvedValue({ items: [] });

    await engine.start();

    await waitForExpect(() => {
      expect(orchestrator.process).toBeCalledTimes(1);
      expect(hash.digest).toBeCalledTimes(1);
      expect(db.updateProcessedEntity).toBeCalledTimes(1);
    });
    expect(db.updateEntityCache).not.toHaveBeenCalled();

    db.getProcessableEntities
      .mockReset()
      .mockResolvedValueOnce({
        items: [{ ...refreshState, state: { something: 'different' } }],
      })
      .mockResolvedValue({ items: [] });

    await waitForExpect(() => {
      expect(orchestrator.process).toBeCalledTimes(2);
      expect(hash.digest).toBeCalledTimes(2);
      expect(db.updateProcessedEntity).toBeCalledTimes(1);
      expect(db.updateEntityCache).toBeCalledTimes(1);
    });
    expect(db.updateEntityCache).toHaveBeenCalledWith(expect.anything(), {
      id: '',
      state: { ttl: 5 },
    });
    await engine.stop();
  });

  it('should decrease the state ttl if there are errors', async () => {
    const entity = {
      apiVersion: '1',
      kind: 'Location',
      metadata: { name: 'test' },
    };

    const refreshState = {
      id: '',
      entityRef: '',
      unprocessedEntity: entity,
      resultHash: 'the matching hash',
      state: { some: 'value', ttl: 1 },
      nextUpdateAt: DateTime.now(),
      lastDiscoveryAt: DateTime.now(),
    };

    hash.digest.mockReturnValue('the matching hash');

    orchestrator.process.mockResolvedValue({
      ok: false,
      errors: [],
    });

    const engine = new DefaultCatalogProcessingEngine(
      getVoidLogger(),
      [],
      db,
      orchestrator,
      stitcher,
      () => hash,
    );

    db.transaction.mockImplementation(cb => cb((() => {}) as any));

    await engine.start();

    db.getProcessableEntities
      .mockResolvedValueOnce({
        items: [refreshState],
      })
      .mockResolvedValue({ items: [] });

    await waitForExpect(() => {
      expect(db.updateEntityCache).toBeCalledTimes(1);
    });

    expect(db.updateEntityCache).toHaveBeenCalledWith(expect.anything(), {
      id: '',
      state: { some: 'value', ttl: 0 },
    });

    // Second run, the TTL should now reach 0 and the cache should be cleared
    db.getProcessableEntities
      .mockResolvedValueOnce({
        items: [
          {
            ...refreshState,
            state: db.updateEntityCache.mock.calls[0][1].state,
          },
        ],
      })
      .mockResolvedValue({ items: [] });

    db.updateEntityCache.mockReset();
    await waitForExpect(() => {
      expect(db.updateEntityCache).toBeCalledTimes(1);
    });

    expect(db.updateEntityCache).toHaveBeenCalledWith(expect.anything(), {
      id: '',
      state: {},
    });

    await engine.stop();
  });
});
