/*
 * Copyright 2022 The Backstage Authors
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
  Entity,
  EntityPolicies,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { ConfigReader } from '@backstage/config';
import { InputError } from '@backstage/errors';
import { ScmIntegrations } from '@backstage/integration';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  CatalogProcessorEmit,
  EntityProvider,
  EntityProviderConnection,
  processingResult,
} from '@backstage/plugin-catalog-node';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import { createHash } from 'crypto';
import { Knex } from 'knex';
import merge from 'lodash/merge';
import { EntitiesCatalog } from '../catalog/types';
import { DefaultCatalogDatabase } from '../database/DefaultCatalogDatabase';
import { DefaultProcessingDatabase } from '../database/DefaultProcessingDatabase';
import { DefaultProviderDatabase } from '../database/DefaultProviderDatabase';
import { applyDatabaseMigrations } from '../database/migrations';
import { RefreshStateItem } from '../database/types';
import { DefaultCatalogRulesEnforcer } from '../ingestion/CatalogRules';
import { defaultEntityDataParser } from '../util/parse';
import {
  DefaultCatalogProcessingEngine,
  ProgressTracker,
} from '../processing/DefaultCatalogProcessingEngine';
import { DefaultCatalogProcessingOrchestrator } from '../processing/DefaultCatalogProcessingOrchestrator';
import { connectEntityProviders } from '../processing/connectEntityProviders';
import { CatalogProcessingEngine } from '../processing';
import { DefaultEntitiesCatalog } from '../service/DefaultEntitiesCatalog';
import { DefaultRefreshService } from '../service/DefaultRefreshService';
import { RefreshOptions, RefreshService } from '../service/types';
import { DefaultStitcher } from '../stitching/DefaultStitcher';
import { mockServices } from '@backstage/backend-test-utils';
import { LoggerService } from '@backstage/backend-plugin-api';
import { DatabaseManager } from '@backstage/backend-common';
import { entitiesResponseToObjects } from '../service/response';
import { deleteOrphanedEntities } from '../database/operations/util/deleteOrphanedEntities';

const voidLogger = mockServices.logger.mock();

type ProgressTrackerWithErrorReports = ProgressTracker & {
  reportError(unprocessedEntity: Entity, errors: Error[]): void;
};

class TestProvider implements EntityProvider {
  readonly #name: string;
  #connection?: EntityProviderConnection;

  constructor(name: string = 'test') {
    this.#name = name;
  }

  getProviderName(): string {
    return this.#name;
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    this.#connection = connection;
  }

  getConnection() {
    if (!this.#connection) {
      throw new Error('Provider is not connected yet');
    }
    return this.#connection;
  }
}

class ProxyProgressTracker implements ProgressTrackerWithErrorReports {
  #inner: ProgressTrackerWithErrorReports;

  constructor(inner: ProgressTrackerWithErrorReports) {
    this.#inner = inner;
  }

  processStart(item: RefreshStateItem) {
    return this.#inner.processStart(item, voidLogger);
  }

  setTracker(tracker: ProgressTrackerWithErrorReports) {
    this.#inner = tracker;
  }

  reportError(unprocessedEntity: Entity, errors: Error[]): void {
    this.#inner.reportError(unprocessedEntity, errors);
  }
}

class NoopProgressTracker implements ProgressTrackerWithErrorReports {
  static emptyTracking = {
    markFailed() {},
    markProcessorsCompleted() {},
    markSuccessfulWithChanges() {},
    markSuccessfulWithErrors() {},
    markSuccessfulWithNoChanges() {},
  };

  processStart() {
    return NoopProgressTracker.emptyTracking;
  }

  reportError() {}
}

class WaitingProgressTracker implements ProgressTrackerWithErrorReports {
  #resolve: (errors: Record<string, Error[]>) => void;
  #promise: Promise<Record<string, Error[]>>;
  #counts = new Map<string, number>();
  #errors = new Map<string, Error[]>();
  #inFlight = new Array<Promise<void>>();

  constructor(private readonly entityRefs?: Set<string>) {
    let resolve: (errors: Record<string, Error[]>) => void;
    this.#promise = new Promise<Record<string, Error[]>>(_resolve => {
      resolve = _resolve;
    });
    this.#resolve = resolve!;
  }

  processStart(item: RefreshStateItem) {
    if (this.entityRefs && !this.entityRefs.has(item.entityRef)) {
      return NoopProgressTracker.emptyTracking;
    }

    let resolve: () => void;
    this.#inFlight.push(
      new Promise<void>(_resolve => {
        resolve = _resolve;
      }),
    );

    const currentCount = this.#counts.get(item.id) ?? 0;
    this.#counts.set(item.id, currentCount);

    const onDone = () => {
      this.#counts.set(item.id, currentCount + 1);

      if (Array.from(this.#counts.values()).every(c => c >= 2)) {
        this.#resolve(Object.fromEntries(this.#errors));
      }
    };
    return {
      markFailed: (error: Error) => {
        this.#errors.set(item.entityRef, [error]);
        onDone();
        resolve();
      },
      markProcessorsCompleted() {},
      markSuccessfulWithChanges: () => {
        this.#errors.delete(item.entityRef);
        this.#counts.set(item.id, 0);
        resolve();
      },
      markSuccessfulWithErrors: () => {
        onDone();
        resolve();
      },
      markSuccessfulWithNoChanges: () => {
        onDone();
        resolve();
      },
    };
  }

  reportError(unprocessedEntity: Entity, errors: Error[]): void {
    this.#errors.set(stringifyEntityRef(unprocessedEntity), errors);
  }

  async wait(): Promise<Record<string, Error[]>> {
    return this.#promise;
  }

  async waitForFinish(): Promise<void> {
    await Promise.all(this.#inFlight.slice());
  }
}

class TestHarness {
  readonly #catalog: EntitiesCatalog;
  readonly #engine: CatalogProcessingEngine;
  readonly #refresh: RefreshService;
  readonly #provider: TestProvider;
  readonly #proxyProgressTracker: ProxyProgressTracker;
  readonly #db: Knex;

  static async create(options?: {
    disableRelationsCompatibility?: boolean;
    logger?: LoggerService;
    db?: Knex;
    permissions?: PermissionEvaluator;
    additionalProviders?: EntityProvider[];
    processEntity?(
      entity: Entity,
      location: LocationSpec,
      emit: CatalogProcessorEmit,
    ): Promise<Entity>;
  }) {
    const config = new ConfigReader({
      backend: {
        database: {
          client: 'better-sqlite3',
          connection: ':memory:',
        },
      },
      catalog: {
        stitchingStrategy: {
          mode: 'immediate',
        },
      },
    });
    const logger = options?.logger ?? mockServices.logger.mock();
    const db =
      options?.db ??
      (await DatabaseManager.fromConfig(config, { logger })
        .forPlugin('catalog')
        .getClient());

    await applyDatabaseMigrations(db);

    const catalogDatabase = new DefaultCatalogDatabase({
      database: db,
      logger,
    });
    const providerDatabase = new DefaultProviderDatabase({
      database: db,
      logger,
    });
    const processingDatabase = new DefaultProcessingDatabase({
      database: db,
      logger,
      refreshInterval: () => 0.05,
    });

    const integrations = ScmIntegrations.fromConfig(config);
    const rulesEnforcer = DefaultCatalogRulesEnforcer.fromConfig(config);
    const orchestrator = new DefaultCatalogProcessingOrchestrator({
      processors: [
        {
          getProcessorName: () => 'test',
          async validateEntityKind() {
            return true;
          },
          async preProcessEntity(
            entity: Entity,
            location: LocationSpec,
            emit: CatalogProcessorEmit,
          ) {
            if (options?.processEntity) {
              return options?.processEntity(entity, location, emit);
            }
            return entity;
          },
        },
      ],
      integrations,
      rulesEnforcer,
      logger,
      parser: defaultEntityDataParser,
      policy: EntityPolicies.allOf([]),
      legacySingleProcessorValidation: false,
    });
    const stitcher = DefaultStitcher.fromConfig(config, { knex: db, logger });
    const catalog = new DefaultEntitiesCatalog({
      database: db,
      logger,
      stitcher,
      disableRelationsCompatibility: options?.disableRelationsCompatibility,
    });
    const proxyProgressTracker = new ProxyProgressTracker(
      new NoopProgressTracker(),
    );

    const engine = new DefaultCatalogProcessingEngine({
      config: new ConfigReader({}),
      logger,
      processingDatabase,
      knex: db,
      orchestrator,
      stitcher,
      createHash: () => createHash('sha1'),
      pollingIntervalMs: 50,
      onProcessingError: event => {
        proxyProgressTracker.reportError(event.unprocessedEntity, event.errors);
      },
      tracker: proxyProgressTracker,
    });

    const refresh = new DefaultRefreshService({ database: catalogDatabase });

    const provider = new TestProvider();
    const providers: EntityProvider[] = [provider];

    if (options?.additionalProviders) {
      providers.push(...options.additionalProviders);
    }

    await connectEntityProviders(providerDatabase, providers);

    return new TestHarness(
      catalog,
      {
        async start() {
          await engine.start();
          await stitcher.start();
        },
        async stop() {
          await engine.stop();
          await stitcher.stop();
        },
      },
      refresh,
      provider,
      proxyProgressTracker,
      db,
    );
  }

  constructor(
    catalog: EntitiesCatalog,
    engine: CatalogProcessingEngine,
    refresh: RefreshService,
    provider: TestProvider,
    proxyProgressTracker: ProxyProgressTracker,
    db: Knex,
  ) {
    this.#catalog = catalog;
    this.#engine = engine;
    this.#refresh = refresh;
    this.#provider = provider;
    this.#proxyProgressTracker = proxyProgressTracker;
    this.#db = db;
  }

  async process(entityRefs?: Set<string>) {
    const tracker = new WaitingProgressTracker(entityRefs);
    this.#proxyProgressTracker.setTracker(tracker);

    this.#engine.start();

    const errors = await tracker.wait();

    this.#engine.stop();
    await tracker.waitForFinish();

    this.#proxyProgressTracker.setTracker(new NoopProgressTracker());

    return errors;
  }

  async setInputEntities(entities: (Entity & { locationKey?: string })[]) {
    await this.#provider.getConnection().applyMutation({
      type: 'full',
      entities: entities.map(({ locationKey, ...entity }) => ({
        entity,
        locationKey,
      })),
    });
  }

  async getOutputEntities(): Promise<Record<string, Entity>> {
    const { entities } = await this.#catalog.entities();
    return Object.fromEntries(
      entitiesResponseToObjects(entities).map(e => [
        stringifyEntityRef(e!),
        e!,
      ]),
    );
  }

  async refresh(options: RefreshOptions) {
    return this.#refresh.refresh(options);
  }

  async removeOrphanedEntities() {
    await deleteOrphanedEntities({
      knex: this.#db,
      strategy: { mode: 'immediate' },
    });
  }

  async getRefreshState(): Promise<
    Record<
      string,
      {
        id: string;
        unprocessedEntity: Entity;
        processedEntity: Entity;
        locationKey: string | null;
      }
    >
  > {
    const result = await this.#db('refresh_state').select('*');
    return Object.fromEntries(
      result.map(r => [
        r.entity_ref,
        {
          id: r.entity_id,
          unprocessedEntity: JSON.parse(r.unprocessed_entity),
          processedEntity: r.processed_entity
            ? JSON.parse(r.processed_entity)
            : undefined,
          locationKey: r.location_key,
        },
      ]),
    );
  }

  async getRefreshStateReferences(): Promise<
    Array<{
      sourceKey: string | null;
      sourceEntityRef: string | null;
      targetEntityRef: string;
    }>
  > {
    const result = await this.#db('refresh_state_references').select('*');
    return result.map(r => ({
      sourceKey: r.source_key ?? undefined,
      sourceEntityRef: r.source_entity_ref ?? undefined,
      targetEntityRef: r.target_entity_ref,
    }));
  }
}

describe('Catalog Backend Integration', () => {
  it('should add entities and update errors', async () => {
    let triggerError = false;

    const harness = await TestHarness.create({
      async processEntity(entity: Entity) {
        if (triggerError) {
          throw new Error('NOPE');
        }
        return entity;
      },
    });

    await harness.setInputEntities([
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'test',
          annotations: {
            'backstage.io/managed-by-location': 'url:.',
            'backstage.io/managed-by-origin-location': 'url:.',
          },
        },
      },
    ]);

    await expect(harness.getOutputEntities()).resolves.toEqual({});
    await expect(harness.process()).resolves.toEqual({});

    await expect(harness.getOutputEntities()).resolves.toEqual({
      'component:default/test': {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: expect.objectContaining({ name: 'test' }),
        relations: [],
      },
    });

    triggerError = true;

    await expect(harness.process()).resolves.toEqual({
      'component:default/test': [
        new InputError(
          'Processor Object threw an error while preprocessing; caused by Error: NOPE',
        ),
      ],
    });

    await expect(harness.getOutputEntities()).resolves.toEqual({
      'component:default/test': {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: expect.objectContaining({ name: 'test' }),
        relations: [],
        status: {
          items: [
            {
              level: 'error',
              type: 'backstage.io/catalog-processing',
              message:
                'InputError: Processor Object threw an error while preprocessing; caused by Error: NOPE',
              error: {
                name: 'InputError',
                message:
                  'Processor Object threw an error while preprocessing; caused by Error: NOPE',
                cause: {
                  name: 'Error',
                  message: 'NOPE',
                },
              },
            },
          ],
        },
      },
    });
  });

  it('should orphan entities', async () => {
    const generatedApis = ['api-1', 'api-2'];

    const harness = await TestHarness.create({
      async processEntity(
        entity: Entity,
        location: LocationSpec,
        emit: CatalogProcessorEmit,
      ) {
        if (entity.metadata.name === 'test') {
          for (const api of generatedApis) {
            emit(
              processingResult.entity(location, {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'API',
                metadata: {
                  name: api,
                  annotations: {
                    'backstage.io/managed-by-location': 'url:.',
                    'backstage.io/managed-by-origin-location': 'url:.',
                  },
                },
              }),
            );
          }
        }
        return entity;
      },
    });

    await harness.setInputEntities([
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'test',
          annotations: {
            'backstage.io/managed-by-location': 'url:.',
            'backstage.io/managed-by-origin-location': 'url:.',
          },
        },
      },
    ]);

    await expect(harness.getOutputEntities()).resolves.toEqual({});
    await expect(harness.process()).resolves.toEqual({});

    await expect(harness.getOutputEntities()).resolves.toEqual({
      'component:default/test': {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: expect.objectContaining({ name: 'test' }),
        relations: [],
      },
      'api:default/api-1': expect.objectContaining({
        metadata: expect.objectContaining({ name: 'api-1' }),
      }),
      'api:default/api-2': expect.objectContaining({
        metadata: expect.objectContaining({ name: 'api-2' }),
      }),
    });

    generatedApis.pop();

    await expect(harness.process()).resolves.toEqual({});

    await expect(harness.getOutputEntities()).resolves.toEqual({
      'component:default/test': {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: expect.objectContaining({ name: 'test' }),
        relations: [],
      },
      'api:default/api-1': expect.objectContaining({
        metadata: expect.objectContaining({ name: 'api-1' }),
      }),
      'api:default/api-2': expect.objectContaining({
        metadata: expect.objectContaining({
          name: 'api-2',
          annotations: expect.objectContaining({
            'backstage.io/orphan': 'true',
          }),
        }),
      }),
    });
  });

  it('should not replace matching provided entities', async () => {
    const harness = await TestHarness.create();

    const entityA = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'a',
        annotations: {
          'backstage.io/managed-by-location': 'url:.',
          'backstage.io/managed-by-origin-location': 'url:.',
        },
      },
    };
    const entityB = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'b',
        annotations: {
          'backstage.io/managed-by-location': 'url:.',
          'backstage.io/managed-by-origin-location': 'url:.',
        },
      },
    };

    const entities = [entityA, { locationKey: 'loc', ...entityB }];

    await harness.setInputEntities(entities);
    await expect(harness.process()).resolves.toEqual({});

    const outputEntities = await harness.getOutputEntities();

    await expect(harness.getOutputEntities()).resolves.toEqual({
      'component:default/a': expect.anything(),
      'component:default/b': expect.anything(),
    });

    await harness.setInputEntities(entities);
    await expect(harness.process()).resolves.toEqual({});

    await expect(harness.getOutputEntities()).resolves.toEqual(outputEntities);
  });

  // NOTE(freben): This test documents existing behavior, but it would be more correct to mark the cycle as orphans
  it('leaves behind orphaned cycles without orphan markers', async () => {
    function mkEntity(name: string) {
      return {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name,
          annotations: {
            'backstage.io/managed-by-location': 'url:.',
            'backstage.io/managed-by-origin-location': 'url:.',
          },
        },
      };
    }

    const harness = await TestHarness.create({
      async processEntity(
        entity: Entity,
        location: LocationSpec,
        emit: CatalogProcessorEmit,
      ) {
        if (entity.spec?.noEmit) {
          return entity;
        }
        switch (entity.metadata.name) {
          case 'a':
            emit(processingResult.entity(location, mkEntity('b')));
            break;
          case 'b':
            emit(processingResult.entity(location, mkEntity('c')));
            break;
          case 'c':
            emit(processingResult.entity(location, mkEntity('d')));
            break;
          case 'd':
            emit(processingResult.entity(location, mkEntity('b')));
            break;
          default:
        }
        return entity;
      },
    });

    await harness.setInputEntities([
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'a',
          annotations: {
            'backstage.io/managed-by-location': 'url:.',
            'backstage.io/managed-by-origin-location': 'url:.',
          },
        },
      },
    ]);

    await expect(harness.getOutputEntities()).resolves.toEqual({});
    await expect(harness.process()).resolves.toEqual({});

    await expect(harness.getOutputEntities()).resolves.toEqual({
      'component:default/a': expect.objectContaining({
        metadata: expect.objectContaining({ name: 'a' }),
      }),
      'component:default/b': expect.objectContaining({
        metadata: expect.objectContaining({ name: 'b' }),
      }),
      'component:default/c': expect.objectContaining({
        metadata: expect.objectContaining({ name: 'c' }),
      }),
      'component:default/d': expect.objectContaining({
        metadata: expect.objectContaining({ name: 'd' }),
      }),
    });
    // NOTE(freben): Avoid .toHaveProperty here, since it treats dots as path separators
    expect(
      (await harness.getOutputEntities())['component:default/b'].metadata
        .annotations!['backstage.io/orphan'],
    ).toBeUndefined();
    expect(
      (await harness.getOutputEntities())['component:default/c'].metadata
        .annotations!['backstage.io/orphan'],
    ).toBeUndefined();
    expect(
      (await harness.getOutputEntities())['component:default/d'].metadata
        .annotations!['backstage.io/orphan'],
    ).toBeUndefined();

    await harness.setInputEntities([
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'a',
          annotations: {
            'backstage.io/managed-by-location': 'url:.',
            'backstage.io/managed-by-origin-location': 'url:.',
          },
        },
        spec: { noEmit: true },
      },
    ]);

    await expect(harness.process()).resolves.toEqual({});

    await expect(harness.getOutputEntities()).resolves.toEqual({
      'component:default/a': expect.objectContaining({
        metadata: expect.objectContaining({ name: 'a' }),
      }),
      'component:default/b': expect.objectContaining({
        metadata: expect.objectContaining({ name: 'b' }),
      }),
      'component:default/c': expect.objectContaining({
        metadata: expect.objectContaining({ name: 'c' }),
      }),
      'component:default/d': expect.objectContaining({
        metadata: expect.objectContaining({ name: 'd' }),
      }),
    });
    // TODO(freben): Ideally these should be orphaned now
    expect(
      (await harness.getOutputEntities())['component:default/b'].metadata
        .annotations!['backstage.io/orphan'],
    ).toBeUndefined();
    expect(
      (await harness.getOutputEntities())['component:default/c'].metadata
        .annotations!['backstage.io/orphan'],
    ).toBeUndefined();
    expect(
      (await harness.getOutputEntities())['component:default/d'].metadata
        .annotations!['backstage.io/orphan'],
    ).toBeUndefined();
  });

  it('should reject insecure URLs', async () => {
    const harness = await TestHarness.create();

    await harness.setInputEntities([
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'test',
          annotations: {
            'backstage.io/managed-by-location': 'url:.',
            'backstage.io/managed-by-origin-location': 'url:.',
            'backstage.io/view-url': '       javascript:bad()',
            'backstage.io/edit-url': '       javascript:alert()',
          },
        },
      },
    ]);

    await expect(harness.process()).resolves.toEqual({});

    await expect(harness.getOutputEntities()).resolves.toEqual({
      'component:default/test': {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: expect.objectContaining({
          name: 'test',
          annotations: expect.objectContaining({
            'backstage.io/view-url':
              'https://backstage.io/annotation-rejected-for-security-reasons',
            'backstage.io/edit-url':
              'https://backstage.io/annotation-rejected-for-security-reasons',
          }),
        }),
        relations: [],
      },
    });
  });

  it('should reject insecure location URLs', async () => {
    const harness = await TestHarness.create();

    await harness.setInputEntities([
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: {
          name: 'test',
          annotations: {
            'backstage.io/managed-by-location': 'url:javascript:bad()',
            'backstage.io/managed-by-origin-location': 'url:javascript:alert()',
          },
        },
      },
    ]);

    await expect(harness.process()).resolves.toEqual({
      'component:default/test': [
        new TypeError(
          "Invalid location ref 'url:javascript:bad()', target is a javascript: URL",
        ),
      ],
    });
  });

  it('should return valid responses in raw JSON mode', async () => {
    const harness = await TestHarness.create({
      disableRelationsCompatibility: true,
    });

    const entityA = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'a',
        annotations: {
          'backstage.io/managed-by-location': 'url:.',
          'backstage.io/managed-by-origin-location': 'url:.',
        },
      },
    };
    const entityB = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        name: 'b',
        annotations: {
          'backstage.io/managed-by-location': 'url:.',
          'backstage.io/managed-by-origin-location': 'url:.',
        },
      },
    };

    await harness.setInputEntities([entityA, entityB]);
    await expect(harness.process()).resolves.toEqual({});

    await expect(harness.getOutputEntities()).resolves.toEqual({
      'component:default/a': {
        ...entityA,
        metadata: {
          ...entityA.metadata,
          etag: expect.any(String),
          uid: expect.any(String),
        },
        relations: [],
      },
      'component:default/b': {
        ...entityB,
        metadata: {
          ...entityB.metadata,
          etag: expect.any(String),
          uid: expect.any(String),
        },
        relations: [],
      },
    });
  });

  it('should replace any refresh_state_references that are dangling after claiming an entityRef with locationKey', async () => {
    const firstProvider = new TestProvider('first');
    const secondProvider = new TestProvider('second');

    const harness = await TestHarness.create({
      additionalProviders: [firstProvider, secondProvider],
    });

    await firstProvider.getConnection().applyMutation({
      type: 'full',
      entities: [
        {
          entity: {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'component-1',
              annotations: {
                'backstage.io/managed-by-location': 'url:.',
                'backstage.io/managed-by-origin-location': 'url:.',
              },
            },
            spec: {
              type: 'service',
              owner: 'no-location-key',
            },
          },
        },
      ],
    });

    await expect(harness.process()).resolves.toEqual({});

    await expect(harness.getOutputEntities()).resolves.toEqual({
      'component:default/component-1': expect.objectContaining({
        spec: {
          type: 'service',
          owner: 'no-location-key',
        },
      }),
    });

    await secondProvider.getConnection().applyMutation({
      type: 'full',
      entities: [
        {
          locationKey: 'takeover',
          entity: {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'component-1',
              annotations: {
                'backstage.io/managed-by-location': 'url:.',
                'backstage.io/managed-by-origin-location': 'url:.',
              },
            },
            spec: {
              type: 'service',
              owner: 'location-key',
            },
          },
        },
      ],
    });

    await expect(harness.process()).resolves.toEqual({});

    await expect(harness.getOutputEntities()).resolves.toEqual({
      'component:default/component-1': expect.objectContaining({
        spec: {
          type: 'service',
          owner: 'location-key',
        },
      }),
    });

    await expect(harness.getRefreshStateReferences()).resolves.toEqual([
      {
        sourceKey: 'second',
        targetEntityRef: 'component:default/component-1',
      },
    ]);

    await secondProvider.getConnection().applyMutation({
      type: 'full',
      entities: [
        {
          locationKey: 'takeover',
          entity: {
            apiVersion: 'backstage.io/v1alpha1',
            kind: 'Component',
            metadata: {
              name: 'component-2',
              annotations: {
                'backstage.io/managed-by-location': 'url:.',
                'backstage.io/managed-by-origin-location': 'url:.',
              },
            },
            spec: {
              type: 'service',
              owner: 'location-key',
            },
          },
        },
      ],
    });

    await expect(harness.process()).resolves.toEqual({});

    await expect(harness.getRefreshStateReferences()).resolves.toEqual([
      {
        sourceKey: 'second',
        targetEntityRef: 'component:default/component-2',
      },
    ]);

    await expect(harness.getOutputEntities()).resolves.toEqual({
      'component:default/component-2': expect.objectContaining({
        spec: {
          type: 'service',
          owner: 'location-key',
        },
      }),
    });
  });

  function withOutputFields(entity: Entity) {
    return {
      ...entity,
      metadata: {
        ...entity.metadata,
        etag: expect.any(String),
        uid: expect.any(String),
      },
      relations: [],
    };
  }

  it('should fully replace existing entities when emitting override entities during processing', async () => {
    const baseEntity = {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Component',
      metadata: {
        annotations: {
          'backstage.io/managed-by-location': 'url:.',
          'backstage.io/managed-by-origin-location': 'url:.',
        },
      },
    };
    const entityA = merge({ metadata: { name: 'a' } }, baseEntity);
    const entityB = merge({ metadata: { name: 'b' } }, baseEntity);
    const entityBOverride = merge({ metadata: { override: true } }, entityB);

    const processEntity = jest.fn(
      async (
        entity: Entity,
        _location: LocationSpec,
        _emit: CatalogProcessorEmit,
      ) => entity,
    );
    const harness = await TestHarness.create({ processEntity });

    processEntity.mockImplementation(async (entity, location, emit) => {
      if (entity.metadata.name === entityA.metadata.name) {
        emit(processingResult.entity(location, entityBOverride));
      }
      return entity;
    });

    // A and B are added to the catalog, but the processor emits B' from A that overrides B
    await harness.setInputEntities([entityA, entityB]);
    await expect(harness.process()).resolves.toEqual({});

    // Expect to find A and B' in the catalog
    await expect(harness.getRefreshStateReferences()).resolves.toEqual([
      {
        sourceKey: 'test',
        targetEntityRef: 'component:default/a',
      },
      {
        sourceEntityRef: 'component:default/a',
        targetEntityRef: 'component:default/b',
      },
    ]);
    await expect(harness.getRefreshState()).resolves.toEqual({
      'component:default/a': expect.objectContaining({
        locationKey: null,
        unprocessedEntity: entityA,
      }),
      'component:default/b': expect.objectContaining({
        locationKey: 'url:.',
        unprocessedEntity: entityBOverride,
      }),
    });
    await expect(harness.getOutputEntities()).resolves.toEqual({
      'component:default/a': withOutputFields(entityA),
      'component:default/b': withOutputFields(entityBOverride),
    });

    // Stop emitting B' from A, then do a full sync with A and B
    processEntity.mockImplementation(async entity => entity);
    await harness.setInputEntities([entityA, entityB]);

    // At this point we should still have A and B' in the catalog
    await expect(harness.getRefreshStateReferences()).resolves.toEqual([
      {
        sourceKey: 'test',
        targetEntityRef: 'component:default/a',
      },
      {
        sourceEntityRef: 'component:default/a',
        targetEntityRef: 'component:default/b',
      },
    ]);
    await expect(harness.getRefreshState()).resolves.toEqual({
      'component:default/a': expect.objectContaining({
        locationKey: null,
        unprocessedEntity: entityA,
      }),
      'component:default/b': expect.objectContaining({
        locationKey: 'url:.',
        unprocessedEntity: entityBOverride,
      }),
    });
    await expect(harness.getOutputEntities()).resolves.toEqual({
      'component:default/a': withOutputFields(entityA),
      'component:default/b': withOutputFields(entityBOverride),
    });

    // Once we process, B' should be orphaned
    await expect(harness.process()).resolves.toEqual({});
    // This is expected to remove B'
    await harness.removeOrphanedEntities();

    // At this point only A is left in the catalog
    await expect(harness.getRefreshStateReferences()).resolves.toEqual([
      {
        sourceKey: 'test',
        targetEntityRef: 'component:default/a',
      },
    ]);
    await expect(harness.getRefreshState()).resolves.toEqual({
      'component:default/a': expect.objectContaining({
        locationKey: null,
        unprocessedEntity: entityA,
      }),
    });
    await expect(harness.getOutputEntities()).resolves.toEqual({
      'component:default/a': withOutputFields(entityA),
    });

    // Next time the provider runs and does a full sync we should now be able to add back B
    await harness.setInputEntities([entityA, entityB]);
    await expect(harness.process()).resolves.toEqual({});

    await expect(harness.getOutputEntities()).resolves.toEqual({
      'component:default/a': withOutputFields(entityA),
      'component:default/b': withOutputFields(entityB),
    });
  });
});
