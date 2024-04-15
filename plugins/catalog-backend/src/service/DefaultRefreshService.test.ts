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

import {
  mockCredentials,
  mockServices,
  TestDatabaseId,
  TestDatabases,
} from '@backstage/backend-test-utils';
import { Entity, stringifyEntityRef } from '@backstage/catalog-model';
import { createHash } from 'crypto';
import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';
import { DefaultCatalogDatabase } from '../database/DefaultCatalogDatabase';
import { DefaultProcessingDatabase } from '../database/DefaultProcessingDatabase';
import { applyDatabaseMigrations } from '../database/migrations';
import {
  DbRefreshStateReferencesRow,
  DbRefreshStateRow,
} from '../database/tables';
import { ProcessingDatabase } from '../database/types';
import { DefaultCatalogProcessingEngine } from '../processing/DefaultCatalogProcessingEngine';
import { EntityProcessingRequest } from '../processing/types';
import { DefaultRefreshService } from './DefaultRefreshService';
import { ConfigReader } from '@backstage/config';
import { DefaultStitcher } from '../stitching/DefaultStitcher';
import { LoggerService } from '@backstage/backend-plugin-api';

jest.setTimeout(60_000);

describe('DefaultRefreshService', () => {
  const defaultLogger = mockServices.logger.mock();
  const databases = TestDatabases.create();

  async function createDatabase(
    databaseId: TestDatabaseId,
    logger: LoggerService = defaultLogger,
  ) {
    const knex = await databases.init(databaseId);
    await applyDatabaseMigrations(knex);
    return {
      knex,
      processingDb: new DefaultProcessingDatabase({
        database: knex,
        logger,
        refreshInterval: () => 100,
      }),
      catalogDb: new DefaultCatalogDatabase({
        database: knex,
        logger,
      }),
    };
  }

  const createPopulatedEngine = async (options: {
    db: ProcessingDatabase;
    knex: Knex;
    entities: Entity[];
    references: { [source: string]: string[] };
    entityProcessor?: (entity: Entity) => void;
  }) => {
    const { db, knex, entities, references, entityProcessor } = options;

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

    const entitiesWithParent = new Set(Object.values(references).flat());
    for (const entityRef of entityMap.keys()) {
      if (!entitiesWithParent.has(entityRef)) {
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

    const stitcher = DefaultStitcher.fromConfig(new ConfigReader({}), {
      knex,
      logger: defaultLogger,
    });
    const engine = new DefaultCatalogProcessingEngine({
      config: new ConfigReader({}),
      logger: defaultLogger,
      processingDatabase: db,
      knex: knex,
      stitcher: stitcher,
      orchestrator: {
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

          entityProcessor?.(entity);

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
            state: {},
            refreshKeys: [],
          };
        },
      },
      createHash: () => createHash('sha1'),
      pollingIntervalMs: 50,
    });

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
        // Reset the annotation so that we can run another verification
        delete entity.metadata.annotations['refresh-completed'];
        await knex<DbRefreshStateRow>('refresh_state')
          .update({
            processed_entity: JSON.stringify(entity),
          })
          .where('entity_ref', entityRef);
        return true;
      }
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  it.each(databases.eachSupportedId())(
    'should refresh the parent location, %p',
    async databaseId => {
      const { knex, processingDb, catalogDb } =
        await createDatabase(databaseId);
      const refreshService = new DefaultRefreshService({ database: catalogDb });
      const engine = await createPopulatedEngine({
        db: processingDb,
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

      await refreshService.refresh({
        entityRef: 'component:default/mycomp',
        credentials: mockCredentials.none(),
      });

      await expect(
        waitForRefresh(knex, 'location:default/myloc'),
      ).resolves.toBe(true);

      await engine.stop();
    },
  );

  it.each(databases.eachSupportedId())(
    'should refresh the location further up the tree, %p',
    async databaseId => {
      const { knex, processingDb, catalogDb } =
        await createDatabase(databaseId);
      const refreshService = new DefaultRefreshService({ database: catalogDb });
      const engine = await createPopulatedEngine({
        db: processingDb,
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

      await refreshService.refresh({
        entityRef: 'api:default/myapi',
        credentials: mockCredentials.none(),
      });

      await expect(waitForRefresh(knex, 'api:default/myapi')).resolves.toBe(
        true,
      );

      await engine.stop();
    },
  );

  it.each(databases.eachSupportedId())(
    'should refresh even when parent has no changes',
    async databaseId => {
      let secondRound = false;
      const { knex, processingDb, catalogDb } =
        await createDatabase(databaseId);
      const refreshService = new DefaultRefreshService({ database: catalogDb });
      const engine = await createPopulatedEngine({
        db: processingDb,
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
        entityProcessor: entity => {
          if (entity.metadata.name === 'mycomp' && secondRound) {
            entity.apiVersion = '2.0.0';
          }
        },
      });

      await engine.start();

      await refreshService.refresh({
        entityRef: 'component:default/mycomp',
        credentials: mockCredentials.none(),
      });

      await expect(
        waitForRefresh(knex, 'component:default/mycomp'),
      ).resolves.toBe(true);

      secondRound = true;

      await refreshService.refresh({
        entityRef: 'component:default/mycomp',
        credentials: mockCredentials.none(),
      });

      await expect(
        waitForRefresh(knex, 'component:default/mycomp'),
      ).resolves.toBe(true);

      await engine.stop();
    },
  );
});
