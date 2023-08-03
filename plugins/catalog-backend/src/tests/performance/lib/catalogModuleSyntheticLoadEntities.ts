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

import { createBackendModule } from '@backstage/backend-plugin-api';
import { Entity } from '@backstage/catalog-model';
import { LocationSpec } from '@backstage/plugin-catalog-common';
import {
  CatalogProcessor,
  CatalogProcessorCache,
  CatalogProcessorEmit,
  DeferredEntity,
  EntityProvider,
  EntityProviderConnection,
  processingResult,
} from '@backstage/plugin-catalog-node';
import { catalogProcessingExtensionPoint } from '@backstage/plugin-catalog-node/alpha';

/**
 * Options for a fixed initial load of entities.
 */
export type SyntheticLoadOptions = {
  /**
   * The number of entities to insert.
   */
  baseEntitiesCount: number;
  /**
   * The number of outgoing relations per entity.
   */
  baseRelationsCount: number;
  /**
   * How "bunched up" relations are, as a number between 0 and 1.
   *
   * 0 means that relations are evenly distributed such that they form a uniform
   * mesh. 1 means that every single relation goes to one and the same exact
   * "victim" entity. Thus, the higher the number, the more unevenly distributed
   * the relations are.
   */
  baseRelationsSkew: number;
  /**
   * The number of child entities emitted by each base entity.
   */
  childrenCount: number;
};

/**
 * Events that can occur during the load ingestion
 */
export type SyntheticLoadEvents = {
  onBeforeInsertBaseEntities?: () => void;
  onAfterInsertBaseEntities?: () => void;
  onError?: (error: Error) => void;
};

/**
 * Throws if any of the options are invalid.
 */
function validateSyntheticLoadOptions(options: SyntheticLoadOptions): void {
  if (
    !Number.isSafeInteger(options.baseEntitiesCount) ||
    options.baseEntitiesCount <= 0
  ) {
    throw new TypeError('baseEntitiesCount must be a nonnegative integer');
  } else if (
    !Number.isSafeInteger(options.baseRelationsCount) ||
    options.baseRelationsCount < 0
  ) {
    throw new TypeError('baseRelationsCount must be a nonnegative integer');
  } else if (
    !Number.isFinite(options.baseRelationsSkew) ||
    options.baseRelationsSkew < 0 ||
    options.baseRelationsSkew > 1
  ) {
    throw new TypeError('baseRelationsSkew must be a number between 0 and 1');
  } else if (
    !Number.isSafeInteger(options.childrenCount) ||
    options.childrenCount < 0
  ) {
    throw new TypeError('childrenCount must be a nonnegative integer');
  }
}

/**
 * Some shared definitions
 */
export const common = {
  baseEntityName: (index: number) => `synthetic-${index}`,
  baseEntityNamespace: 'synthetic-load-base',
  baseEntity: (index: number): Entity => {
    return {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Location',
      metadata: {
        name: common.baseEntityName(index),
        namespace: common.baseEntityNamespace,
        annotations: {
          'backstage.io/managed-by-location': `url:fake`,
          'backstage.io/managed-by-origin-location': `url:fake`,
        },
      },
      spec: {
        type: 'url',
        targets: [],
      },
    };
  },
  childEntityName: (baseEntity: Entity, index: number) =>
    `${baseEntity.metadata.name}-${index}`,
  childEntityNamespace: 'synthetic-load-child',
  childEntity: (baseEntity: Entity, index: number): Entity => {
    return {
      apiVersion: 'backstage.io/v1alpha1',
      kind: 'Location',
      metadata: {
        name: common.childEntityName(baseEntity, index),
        namespace: common.childEntityNamespace,
        annotations: {
          'backstage.io/managed-by-location': `url:fake`,
          'backstage.io/managed-by-origin-location': `url:fake`,
        },
      },
      spec: {
        type: 'url',
        targets: [],
      },
    };
  },
  kind: 'Location',
  relationType: 'loadTest',
} as const;

/**
 * The entity provider that drives the initial base entity injection
 */
class SyntheticLoadEntitiesProvider implements EntityProvider {
  constructor(
    private readonly load: SyntheticLoadOptions,
    private readonly events: SyntheticLoadEvents,
  ) {}

  getProviderName(): string {
    return 'SyntheticLoadEntitiesProvider';
  }

  async connect(connection: EntityProviderConnection): Promise<void> {
    // Defer this work so as to not block startup entirely
    setImmediate(async () => {
      try {
        this.events.onBeforeInsertBaseEntities?.();

        const deferred: DeferredEntity[] = [];
        for (let index = 0; index < this.load.baseEntitiesCount; ++index) {
          deferred.push({ entity: common.baseEntity(index) });
        }

        await connection.applyMutation({
          type: 'full',
          entities: deferred,
        });

        this.events.onAfterInsertBaseEntities?.();
      } catch (error) {
        this.events.onError?.(error);
      }
    });
  }
}

/**
 * Supporting processor for emitting children and relations
 */
class SyntheticLoadEntitiesProcessor implements CatalogProcessor {
  constructor(private readonly load: SyntheticLoadOptions) {}

  getProcessorName(): string {
    return 'SyntheticLoadEntitiesProcessor';
  }

  async postProcessEntity(
    entity: Entity,
    location: LocationSpec,
    emit: CatalogProcessorEmit,
    _cache: CatalogProcessorCache,
  ): Promise<Entity> {
    const {
      baseEntitiesCount,
      baseRelationsCount,
      baseRelationsSkew,
      childrenCount,
    } = this.load;

    if (entity.metadata.namespace === common.baseEntityNamespace) {
      for (let rc = 0; rc < baseRelationsCount; ++rc) {
        const relationIndex = Math.floor(
          Math.random() * baseEntitiesCount * (1 - baseRelationsSkew),
        );
        emit(
          processingResult.relation({
            source: {
              kind: common.kind,
              namespace: common.baseEntityNamespace,
              name: entity.metadata.name,
            },
            target: {
              kind: common.kind,
              namespace: common.baseEntityNamespace,
              name: common.baseEntityName(relationIndex),
            },
            type: common.relationType,
          }),
        );
      }

      for (let i = 0; i < childrenCount; ++i) {
        emit(processingResult.entity(location, common.childEntity(entity, i)));
      }
    }

    return entity;
  }
}

export const catalogModuleSyntheticLoadEntities = createBackendModule(
  (options: { load: SyntheticLoadOptions; events?: SyntheticLoadEvents }) => ({
    moduleId: 'syntheticLoadEntities',
    pluginId: 'catalog',
    register(reg) {
      reg.registerInit({
        deps: {
          catalog: catalogProcessingExtensionPoint,
        },
        async init({ catalog }) {
          const { load, events = {} } = options;

          validateSyntheticLoadOptions(load);
          const provider = new SyntheticLoadEntitiesProvider(load, events);
          const processor = new SyntheticLoadEntitiesProcessor(load);

          catalog.addEntityProvider(provider);
          catalog.addProcessor(processor);
        },
      });
    },
  }),
);
