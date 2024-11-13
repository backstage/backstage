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

import { Hash } from 'crypto';
import { DateTime } from 'luxon';
import waitForExpect from 'wait-for-expect';
import { DefaultProcessingDatabase } from '../database/DefaultProcessingDatabase';
import { DefaultCatalogProcessingEngine } from './DefaultCatalogProcessingEngine';
import { CatalogProcessingOrchestrator } from './types';
import { Stitcher } from '../stitching/types';
import { ConfigReader } from '@backstage/config';
import { mockServices } from '@backstage/backend-test-utils';

describe('DefaultCatalogProcessingEngine', () => {
  const db = {
    transaction: jest.fn(),
    getProcessableEntities: jest.fn(),
    updateProcessedEntity: jest.fn(),
    updateEntityCache: jest.fn(),
    listParents: jest.fn(),
    setRefreshKeys: jest.fn(),
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
      refreshKeys: [],
    });
    const engine = new DefaultCatalogProcessingEngine({
      config: new ConfigReader({}),
      logger: mockServices.logger.mock(),
      processingDatabase: db,
      knex: {} as any,
      orchestrator: orchestrator,
      stitcher: stitcher,
      createHash: () => hash,
    });

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
    db.listParents.mockResolvedValue({ entityRefs: [] });
    db.updateProcessedEntity.mockResolvedValue({
      previous: { relations: [] },
    });

    await engine.start();
    await waitForExpect(() => {
      expect(orchestrator.process).toHaveBeenCalledTimes(1);
      expect(orchestrator.process).toHaveBeenCalledWith({
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
      refreshKeys: [],
    });
    const engine = new DefaultCatalogProcessingEngine({
      config: new ConfigReader({}),
      logger: mockServices.logger.mock(),
      processingDatabase: db,
      knex: {} as any,
      orchestrator: orchestrator,
      stitcher: stitcher,
      createHash: () => hash,
    });

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
    db.listParents.mockResolvedValue({ entityRefs: [] });
    db.updateProcessedEntity.mockImplementation(async () => ({
      previous: { relations: [] },
    }));

    await engine.start();
    await waitForExpect(() => {
      expect(orchestrator.process).toHaveBeenCalledTimes(1);
      expect(orchestrator.process).toHaveBeenCalledWith({
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
      refreshKeys: [],
    });

    const engine = new DefaultCatalogProcessingEngine({
      config: new ConfigReader({}),
      logger: mockServices.logger.mock(),
      processingDatabase: db,
      knex: {} as any,
      orchestrator: orchestrator,
      stitcher: stitcher,
      createHash: () => hash,
    });

    db.transaction.mockImplementation(cb => cb((() => {}) as any));

    db.listParents.mockResolvedValue({ entityRefs: [] });
    db.getProcessableEntities
      .mockResolvedValueOnce({
        items: [{ ...refreshState, resultHash: 'NOT RIGHT' }],
      })
      .mockResolvedValue({ items: [] });
    db.updateProcessedEntity.mockImplementation(async () => ({
      previous: { relations: [] },
    }));

    await engine.start();

    await waitForExpect(() => {
      expect(orchestrator.process).toHaveBeenCalledTimes(1);
      expect(hash.digest).toHaveBeenCalledTimes(1);
      expect(db.updateProcessedEntity).toHaveBeenCalledTimes(1);
      expect(db.listParents).toHaveBeenCalledTimes(1);
    });
    expect(db.updateEntityCache).not.toHaveBeenCalled();

    db.getProcessableEntities
      .mockReset()
      .mockResolvedValueOnce({
        items: [{ ...refreshState, state: { something: 'different' } }],
      })
      .mockResolvedValue({ items: [] });

    await waitForExpect(() => {
      expect(orchestrator.process).toHaveBeenCalledTimes(2);
      expect(hash.digest).toHaveBeenCalledTimes(2);
      expect(db.updateProcessedEntity).toHaveBeenCalledTimes(1);
      expect(db.updateEntityCache).toHaveBeenCalledTimes(1);
      expect(db.listParents).toHaveBeenCalledTimes(2);
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

    const engine = new DefaultCatalogProcessingEngine({
      config: new ConfigReader({}),
      logger: mockServices.logger.mock(),
      processingDatabase: db,
      knex: {} as any,
      orchestrator: orchestrator,
      stitcher: stitcher,
      createHash: () => hash,
    });

    db.transaction.mockImplementation(cb => cb((() => {}) as any));

    await engine.start();

    db.getProcessableEntities
      .mockResolvedValueOnce({
        items: [refreshState],
      })
      .mockResolvedValue({ items: [] });
    db.listParents.mockResolvedValue({ entityRefs: [] });
    db.updateProcessedEntity.mockImplementation(async () => ({
      previous: { relations: [] },
    }));

    await waitForExpect(() => {
      expect(db.updateEntityCache).toHaveBeenCalledTimes(1);
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
      expect(db.updateEntityCache).toHaveBeenCalledTimes(1);
    });

    expect(db.updateEntityCache).toHaveBeenCalledWith(expect.anything(), {
      id: '',
      state: {},
    });

    await engine.stop();
  });

  it('should stitch both the previous and new sources when relations change', async () => {
    const engine = new DefaultCatalogProcessingEngine({
      config: new ConfigReader({}),
      logger: mockServices.logger.mock(),
      processingDatabase: db,
      knex: {} as any,
      orchestrator: orchestrator,
      stitcher: stitcher,
      createHash: () => hash,
      pollingIntervalMs: 100,
    });

    db.transaction.mockImplementation(cb => cb((() => {}) as any));

    const entity = {
      apiVersion: '1',
      kind: 'k',
      metadata: { name: 'me', namespace: 'ns' },
    };
    const processableEntity = {
      entityRef: 'foo',
      id: '1',
      unprocessedEntity: entity,
      resultHash: '',
      state: [] as any,
      nextUpdateAt: DateTime.now(),
      lastDiscoveryAt: DateTime.now(),
    };

    db.listParents.mockResolvedValue({ entityRefs: [] });
    db.getProcessableEntities
      .mockResolvedValueOnce({
        items: [processableEntity],
      })
      .mockResolvedValueOnce({
        items: [processableEntity],
      });
    db.updateProcessedEntity
      .mockImplementationOnce(async () => ({
        previous: { relations: [] },
      }))
      .mockImplementationOnce(async () => ({
        previous: {
          relations: [
            {
              originating_entity_id: '',
              type: 't',
              source_entity_ref: 'k:ns/other1',
              target_entity_ref: 'k:ns/me',
            },
            {
              originating_entity_id: '',
              type: 't',
              source_entity_ref: 'k:ns/other2',
              target_entity_ref: 'k:ns/me',
            },
          ],
        },
      }));

    orchestrator.process
      .mockResolvedValueOnce({
        ok: true,
        completedEntity: entity,
        relations: [
          {
            type: 't',
            source: { kind: 'k', namespace: 'ns', name: 'other1' },
            target: { kind: 'k', namespace: 'ns', name: 'me' },
          },
          {
            type: 't',
            source: { kind: 'k', namespace: 'ns', name: 'other2' },
            target: { kind: 'k', namespace: 'ns', name: 'me' },
          },
        ],
        errors: [],
        deferredEntities: [],
        state: {},
        refreshKeys: [],
      })
      .mockResolvedValueOnce({
        ok: true,
        completedEntity: entity,
        relations: [
          {
            type: 't',
            source: { kind: 'k', namespace: 'ns', name: 'other2' },
            target: { kind: 'k', namespace: 'ns', name: 'me' },
          },
          {
            type: 't',
            source: { kind: 'k', namespace: 'ns', name: 'other3' },
            target: { kind: 'k', namespace: 'ns', name: 'me' },
          },
        ],
        errors: [],
        deferredEntities: [],
        state: {},
        refreshKeys: [],
      });

    await engine.start();
    await waitForExpect(() => {
      expect(stitcher.stitch).toHaveBeenCalledTimes(2);
    });
    expect([...stitcher.stitch.mock.calls[0][0].entityRefs!]).toEqual(
      expect.arrayContaining(['k:ns/me', 'k:ns/other1', 'k:ns/other2']),
    );
    expect([...stitcher.stitch.mock.calls[1][0].entityRefs!]).toEqual(
      expect.arrayContaining(['k:ns/me', 'k:ns/other1', 'k:ns/other3']),
    );
    await engine.stop();
  });

  it('should stitch both the previous and new sources when relation target changes', async () => {
    const engine = new DefaultCatalogProcessingEngine({
      config: new ConfigReader({}),
      logger: mockServices.logger.mock(),
      processingDatabase: db,
      knex: {} as any,
      orchestrator: orchestrator,
      stitcher: stitcher,
      createHash: () => hash,
      pollingIntervalMs: 100,
    });

    db.transaction.mockImplementation(cb => cb((() => {}) as any));

    const entity = {
      apiVersion: '1',
      kind: 'k',
      metadata: { name: 'me', namespace: 'ns' },
    };
    const processableEntity = {
      entityRef: 'foo',
      id: '1',
      unprocessedEntity: entity,
      resultHash: '',
      state: [] as any,
      nextUpdateAt: DateTime.now(),
      lastDiscoveryAt: DateTime.now(),
    };

    db.listParents.mockResolvedValue({ entityRefs: [] });
    db.getProcessableEntities
      .mockResolvedValueOnce({
        items: [processableEntity],
      })
      .mockResolvedValueOnce({
        items: [processableEntity],
      });
    db.updateProcessedEntity
      .mockImplementationOnce(async () => ({
        previous: { relations: [] },
      }))
      .mockImplementationOnce(async () => ({
        previous: {
          relations: [
            {
              originating_entity_id: '',
              type: 't',
              source_entity_ref: 'k:ns/other1',
              target_entity_ref: 'k:ns/me',
            },
          ],
        },
      }));

    orchestrator.process
      .mockResolvedValueOnce({
        ok: true,
        completedEntity: entity,
        relations: [
          {
            type: 't',
            source: { kind: 'k', namespace: 'ns', name: 'other1' },
            target: { kind: 'k', namespace: 'ns', name: 'me' },
          },
        ],
        errors: [],
        deferredEntities: [],
        state: {},
        refreshKeys: [],
      })
      .mockResolvedValueOnce({
        ok: true,
        completedEntity: entity,
        // change just the target of the relationship to a new entity,
        // leaving the source and relation type the same.
        // see: https://github.com/backstage/backstage/issues/27325
        relations: [
          {
            type: 't',
            source: { kind: 'k', namespace: 'ns', name: 'other1' },
            target: { kind: 'k', namespace: 'ns', name: 'newtarget' },
          },
        ],
        errors: [],
        deferredEntities: [],
        state: {},
        refreshKeys: [],
      });

    await engine.start();
    await waitForExpect(() => {
      expect(stitcher.stitch).toHaveBeenCalledTimes(2);
    });
    expect([...stitcher.stitch.mock.calls[0][0].entityRefs!]).toEqual(
      expect.arrayContaining(['k:ns/me', 'k:ns/other1']),
    );
    // As a result of switching the relationship for source other1 to
    // a new target entity, the other1 relationship source must be
    // restitched.
    expect([...stitcher.stitch.mock.calls[1][0].entityRefs!]).toEqual(
      expect.arrayContaining(['k:ns/me', 'k:ns/other1']),
    );
    await engine.stop();
  });

  it('should not stitch sources entities when relations are the same', async () => {
    const engine = new DefaultCatalogProcessingEngine({
      config: new ConfigReader({}),
      logger: mockServices.logger.mock(),
      processingDatabase: db,
      knex: {} as any,
      orchestrator: orchestrator,
      stitcher: stitcher,
      createHash: () => hash,
      pollingIntervalMs: 100,
    });

    db.transaction.mockImplementation(cb => cb((() => {}) as any));

    const entity = {
      apiVersion: '1',
      kind: 'k',
      metadata: { name: 'me', namespace: 'ns' },
    };
    const processableEntity = {
      entityRef: 'foo',
      id: '1',
      unprocessedEntity: entity,
      resultHash: '',
      state: [] as any,
      nextUpdateAt: DateTime.now(),
      lastDiscoveryAt: DateTime.now(),
    };

    db.listParents.mockResolvedValue({ entityRefs: [] });
    db.getProcessableEntities.mockResolvedValueOnce({
      items: [processableEntity],
    });
    db.updateProcessedEntity.mockImplementationOnce(async () => ({
      previous: {
        relations: [
          {
            originating_entity_id: '',
            type: 't',
            source_entity_ref: 'k:ns/other1',
            target_entity_ref: 'k:ns/me',
          },
          {
            originating_entity_id: '',
            type: 't',
            source_entity_ref: 'k:ns/other2',
            target_entity_ref: 'k:ns/me',
          },
        ],
      },
    }));

    orchestrator.process.mockResolvedValueOnce({
      ok: true,
      completedEntity: entity,
      relations: [
        {
          type: 't',
          source: { kind: 'k', namespace: 'ns', name: 'other1' },
          target: { kind: 'k', namespace: 'ns', name: 'me' },
        },
        {
          type: 't',
          source: { kind: 'k', namespace: 'ns', name: 'other2' },
          target: { kind: 'k', namespace: 'ns', name: 'me' },
        },
      ],
      errors: [],
      deferredEntities: [],
      state: {},
      refreshKeys: [],
    });

    await engine.start();
    await waitForExpect(() => {
      expect(stitcher.stitch).toHaveBeenCalledTimes(1);
    });
    expect([...stitcher.stitch.mock.calls[0][0].entityRefs!]).toEqual(
      expect.arrayContaining(['k:ns/me']),
    );
    await engine.stop();
  });

  it('should stitch sources entities when new relation of different type added', async () => {
    const engine = new DefaultCatalogProcessingEngine({
      config: new ConfigReader({}),
      logger: mockServices.logger.mock(),
      processingDatabase: db,
      knex: {} as any,
      orchestrator: orchestrator,
      stitcher: stitcher,
      createHash: () => hash,
      pollingIntervalMs: 100,
    });

    db.transaction.mockImplementation(cb => cb((() => {}) as any));

    const entity = {
      apiVersion: '1',
      kind: 'k',
      metadata: { name: 'me', namespace: 'ns' },
    };
    const processableEntity = {
      entityRef: 'foo',
      id: '1',
      unprocessedEntity: entity,
      resultHash: '',
      state: [] as any,
      nextUpdateAt: DateTime.now(),
      lastDiscoveryAt: DateTime.now(),
    };

    db.listParents.mockResolvedValue({ entityRefs: [] });
    db.getProcessableEntities.mockResolvedValueOnce({
      items: [processableEntity],
    });
    db.updateProcessedEntity.mockImplementationOnce(async () => ({
      previous: {
        relations: [
          {
            originating_entity_id: '',
            type: 't',
            source_entity_ref: 'k:ns/other1',
            target_entity_ref: 'k:ns/me',
          },
          {
            originating_entity_id: '',
            type: 't',
            source_entity_ref: 'k:ns/other2',
            target_entity_ref: 'k:ns/me',
          },
        ],
      },
    }));

    orchestrator.process.mockResolvedValueOnce({
      ok: true,
      completedEntity: entity,
      relations: [
        {
          type: 't',
          source: { kind: 'k', namespace: 'ns', name: 'other1' },
          target: { kind: 'k', namespace: 'ns', name: 'me' },
        },
        {
          type: 't',
          source: { kind: 'k', namespace: 'ns', name: 'other2' },
          target: { kind: 'k', namespace: 'ns', name: 'me' },
        },
        {
          type: 'u',
          source: { kind: 'k', namespace: 'ns', name: 'other2' },
          target: { kind: 'k', namespace: 'ns', name: 'me' },
        },
      ],
      errors: [],
      deferredEntities: [],
      state: {},
      refreshKeys: [],
    });

    await engine.start();
    await waitForExpect(() => {
      expect(stitcher.stitch).toHaveBeenCalledTimes(1);
    });
    expect([...stitcher.stitch.mock.calls[0][0].entityRefs!]).toEqual(
      expect.arrayContaining(['k:ns/me', 'k:ns/other2']),
    );
    await engine.stop();
  });

  it('should stitch sources entities when relation is removed', async () => {
    const engine = new DefaultCatalogProcessingEngine({
      config: new ConfigReader({}),
      logger: mockServices.logger.mock(),
      processingDatabase: db,
      knex: {} as any,
      orchestrator: orchestrator,
      stitcher: stitcher,
      createHash: () => hash,
      pollingIntervalMs: 100,
    });

    db.transaction.mockImplementation(cb => cb((() => {}) as any));

    const entity = {
      apiVersion: '1',
      kind: 'k',
      metadata: { name: 'me', namespace: 'ns' },
    };
    const processableEntity = {
      entityRef: 'foo',
      id: '1',
      unprocessedEntity: entity,
      resultHash: '',
      state: [] as any,
      nextUpdateAt: DateTime.now(),
      lastDiscoveryAt: DateTime.now(),
    };

    db.listParents.mockResolvedValue({ entityRefs: [] });
    db.getProcessableEntities.mockResolvedValueOnce({
      items: [processableEntity],
    });
    db.updateProcessedEntity.mockImplementationOnce(async () => ({
      previous: {
        relations: [
          {
            originating_entity_id: '',
            type: 't',
            source_entity_ref: 'k:ns/other1',
            target_entity_ref: 'k:ns/me',
          },
          {
            originating_entity_id: '',
            type: 't',
            source_entity_ref: 'k:ns/other2',
            target_entity_ref: 'k:ns/me',
          },
        ],
      },
    }));

    orchestrator.process.mockResolvedValueOnce({
      ok: true,
      completedEntity: entity,
      relations: [
        {
          type: 't',
          source: { kind: 'k', namespace: 'ns', name: 'other1' },
          target: { kind: 'k', namespace: 'ns', name: 'me' },
        },
      ],
      errors: [],
      deferredEntities: [],
      state: {},
      refreshKeys: [],
    });

    await engine.start();
    await waitForExpect(() => {
      expect(stitcher.stitch).toHaveBeenCalledTimes(1);
    });
    expect([...stitcher.stitch.mock.calls[0][0].entityRefs!]).toEqual(
      expect.arrayContaining(['k:ns/me', 'k:ns/other2']),
    );
    await engine.stop();
  });
});
