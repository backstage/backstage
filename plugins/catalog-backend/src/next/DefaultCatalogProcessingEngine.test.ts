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
import { TestDatabaseId, TestDatabases } from '@backstage/backend-test-utils';
import { createHash, Hash } from 'crypto';
import { Knex } from 'knex';
import { Logger } from 'winston';
import { DateTime } from 'luxon';
import { DatabaseManager } from './database/DatabaseManager';
import waitForExpect from 'wait-for-expect';
import { DefaultProcessingDatabase } from './database/DefaultProcessingDatabase';
import {
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
} from './database/tables';
import { ProcessingDatabase } from './database/types';
import { DefaultCatalogProcessingEngine } from './DefaultCatalogProcessingEngine';
import {
  CatalogProcessingOrchestrator,
  EntityProcessingRequest,
} from './processing/types';
import { Stitcher } from './stitching/Stitcher';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { v4 as uuid } from 'uuid';

describe('DefaultCatalogProcessingEngine', () => {
  const db = {
    transaction: jest.fn(),
    getProcessableEntities: jest.fn(),
    updateProcessedEntity: jest.fn(),
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
      state: new Map(),
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
            state: new Map(),
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
        state: expect.anything(),
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
      state: new Map(),
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
            state: new Map(),
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
        state: expect.anything(),
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
      state: new Map(),
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
      state: new Map(),
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

    db.getProcessableEntities
      .mockReset()
      .mockResolvedValueOnce({ items: [refreshState] })
      .mockResolvedValue({ items: [] });

    await waitForExpect(() => {
      expect(orchestrator.process).toBeCalledTimes(2);
      expect(hash.digest).toBeCalledTimes(2);
      expect(db.updateProcessedEntity).toBeCalledTimes(1);
    });

    await engine.stop();
  });
});

describe('DefaultCatalogProcessingEngine integration', () => {
  const defaultLogger = getVoidLogger();
  const databases = TestDatabases.create({
    ids: ['POSTGRES_13', 'POSTGRES_9', 'SQLITE_3'],
  });

  async function createDatabase(
    databaseId: TestDatabaseId,
    logger: Logger = defaultLogger,
  ) {
    const knex = await databases.init(databaseId);
    await DatabaseManager.createDatabase(knex);
    return {
      knex,
      db: new DefaultProcessingDatabase({
        database: knex,
        logger,
        refreshInterval: () => 100,
      }),
    };
  }

  const createPopulatedEngine = async (options: {
    db: ProcessingDatabase;
    knex: Knex;
    entities: Entity[];
    references: { [source: string]: string[] };
  }) => {
    const { db, knex, entities, references } = options;

    const entityMap = new Map(
      entities.map(entity => [stringifyEntityRef(entity), entity]),
    );

    for (const entity of entities) {
      await knex<DbRefreshStateRow>('refresh_state').insert({
        entity_id: uuid(),
        entity_ref: stringifyEntityRef(entity),
        unprocessed_entity: JSON.stringify(entity),
        errors: '[]',
        next_update_at: '2031-01-01 23:00:00',
        last_discovery_at: '2021-04-01 13:37:00',
      });
    }

    for (const entityRef of entityMap.keys()) {
      if (!(entityRef in references)) {
        await knex<DbRefreshStateReferencesRow>(
          'refresh_state_references',
        ).insert({
          source_key: 'ConfigLocationProvider',
          target_entity_ref: entityRef,
        });
      }
    }
    for (const [sourceRef, targetRefs] of Object.entries(references)) {
      for (const targetRef of targetRefs) {
        await knex<DbRefreshStateReferencesRow>(
          'refresh_state_references',
        ).insert({
          source_entity_ref: sourceRef,
          target_entity_ref: targetRef,
        });
      }
    }

    const engine = new DefaultCatalogProcessingEngine(
      defaultLogger,
      [],
      db,
      {
        async process(request: EntityProcessingRequest) {
          const entityRef = stringifyEntityRef(request.entity);
          const entity = entityMap.get(entityRef);
          if (!entity) {
            throw new Error(`Unexpected entity: ${entityRef}`);
          }
          const deferredEntities =
            references[entityRef]?.map(ref => {
              const e = entityMap.get(ref);
              if (!e) {
                throw new Error(`Target entity not found: ${ref}`);
              }
              return { entity: e, locationKey: ref };
            }) || [];

          return {
            ok: true,
            completedEntity: {
              ...entity,
              metadata: {
                ...entity.metadata,
                annotations: {
                  ...entity.metadata.annotations,
                  'refresh-completed': 'true',
                },
              },
            },
            relations: [],
            errors: [],
            deferredEntities,
            state: new Map(),
          };
        },
      },
      new Stitcher(knex, defaultLogger),
      () => createHash('sha1'),
      50,
    );

    return engine;
  };

  const waitForRefresh = async (knex: Knex, entityRef: string) => {
    for (;;) {
      const [result] = await knex<DbRefreshStateRow>('refresh_state')
        .where('entity_ref', entityRef)
        .select();

      const entity = result.processed_entity
        ? (JSON.parse(result.processed_entity) as Entity)
        : undefined;
      if (entity?.metadata?.annotations?.['refresh-completed']) {
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  it.each(databases.eachSupportedId())(
    'should refresh the parent location, %p',
    async databaseId => {
      const { knex, db } = await createDatabase(databaseId);

      const engine = await createPopulatedEngine({
        db,
        knex,
        entities: [
          {
            kind: 'Location',
            apiVersion: '1.0.0',
            metadata: {
              name: 'myloc',
            },
          },
          {
            kind: 'Component',
            apiVersion: '1.0.0',
            metadata: {
              name: 'mycomp',
            },
          },
        ],
        references: {
          'location:default/myloc': ['component:default/mycomp'],
        },
      });

      await engine.start();

      await engine.refresh({
        entityRef: 'component:default/mycomp',
      });

      await expect(
        waitForRefresh(knex, 'component:default/mycomp'),
      ).resolves.toBe(true);

      await engine.stop();
    },
  );

  it.each(databases.eachSupportedId())(
    'should refresh the location further up the tree, %p',
    async databaseId => {
      const { knex, db } = await createDatabase(databaseId);

      const engine = await createPopulatedEngine({
        db,
        knex,
        entities: [
          {
            kind: 'Location',
            apiVersion: '1.0.0',
            metadata: {
              name: 'myloc',
            },
          },
          {
            kind: 'Component',
            apiVersion: '1.0.0',
            metadata: {
              name: 'mycomp',
            },
          },
          {
            kind: 'Api',
            apiVersion: '1.0.0',
            metadata: {
              name: 'myapi',
            },
          },
        ],
        references: {
          'location:default/myloc': ['component:default/mycomp'],
          'component:default/mycomp': ['api:default/myapi'],
        },
      });

      await engine.start();

      await engine.refresh({
        entityRef: 'api:default/myapi',
      });

      await expect(waitForRefresh(knex, 'api:default/myapi')).resolves.toBe(
        true,
      );

      await engine.stop();
    },
  );
});
