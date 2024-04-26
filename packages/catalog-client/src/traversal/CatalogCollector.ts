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

import { Entity } from '@backstage/catalog-model';
import DataLoader from 'dataloader';
import {
  Traversal,
  TraverseCatalogGraph,
  TraverseCatalogGraphNode,
  TraverseCatalogResult,
} from './types';

export class CatalogCollector implements TraverseCatalogResult {
  readonly #loader: DataLoader<string, Entity | undefined, string>;
  readonly #traversal: Traversal;

  constructor(options: {
    loader: DataLoader<string, Entity | undefined>;
    traversal: Traversal;
  }) {
    this.#loader = options.loader;
    this.#traversal = options.traversal;
  }

  async toEntityArray<TEntity extends Entity = Entity>(options?: {
    minDepth?: number;
    maxDepth?: number;
  }): Promise<TEntity[]> {
    const entities = new Array<Promise<Entity | undefined>>();
    for await (const match of this.#traversal.traverse(options)) {
      if (match.type === 'node') {
        entities.push(this.#loader.load(match.entityRef));
      }
    }
    return await Promise.all(entities).then(es =>
      es.filter((e): e is TEntity => !!e),
    );
  }

  async toEntitySet<TEntity extends Entity = Entity>(options?: {
    minDepth?: number;
    maxDepth?: number;
  }): Promise<Set<TEntity>> {
    // Rely on the traversal only ever emitting nodes once
    return new Set(await this.toEntityArray<TEntity>(options));
  }

  async toEntityRefArray(options?: {
    minDepth?: number;
    maxDepth?: number;
    includeMissing?: boolean;
  }): Promise<string[]> {
    const { includeMissing = true } = options ?? {};

    const refs = new Array<string>();
    for await (const match of this.#traversal.traverse(options)) {
      if (match.type === 'node') {
        refs.push(match.entityRef);
      }
    }

    if (includeMissing) {
      return refs;
    }

    const entities = await this.#loader.loadMany(refs);
    return refs.filter((_, i) => {
      const entityOrError = entities[i];
      if (!entityOrError) {
        return false;
      } else if (entityOrError instanceof Error) {
        throw entityOrError;
      }
      return true;
    });
  }

  async toEntityRefSet(options?: {
    minDepth?: number;
    maxDepth?: number;
    includeMissing?: boolean;
  }): Promise<Set<string>> {
    return new Set(await this.toEntityRefArray(options));
  }

  async toGraph(options?: {
    minDepth?: number;
    maxDepth?: number;
    includeMissing?: boolean;
  }): Promise<TraverseCatalogGraph> {
    const { maxDepth, includeMissing = true } = options ?? {};

    const roots: Array<string> = [];
    const nodes: Record<string, TraverseCatalogGraphNode> = {};
    const entities: Record<string, Entity> = {};

    const ensureNode = (entityRef: string): TraverseCatalogGraphNode => {
      let node = nodes[entityRef];
      if (node === undefined) {
        node = { entityRef, relations: [] };
        nodes[entityRef] = node;
      }
      return node;
    };

    const ensureEntity = async (
      entityRef: string,
    ): Promise<Entity | undefined> => {
      const entity = await this.#loader.load(entityRef);
      if (entity) {
        entities[entityRef] = entity;
      }
      return entity;
    };

    const seen = new Set<string>();
    for await (const match of this.#traversal.traverse(options)) {
      if (match.type === 'edge') {
        const { fromEntityRef, fromDepth, relation } = match;

        const fromEntity = await ensureEntity(fromEntityRef);
        if (!fromEntity && !includeMissing) {
          continue;
        }

        const fromNode = ensureNode(fromEntityRef);

        // Since this is a breadth first traversal, if we never saw this ref
        // before it's a root
        if (!seen.has(fromEntityRef)) {
          roots.push(fromEntityRef);
        }
        seen.add(fromEntityRef);
        seen.add(relation.targetRef);

        // Don't follow the edge if we are right at the max depth
        if (maxDepth === undefined || fromDepth < maxDepth) {
          const toEntity = await ensureEntity(relation.targetRef);
          if (toEntity || includeMissing) {
            fromNode.relations.push(relation);
            ensureNode(relation.targetRef);
          }
        }
      }
    }

    return { roots, nodes, entities };
  }
}
