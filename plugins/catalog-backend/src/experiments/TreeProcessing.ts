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

import { Entity, serializeEntityName } from '@backstage/catalog-model';
import { JsonObject } from '@backstage/config';
import {
  EntityProcessor,
  LocationReader,
  ProcessingContext,
  ProcessingResult,
  Relation,
} from './processing';

export class EntityStore {
  private readonly entities = new Map<string, Entity>();

  store(entity: Entity) {
    const ref = serializeEntityName(entity);
    this.entities.set(ref, entity);
  }

  getEntity(ref: string): Entity | undefined {
    return this.entities.get(ref);
  }

  getEntities(): Iterable<Entity> {
    return this.entities.values();
  }
}

type ProcessScope = {
  ref: string;
  // Paras to pass along with the scope. These would be forwarded to the
  // processors and can be used to e.g. further narrow the processing scope,
  // or not have to re-fetch data. Can for example be used when adding new
  // entities without having to re-process all existing children
  params: JsonObject;
};

type ProcessOptions = {
  scope?: ProcessScope;
};

type FluidProcessorOptions = {
  processors: EntityProcessor[];
  // Used to read arbitrary data from external sources
  reader: LocationReader;
  // Connection to the storage layer so that we can load
  // en existing entities during processing
  entityLoader(ref: string): Entity | undefined;
};

// All processing starts at a root entity
const ROOT_ENTITY: Entity = {
  apiVersion: 'backstage.io/v1beta1',
  kind: 'Root',
  metadata: {
    name: 'root',
  },
};

type CatalogProcessorResult = {
  entities: Map<string, Entity>;
  relations: Relation[];
};

type CatalogProcessor = {
  process(options: ProcessOptions): CatalogProcessorResult;
};

// The processing core of a catalog where processing is tree-shaped where each node is an entity
export class TreeProcessor implements CatalogProcessor {
  constructor(private readonly options: FluidProcessorOptions) {}

  process(options: ProcessOptions): CatalogProcessorResult {
    const entities = new Map<string, Entity>();
    const relations = Array<Relation>();
    const queue = Array<Entity>();

    // Scope can be used to re-process only part of the entity tree
    if (options.scope) {
      const entity = this.options.entityLoader(options.scope.ref);
      if (!entity) {
        throw new Error(`Entity scope not found: ${options.scope.ref}`);
      }

      queue.push(entity);
    } else {
      queue.push(ROOT_ENTITY);
    }

    // TODO: make sure we're not looping and in general don't re-process duplicates
    while (queue.length > 0) {
      const unprocessedEntity = queue.shift()!;
      console.log(`Processing ${serializeEntityName(unprocessedEntity)}`);
      const { entity, children, relations: newRelations } = this.processEntity(
        unprocessedEntity,
        {
          read: loc => this.options.reader.read(loc),
        },
      );
      entities.set(serializeEntityName(entity), entity);
      relations.push(...newRelations);

      queue.push(...children);
    }

    // When we're executing with a scope we can't expect all relations to be complete at
    // this stage, so we defer the resolution until later in the storage integration layer
    // TODO: could do with using the provided entityLoader too, w/e works
    const deferredRelations = Array<Relation>();
    const shouldDeferMissingRelations = Boolean(options.scope);

    for (const r of relations) {
      const source = entities.get(r.source);
      const target = entities.get(r.target);

      // Relations should always be created when processing either the target or source
      if (!source && !target) {
        throw new Error(
          `Emitted relation of type ${r.type} has no matching source ${r.source}, or target ${r.target}`,
        );
      } else if (!source) {
        if (shouldDeferMissingRelations) {
          deferredRelations.push(r);
        } else {
          console.error(
            `Entity relation of type ${r.type} from ${r.source} has not matching target ${r.target}`,
          );
        }
      } else if (!target) {
        if (shouldDeferMissingRelations) {
          deferredRelations.push(r);
        } else {
          // TODO: add something like this to the model
          (source as any).status = {
            errors: [
              new Error(
                `Broken relation of type ${r.type}, target not found, ${r.target}`,
              ),
            ],
          };
        }
      } else {
        // TODO: add something like this to the model
        const anyS = source as any;
        const sourceRelations = (anyS.relations = anyS.relations ?? []);
        sourceRelations.push({
          type: r.type,
          target: r.target,
        });
      }
    }

    return {
      entities,
      relations: deferredRelations,
    };
  }

  private processEntity(
    _entity: Entity,
    context: Omit<ProcessingContext, 'emit'>,
  ): { entity: Entity; children: Entity[]; relations: Relation[] } {
    let entity = _entity;
    const relations = Array<Relation>();
    const children = Array<Entity>();
    const errors = Array<Error>();

    const emit = (result: ProcessingResult): void => {
      if (result.type === 'error') {
        errors.push(result.error);
      } else if (result.type === 'entity') {
        // any entity that emits an entity automatically gets a created/created-by relation
        const childRef = serializeEntityName(result.entity);
        const entityRef = serializeEntityName(entity);

        // TODO: some stricter enforcement of this
        relations.push({
          type: 'created-by',
          source: childRef,
          target: entityRef,
        });
        relations.push({
          type: 'created',
          source: entityRef,
          target: childRef,
        });
        children.push(result.entity);
      } else if (result.type === 'relation') {
        relations.push(result.relation);
      }
    };

    for (const processor of this.options.processors) {
      try {
        entity = processor.process(entity, { ...context, emit });
      } catch (error) {
        throw new Error(
          `Processing failed for entity ${serializeEntityName(entity)}`,
        );
      }
    }

    return { entity, children, relations };
  }
}

type CatalogOptions = {
  processors: EntityProcessor[];
  reader: LocationReader;
};

export class Catalog {
  private readonly store = new EntityStore();
  private readonly processor: CatalogProcessor;

  constructor({ reader, processors }: CatalogOptions) {
    this.processor = new TreeProcessor({
      reader,
      processors,
      entityLoader: ref => this.store.getEntity(ref),
    });
  }

  process(options: ProcessOptions) {
    const { entities, relations } = this.processor.process(options);

    for (const entity of entities.values()) {
      this.store.store(entity);
    }
    for (const r of relations) {
      let source = entities.get(r.source);
      if (!source) {
        source = this.store.getEntity(r.source);
      }
      if (!source) {
        console.error(
          `Missing source for relation of type ${r.type}, ${r.source}`,
        );
        continue;
      }
      // TODO: proper implementation that actually checks things
      const anyS = source as any;
      const sourceRelations = (anyS.relations = anyS.relations ?? []);
      sourceRelations.push({
        type: r.type,
        target: r.target,
      });
    }
  }

  getEntity(ref: string): Entity | undefined {
    return this.store.getEntity(ref);
  }

  getEntities(): Iterable<Entity> {
    return this.store.getEntities();
  }
}
