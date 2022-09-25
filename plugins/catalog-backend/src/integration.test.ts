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

import { Knex } from 'knex';
import { Logger } from 'winston';
import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import {
  BuiltinKindsEntityProcessor,
  CatalogProcessingEngine,
  EntityProvider,
} from './index';
import { DatabaseManager, getVoidLogger } from '@backstage/backend-common';
import { PermissionEvaluator } from '@backstage/plugin-permission-common';
import { Entity, EntityPolicies } from '@backstage/catalog-model';
import { defaultEntityDataParser } from './modules/util/parse';
import { DefaultCatalogProcessingOrchestrator } from './processing/DefaultCatalogProcessingOrchestrator';
import { applyDatabaseMigrations } from './database/migrations';
import { DefaultProcessingDatabase } from './database/DefaultProcessingDatabase';
import { ScmIntegrations } from '@backstage/integration';
import { DefaultCatalogRulesEnforcer } from './ingestion/CatalogRules';
import { Stitcher } from './stitching/Stitcher';
import { DefaultEntitiesCatalog } from './service/DefaultEntitiesCatalog';
import { DefaultCatalogProcessingEngine } from './processing/DefaultCatalogProcessingEngine';
import { createHash } from 'crypto';
import { DefaultRefreshService } from './service/DefaultRefreshService';
import { connectEntityProviders } from './processing/connectEntityProviders';
import { EntitiesCatalog } from './catalog/types';
import { RefreshOptions, RefreshService } from './service/types';
import {
  CatalogProcessorEmit,
  EntityProviderConnection,
  LocationSpec,
} from '@backstage/plugin-catalog-node';
import { RefreshStateItem } from './database/types';

const voidLogger = getVoidLogger();

class TestProvider implements EntityProvider {
  #connection?: EntityProviderConnection;

