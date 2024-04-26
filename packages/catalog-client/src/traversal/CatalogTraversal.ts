/*
 * Copyright 2025 The Backstage Authors
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
  EntityRelation,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import { CatalogApi, EntityFieldsQuery } from '@backstage/catalog-client';
import DataLoader from 'dataloader';
import {
  TraverseCatalogFollow,
  TraverseCatalogInitialSet,
  Traversal,
} from './types';

/**
 * Implements the actual catalog traversals.
 */
export class CatalogTraversal implements Traversal {
  readonly #catalogApi: CatalogApi;
  readonly #loader: DataLoader<string, Entity | undefined, string>;
  readonly #fields: EntityFieldsQuery | undefined;
  readonly #initial: TraverseCatalogInitialSet;
  readonly #relationFilter: (entity: Entity) => EntityRelation[];

  constructor(options: {
    catalogApi: CatalogApi;
    loader: DataLoader<string, Entity | undefined>;
    fields: EntityFieldsQuery | undefined;
    initial: TraverseCatalogInitialSet;
    follow: TraverseCatalogFollow;
  }) {
    this.#catalogApi = options.catalogApi;
    this.#loader = options.loader;
    this.#fields = options.fields;
    this.#initial = options.initial;
    this.#relationFilter = createRelationFilter(options.follow);
  }

  async *traverse(options?: {
    minDepth?: number;
    maxDepth?: number;
  }): AsyncGenerator<
    | {
        type: 'node';
        entityRef: string;
        depth: number;
      }
    | {
        type: 'edge';
        fromEntityRef: string;
        fromDepth: number;
        relation: EntityRelation;
      }
  > {
    const { minDepth = 0, maxDepth = 100 } = options ?? {};

    // Make sure to push the initial items
    const nextLayer = new Array<string>();
    if ('entityRef' in this.#initial) {
      nextLayer.push(this.#initial.entityRef);
    } else if ('entityRefs' in this.#initial) {
      nextLayer.push(...this.#initial.entityRefs);
    } else {
      const { items: entities } = await this.#catalogApi.getEntities({
        filter: this.#initial.filter,
        fields: this.#fields,
      });
      for (const entity of entities) {
        const entityRef = stringifyEntityRef(entity);
        this.#loader.prime(entityRef, entity); // prime loader cache so it doesn't have to be fetched again
        nextLayer.push(entityRef);
      }
    }

    const visitedRefs = new Set<string>();
    for (let depth = 0; depth <= maxDepth && nextLayer.length > 0; depth++) {
      // Clear out the current layer and analyze it
      const currentLayer = nextLayer.splice(0, nextLayer.length);
      const entities = await Promise.all(
        currentLayer.map(entityRef => this.#loader.load(entityRef)),
      );

      for (let i = 0; i < currentLayer.length; i++) {
        const entityRef = currentLayer[i];
        const entity = entities[i];

        if (!visitedRefs.has(entityRef)) {
          visitedRefs.add(entityRef);

          if (depth >= minDepth) {
            yield {
              type: 'node',
              entityRef,
              depth,
            };
          }

          if (entity) {
            for (const outgoingRelation of this.#relationFilter(entity)) {
              nextLayer.push(outgoingRelation.targetRef);

              if (depth >= minDepth) {
                yield {
                  type: 'edge',
                  fromEntityRef: entityRef,
                  fromDepth: depth,
                  relation: outgoingRelation,
                };
              }
            }
          }
        }
      }
    }
  }
}

// #region helpers

/**
 * Translates a TraverseCatalogFollow into a function that extracts matching
 * relations from an entity.
 */
function createRelationFilter(
  follow: TraverseCatalogFollow,
): (entity: Entity) => EntityRelation[] {
  const matchers = [follow].flat().map(f => {
    const fromKindLower = f.fromKind?.toLocaleLowerCase('en-US');
    const toRefPrefix = f.toKind
      ? `${f.toKind.toLocaleLowerCase('en-US')}:`
      : '';
    return (kind: string, relation: EntityRelation) =>
      relation.type === f.relation &&
      (!fromKindLower || kind.toLocaleLowerCase('en-US') === fromKindLower) &&
      relation.targetRef.startsWith(toRefPrefix);
  });

  return entity => {
    const result = new Array<EntityRelation>();
    const kindLower = entity.kind.toLocaleLowerCase('en-US');

    for (const relation of entity.relations ?? []) {
      if (matchers.some(matcher => matcher(kindLower, relation))) {
        result.push(relation);
      }
    }

    return result;
  };
}

// #endregion
