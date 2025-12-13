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

import * as parser from 'uri-template';

import { ConfigApi, DiscoveryApi, FetchApi } from '@backstage/core-plugin-api';
import {
  GraphQueryRequest,
  GraphQueryResult,
} from '@backstage/plugin-catalog-graph-common';

import { ALL_RELATION_PAIRS, ALL_RELATIONS, RelationPairs } from '../lib/types';
import {
  CatalogGraphApi,
  DefaultRelations,
  DefaultRelationsExclude,
  DefaultRelationsInclude,
} from './CatalogGraphApi';
import {
  CATALOG_FILTER_EXISTS,
  EntityFilterQuery,
} from '@backstage/catalog-client';

/**
 * Options for the {@link DefaultCatalogGraphApi}.
 *
 * @public
 */
export interface DefaultCatalogGraphApiOptions {
  config: ConfigApi;
  discoveryApi: DiscoveryApi;
  fetchApi: FetchApi;

  /**
   * Known relations.
   * Defaults to the built-in relations, but can be customed so the UI suggests
   * other relations in the drop-down.
   *
   * Can also be configured via `catalogGraph.knownRelations` in app config.
   */
  readonly knownRelations?: string[];

  /**
   * Add known relations on top of the built-in ones.
   *
   * Can also be configured via `catalogGraph.additionalKnownRelations` in app config.
   */
  readonly additionalKnownRelations?: string[];

  /**
   * Known relation pairs.
   * Defaults to the built-in relation pairs, but can be customed to incude more
   * relations pairs for custom relations.
   *
   * Can also be configured via `catalogGraph.knownRelationPairs` in app config.
   */
  readonly knownRelationPairs?: RelationPairs;

  /**
   * Add known relations on top of the built-in ones.
   *
   * Can also be configured via `catalogGraph.additionalKnownRelationPairs` in app config.
   */
  readonly additionalKnownRelationPairs?: RelationPairs;

  /**
   * Default relation types. These are the relation types that will be used by
   * default in the UI, unless overridden by props.
   *
   * Defaults to all relations, but can be customed to include more relations
   * or exclude certain relations that aren't suitable or feasible to display.
   *
   * Can also be configured via `catalogGraph.defaultRelationTypes` in app config.
   */
  readonly defaultRelationTypes?: DefaultRelations;
}

function ensureRelationPairs(configArray: unknown): RelationPairs | undefined {
  if (!configArray) return undefined;

  const errorMessage =
    'Invalid relation pair in config catalogGraph.knownRelationPairs or ' +
    'catalogGraph.additionalKnownRelationPairs, ' +
    `expected array of [strings, string] tuple`;

  if (!Array.isArray(configArray)) {
    throw new Error(errorMessage);
  }

  return configArray.map(value => {
    if (
      !Array.isArray(value) ||
      value.length !== 2 ||
      typeof value[0] !== 'string' ||
      typeof value[1] !== 'string'
    ) {
      throw new Error(errorMessage);
    }
    return value as [string, string];
  });
}

function ensureDefaultRelationTypes(
  config: unknown,
): DefaultRelations | undefined {
  if (!config) {
    return undefined;
  }

  if (
    typeof config === 'object' &&
    (Array.isArray((config as any).exclude) ||
      Array.isArray((config as any).include))
  ) {
    return config as DefaultRelations;
  }

  throw new Error(
    'Invalid config catalogGraph.defaultRelationTypes, ' +
      'expected either { exclude: string[] } or { include: string[] }',
  );
}

function concatRelations(
  base: string[],
  additional: string[] | undefined,
): string[] {
  return Array.from(new Set([...base, ...(additional ?? [])]));
}

function concatRelationPairs(
  base: [string, string][],
  additional: [string, string][] | undefined,
): [string, string][] {
  const seenPairs = [] as [string, string][];
  return [...base, ...(additional ?? [])].filter(pair => {
    if (seenPairs.some(seen => seen[0] === pair[0] && seen[1] === pair[1])) {
      return false;
    }
    seenPairs.push(pair);
    return true;
  });
}