  getProviderName(): string {
    return 'test';
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

type ProgressTracker = NonNullable<
  ConstructorParameters<typeof DefaultCatalogProcessingEngine>[7]
>;

class ProxyProgressTracker implements ProgressTracker {
  #inner: ProgressTracker;

  constructor(inner: ProgressTracker) {
    this.#inner = inner;
  }

  processStart(item: RefreshStateItem) {
    return this.#inner.processStart(item, voidLogger);
  }

  setTracker(tracker: ProgressTracker) {
    this.#inner = tracker;
  }
}

class NoopProgressTracker implements ProgressTracker {
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
}

class WaitingProgressTracker implements ProgressTracker {
  #resolve: (errors: Record<string, Error>) => void;
  #promise: Promise<Record<string, Error>>;
  #counts = new Map<string, number>();
  #errors = new Map<string, Error>();
  #inFlight = new Array<Promise<void>>();

  constructor(private readonly entityRefs?: Set<string>) {
    let resolve: (errors: Record<string, Error>) => void;
    this.#promise = new Promise<Record<string, Error>>(_resolve => {
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

    const onDone = () => {
      this.#counts.set(item.id, currentCount + 1);

      if (Array.from(this.#counts.values()).every(c => c >= 2)) {
        this.#resolve(Object.fromEntries(this.#errors));
      }
    };
    return {
      markFailed: (error: Error) => {
        this.#errors.set(item.entityRef, error);
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
        this.#errors.delete(item.entityRef);
        onDone();
        resolve();
      },
      markSuccessfulWithNoChanges: () => {
        onDone();
        resolve();
      },
    };
  }

  async wait(): Promise<Record<string, Error>> {
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

  static async create(options?: {
    config?: JsonObject;
    logger?: Logger;
    db?: Knex;
    permissions?: PermissionEvaluator;
    processEntity?(
      entity: Entity,
      location: LocationSpec,
      emit: CatalogProcessorEmit,
    ): Promise<Entity>;
    onProcessingError?(event: {
      unprocessedEntity: Entity;
      errors: Error[];
    }): void;
  }) {
    const config = new ConfigReader(
      options?.config ?? {
        backend: {
          database: {
            client: 'better-sqlite3',
            connection: ':memory:',
          },
        },
      },
    );
    const logger = options?.logger ?? getVoidLogger();
    const db =
      options?.db /* (await TestDatabases.create().init('SQLITE_3')); */ ??
      (await DatabaseManager.fromConfig(config, { logger })
        .forPlugin('catalog')
        .getClient());

    await applyDatabaseMigrations(db);

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
        new BuiltinKindsEntityProcessor(),
      ],
      integrations,
      rulesEnforcer,
      logger,
      parser: defaultEntityDataParser,
      // policy: new SchemaValidEntityPolicy(),
      policy: EntityPolicies.allOf([]),
    });
    const stitcher = new Stitcher(db, logger);
    const catalog = new DefaultEntitiesCatalog(db, stitcher);
    const proxyProgressTracker = new ProxyProgressTracker(
      new NoopProgressTracker(),
    );

    const engine = new DefaultCatalogProcessingEngine(
      logger,
      processingDatabase,
      orchestrator,
      stitcher,
      () => createHash('sha1'),
      50,
      event => {
        if (options?.onProcessingError) {
          options.onProcessingError(event);
        } else {
          throw new Error(
            `Catalog processing error, ${event.errors.join(', ')}`,
          );
        }
      },
      proxyProgressTracker,
    );

    const refresh = new DefaultRefreshService({ database: processingDatabase });

    const provider = new TestProvider();

    await connectEntityProviders(processingDatabase, [provider]);

    return new TestHarness(
      catalog,
      engine,
      refresh,
      provider,
      proxyProgressTracker,
    );
  }

  constructor(
    catalog: EntitiesCatalog,
    engine: CatalogProcessingEngine,
    refresh: RefreshService,
    provider: TestProvider,
    proxyProgressTracker: ProxyProgressTracker,
  ) {
    this.#catalog = catalog;
    this.#engine = engine;
    this.#refresh = refresh;
    this.#provider = provider;
    this.#proxyProgressTracker = proxyProgressTracker;
  }

  async process(entityRefs?: Set<string>) {
    this.#engine.start();

    const tracker = new WaitingProgressTracker(entityRefs);
    this.#proxyProgressTracker.setTracker(tracker);
    const errors = await tracker.wait();

    this.#engine.stop();
    await tracker.waitForFinish();

    this.#proxyProgressTracker.setTracker(new NoopProgressTracker());

    return errors;
  }

  async setInputEntities(entities: Entity[]) {
    return this.#provider.getConnection().applyMutation({
      type: 'full',
      entities: entities.map(entity => ({ entity })),
    });
  }

  async getOutputEntities(): Promise<Entity[]> {
    const { entities } = await this.#catalog.entities();
    return entities;
  }

  async refresh(options: RefreshOptions) {
    return this.#refresh.refresh(options);
  }
}

describe('Catalog Backend Integration', () => {
  it('should add entities and update errors', async () => {
    let triggerError = false;

    const harness = await TestHarness.create({
      async processEntity(entity: Entity) {
        if (triggerError) {
          delete entity.spec;
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
        spec: {
          type: 'service',
          owner: 'guest',
          lifecycle: 'production',
        },
      },
    ]);

    await expect(harness.getOutputEntities()).resolves.toEqual([]);
    await expect(harness.process()).resolves.toEqual({});

    await expect(harness.getOutputEntities()).resolves.toEqual([
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: expect.objectContaining({ name: 'test' }),
        spec: expect.objectContaining({ type: 'service' }),
        relations: [
          {
            target: { kind: 'group', namespace: 'default', name: 'guest' },
            type: 'ownedBy',
            targetRef: 'group:default/guest',
          },
        ],
      },
    ]);

    triggerError = true;

    await expect(harness.process()).resolves.toEqual({});

    await expect(harness.getOutputEntities()).resolves.toEqual([
      {
        apiVersion: 'backstage.io/v1alpha1',
        kind: 'Component',
        metadata: expect.objectContaining({ name: 'test' }),
        spec: expect.objectContaining({ type: 'service' }),
        relations: expect.any(Array),
        status: {
          items: [
            {
              level: 'error',
              type: 'backstage.io/catalog-processing',
              message: expect.stringMatching(
                /InputError: Processor BuiltinKindsEntityProcessor threw an error/,
              ),
              error: expect.objectContaining({
                cause: expect.objectContaining({
                  message:
                    "<root> must have required property 'spec' - missingProperty: spec",
                  name: 'TypeError',
                }),
                name: 'InputError',
              }),
            },
          ],
        },
      },
    ]);
  });
});
