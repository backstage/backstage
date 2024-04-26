/*
 * Copyright 2024 The Backstage Authors
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

import { Entity, EntityRelation } from '@backstage/catalog-model';
import { EntityFilterQuery } from '../types/api';

/**
 * The initial set of nodes to start the traversal from.
 *
 * @public
 */
export type TraverseCatalogInitialSet =
  | { entityRef: string }
  | { entityRefs: string[] }
  | { filter: EntityFilterQuery };

/**
 * The rules for what relation edge(s) to follow during a traversal.
 *
 * @public
 */
export type TraverseCatalogFollow =
  | {
      fromKind?: string;
      relation: string;
      toKind?: string;
    }
  | Array<{
      fromKind?: string;
      relation: string;
      toKind?: string;
    }>;

/**
 * A graph representation of a catalog traversal.
 *
 * @public
 */
export interface TraverseCatalogGraph {
  roots: string[];
  nodes: Record<string, TraverseCatalogGraphNode>;
  entities: Record<string, Entity>;
}

/**
 * The nodes of a {@link TraverseCatalogGraph}.
 *
 * @public
 */
export interface TraverseCatalogGraphNode {
  entityRef: string;
  relations: {
    type: string;
    targetRef: string;
  }[];
}

/**
 * The result of a catalog traversal.
 *
 * @public
 */
export interface TraverseCatalogResult {
  /**
   * Collects all entities into an array, with no duplicates.
   *
   * @remarks
   *
   * Note that this collector only keeps entities that actually exist, which
   * means that if your model for example contains relations to entities that do
   * not exist in the catalog, they will not be included in the result set. If
   * you want a complete set of entity refs, use the `toEntityRefArray`
   * collector instead, and follow up with a separate query to the catalog to
   * resolve the refs.
   */
  toEntityArray<TEntity extends Entity = Entity>(options?: {
    /**
     * The minimum depth (distance from the initial nodes) of the nodes to
     * collect.
     *
     * @defaultValue 0
     * @remarks
     *
     * The initial nodes themselves are defined as distance 0. This value
     * defaults to 0, which means that the collector will receive the initial
     * nodes as well. You can for example set this value to 1 to skip the
     * initial nodes from the result set.
     */
    minDepth?: number;
    /**
     * The maximum depth (distance from the initial nodes) of the nodes to
     * collect.
     *
     * @defaultValue 100
     * @remarks
     *
     * The initial nodes themselves are defined as distance 0. This value
     * defaults to 100, as a safety measure to avoid infinite loops. You can set
     * this to a lower value if you want to only traverse through a small
     * neighborhoud around the initial nodes.
     */
    maxDepth?: number;
  }): Promise<TEntity[]>;

  /**
   * Collects all entities into a set.
   *
   * @remarks
   *
   * Note that this collector only keeps entities that actually exist, which
   * means that if your model for example contains relations to entities that do
   * not exist in the catalog, they will not be included in the result set. If
   * you want a complete set of entity refs, use the `toEntityRefSet` collector
   * instead, and follow up with a separate query to the catalog to resolve the
   * refs.
   */
  toEntitySet<TEntity extends Entity = Entity>(options?: {
    /**
     * The minimum depth (distance from the initial nodes) of the nodes to
     * collect.
     *
     * @defaultValue 0
     * @remarks
     *
     * The initial nodes themselves are defined as distance 0. This value
     * defaults to 0, which means that the collector will receive the initial
     * nodes as well. You can for example set this value to 1 to skip the
     * initial nodes from the result set.
     */
    minDepth?: number;
    /**
     * The maximum depth (distance from the initial nodes) of the nodes to
     * collect.
     *
     * @defaultValue 100
     * @remarks
     *
     * The initial nodes themselves are defined as distance 0. This value
     * defaults to 100, as a safety measure to avoid infinite loops. You can set
     * this to a lower value if you want to only traverse through a small
     * neighborhoud around the initial nodes.
     */
    maxDepth?: number;
  }): Promise<Set<TEntity>>;

