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

import type { DefaultRelations } from './src/api/CatalogGraphApi';
import type { RelationPairs } from './src/lib/types/relations';

export interface Config {
  /**
   * @deepVisibility frontend
   */
  catalogGraph?: {
    /**
     * The mode to use for fetching the graph.
     * If `catalog-backend-module-graph` is installed, this can be set to
     * 'backend' to improve performance by constructing the graph in the backend
     * instead of iteratively fetching entities from the frontend.
     *
     * Defaults to 'frontend'.
     */
    fetchMode?: 'frontend' | 'backend';

    /**
     * Hard max depth for the graph. This is respected in both the frontend and
     * the backend.
     *
     * Defaults to Infinity, but can be set to a value which the user cannot
     * override. This is useful for really large catalogs.
     *
     * Can be used alone or together with limitIteration. If combined, whichever
     * limit is reached first will end the graph generation.
     */
    maxDepth?: number;

    /**
     * Stop the iteration which generates the graph in the backend when this
     * amount of entities have been fetched, even if maxDepth isn't reached yet.
     *
     * The maxDepth setting can be a rough approximation of what is a suitable
     * limit of the height of the returned graph, but the graph size will depend
     * also on the number of relations. Graphs starting close to a common root
     * will likely generate a larger graph than those starting closer to a leaf
     * node, given the same maxDepth.
     *
     * This setting can be used to not overwhelm the frontend with too much
     * data, as well as to improve performance by reducing the amount of data
     * sent over the network.
     *
     * Can be used alone or together with maxDepth. If combined, whichever limit
     * is reached first will end the graph generation.
     */
    limitEntities?: number;

    /**
     * Known relations.
     * Defaults to the built-in relations, but can be customed so the UI suggests
     * other relations in the drop-down.
     *
     * To only add relations on top of the built-in ones, use
     * {@link Config.catalogGraph.additionalKnownRelations}
     */
    knownRelations?: string[];

    /**
     * Add known relations on top of the built-in ones.
     */
    additionalKnownRelations?: string[];

    /**
     * Known relation pairs.
     * Defaults to the built-in relation pairs, but can be customed to incude more
     * relations pairs for custom relations.
     *
     * To only add relation pairs on top of the built-in ones, use
     * {@link Config.catalogGraph.additionalKnownRelationPairs}
     */
    knownRelationPairs?: RelationPairs;

    /**
     * Add known relations on top of the built-in ones.
     */
    additionalKnownRelationPairs?: RelationPairs;

    /**
     * Default relation types. These are the relation types that will be used by
     * default in the UI, unless overridden by props.
     *
     * Defaults to all relations, but can be customed to include more relations
     * or exclude certain relations that aren't suitable or feasible to display.
     */
    defaultRelationTypes?: DefaultRelations;
  };
}