/**
 * The default implementation of the {@link CatalogGraphApi}.
 *
 * @public
 */
export class DefaultCatalogGraphApi implements CatalogGraphApi {
  readonly #discoveryApi: DiscoveryApi;
  readonly #fetchApi: FetchApi;

  readonly knownRelations: string[];
  readonly knownRelationPairs: [string, string][];
  readonly defaultRelations: string[];
  readonly maxDepth: number;

  constructor({
    config,
    discoveryApi,
    fetchApi,

    knownRelations,
    additionalKnownRelations,
    knownRelationPairs,
    additionalKnownRelationPairs,
    defaultRelationTypes,
  }: DefaultCatalogGraphApiOptions) {
    this.#discoveryApi = discoveryApi;
    this.#fetchApi = fetchApi;

    this.knownRelations = concatRelations(
      knownRelations ??
        config.getOptionalStringArray('catalogGraph.knownRelations') ??
        ALL_RELATIONS,
      additionalKnownRelations ??
        config.getOptionalStringArray(
          'catalogGraph.additionalKnownRelations',
        ) ??
        [],
    );

    this.knownRelationPairs = concatRelationPairs(
      knownRelationPairs ??
        ensureRelationPairs(
          config.getOptional('catalogGraph.knownRelationPairs'),
        ) ??
        ALL_RELATION_PAIRS,
      additionalKnownRelationPairs ??
        ensureRelationPairs(
          config.getOptional('catalogGraph.additionalKnownRelationPairs'),
        ) ??
        [],
    );

    const defaultRelations = ensureDefaultRelationTypes(
      defaultRelationTypes,
    ) ?? { exclude: [] };

    if (Array.isArray((defaultRelations as DefaultRelationsInclude).include)) {
      const defaultRelationsInclude =
        defaultRelations as DefaultRelationsInclude;

      this.defaultRelations = this.knownRelations.filter(rel =>
        defaultRelationsInclude.include.includes(rel),
      );
    } else {
      const defaultRelationsExclude =
        defaultRelations as DefaultRelationsExclude;

      this.defaultRelations = this.knownRelations.filter(
        rel => !defaultRelationsExclude.exclude.includes(rel),
      );
    }

    const maxDepth = config.getOptionalNumber('catalogGraph.maxDepth');
    this.maxDepth = maxDepth ?? Number.POSITIVE_INFINITY;
  }

  // This is a copy from CatalogClient's implementation, to mimic the filter query
  private getFilterValue(filter: EntityFilterQuery = []) {
    const filters: string[] = [];
    for (const filterItem of [filter].flat()) {
      const filterParts: string[] = [];
      for (const [key, value] of Object.entries(filterItem)) {
        for (const v of [value].flat()) {
          if (v === CATALOG_FILTER_EXISTS) {
            filterParts.push(key);
          } else if (typeof v === 'string') {
            filterParts.push(`${key}=${v}`);
          }
        }
      }

      if (filterParts.length) {
        filters.push(filterParts.join(','));
      }
    }
    return filters;
  }

  async fetchGraph(request: GraphQueryRequest): Promise<GraphQueryResult> {
    const baseUrl = await this.#discoveryApi.getBaseUrl('catalog');

    const uriTemplate = `/graph/by-query{?rootEntityRefs,maxDepth,relations,fields,filter*}`;

    const uri = parser.parse(uriTemplate).expand({
      rootEntityRefs: request.rootEntityRefs,
      maxDepth: request.maxDepth,
      relations: request.relations,
      fields: request.fields,
      filter: request.filter ? this.getFilterValue(request.filter) : [],
    });

    const resp = await this.#fetchApi.fetch(`${baseUrl}${uri}`);

    const graph = (await resp.json()) as GraphQueryResult;

    return graph;
  }
}