  /**
   * Collects all entity refs into an array, with no duplicates.
   */
  toEntityRefArray(options?: {
    /**
     * The minimum depth (distance from the initial nodes) of the nodes to
     * collect.
     *
     * @defaultValue 0
     * @remarks
     *
     * The initial nodes themselves are defined as distance 0. This value
     * defaults to 0, which means that the collector will receive the initial
     * nodes as well. You can for example set this value to 1 to skip the
     * initial nodes from the result set.
     */
    minDepth?: number;
    /**
     * The maximum depth (distance from the initial nodes) of the nodes to
     * collect.
     *
     * @defaultValue 100
     * @remarks
     *
     * The initial nodes themselves are defined as distance 0. This value
     * defaults to 100, as a safety measure to avoid infinite loops. You can set
     * this to a lower value if you want to only traverse through a small
     * neighborhoud around the initial nodes.
     */
    maxDepth?: number;
    /**
     * Whether to include entity refs that do not have a corresponding entity in
     * the catalog.
     *
     * @remarks
     *
     * The default value is true, which means that entity refs that do not have
     * a corresponding entity in the catalog will be included in the result set
     * anyway. If you set this to false, only entity refs that have a
     * corresponding entity in the catalog will be included.
     */
    includeMissing?: boolean;
  }): Promise<string[]>;

  /**
   * Collects all entity refs into a set.
   */
  toEntityRefSet(options?: {
    /**
     * The minimum depth (distance from the initial nodes) of the nodes to
     * collect.
     *
     * @defaultValue 0
     * @remarks
     *
     * The initial nodes themselves are defined as distance 0. This value
     * defaults to 0, which means that the collector will receive the initial
     * nodes as well. You can for example set this value to 1 to skip the
     * initial nodes from the result set.
     */
    minDepth?: number;
    /**
     * The maximum depth (distance from the initial nodes) of the nodes to
     * collect.
     *
     * @defaultValue 100
     * @remarks
     *
     * The initial nodes themselves are defined as distance 0. This value
     * defaults to 100, as a safety measure to avoid infinite loops. You can set
     * this to a lower value if you want to only traverse through a small
     * neighborhoud around the initial nodes.
     */
    maxDepth?: number;
    /**
     * Whether to include entity refs that do not have a corresponding entity in
     * the catalog.
     *
     * @remarks
     *
     * The default value is true, which means that entity refs that do not have
     * a corresponding entity in the catalog will be included in the result set
     * anyway. If you set this to false, only entity refs that have a
     * corresponding entity in the catalog will be included.
     */
    includeMissing?: boolean;
  }): Promise<Set<string>>;

  /**
   * Collects a complete graph representation.
   */
  toGraph(options?: {
    /**
     * The minimum depth (distance from the initial nodes) of the nodes to
     * collect.
     *
     * @defaultValue 0
     * @remarks
     *
     * The initial nodes themselves are defined as distance 0. This value
     * defaults to 0, which means that the collector will receive the initial
     * nodes as well. You can for example set this value to 1 to skip the
     * initial nodes from the result set.
     */
    minDepth?: number;
    /**
     * The maximum depth (distance from the initial nodes) of the nodes to
     * collect.
     *
     * @defaultValue 100
     * @remarks
     *
     * The initial nodes themselves are defined as distance 0. This value
     * defaults to 100, as a safety measure to avoid infinite loops. You can set
     * this to a lower value if you want to only traverse through a small
     * neighborhoud around the initial nodes.
     */
    maxDepth?: number;
    /**
     * Whether to include entity refs that do not have a corresponding entity in
     * the catalog.
     *
     * @remarks
     *
     * The default value is true, which means that entity refs that do not have
     * a corresponding entity in the catalog will be included in the result set
     * anyway. If you set this to false, only entity refs that have a
     * corresponding entity in the catalog will be included.
     */
    includeMissing?: boolean;
  }): Promise<TraverseCatalogGraph>;
}

export interface Traversal {
  traverse(options?: { minDepth?: number; maxDepth?: number }): AsyncGenerator<
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
  >;
}
