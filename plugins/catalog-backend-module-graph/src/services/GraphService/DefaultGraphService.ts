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

import type {
  GraphQueryRequest,
  GraphQueryResult,
} from '@backstage/plugin-catalog-graph-common';
import { CatalogService } from '@backstage/plugin-catalog-node';
import { BackstageCredentials } from '@backstage/backend-plugin-api';
import {
  Entity,
  EntityRelation,
  parseEntityRef,
  stringifyEntityRef,
} from '@backstage/catalog-model';

import { GraphService } from './GraphService';
import { getAllKindsFromFilter } from '../../lib/request';

export class DefaultGraphService implements GraphService {
  readonly #catalog: CatalogService;
  readonly #maxDepth: number;
  readonly #limitEntities: number;

  constructor({
    catalog,
    maxDepth,
    limitEntities,
  }: {
    catalog: CatalogService;
    maxDepth: number;
    limitEntities: number;
  }) {
    this.#catalog = catalog;
    this.#maxDepth = maxDepth;
    this.#limitEntities = limitEntities;
  }

  async fetchGraph(
    request: GraphQueryRequest,
    credentials: BackstageCredentials,
  ): Promise<GraphQueryResult> {
    const {
      rootEntityRefs,
      relations,
      maxDepth: userMaxDepth = Number.POSITIVE_INFINITY,
      fields,
      filter,
    } = request;

    if (fields && fields.length > 0 && !fields.includes('relations')) {
      fields.push('relations');
    }

    const kindsSet = getAllKindsFromFilter(filter ?? []);

    const maxDepth = Math.min(userMaxDepth, this.#maxDepth);

    const includeRelationType = relations
      ? (type: string) => relations.includes(type)
      : () => true;

    const includeKind = !kindsSet
      ? () => true
      : (kind: string) => kindsSet.has(kind.toLocaleLowerCase('en-US'));

    const includeRelation = (rel: EntityRelation) => {
      const target = parseEntityRef(rel.targetRef);
      return includeRelationType(rel.type) && includeKind(target.kind);
    };

    let cutoff: boolean = false;
    const visited = new Set<string>();
    const result = new Map<string, Entity>();
    let curDepth = 0;
    let entitiesToFetch = rootEntityRefs;
    while (!isFinite(maxDepth) || curDepth <= maxDepth) {
      ++curDepth;

      for (const entityRef of entitiesToFetch) {
        visited.add(entityRef);
      }

      if (this.#limitEntities < result.size + entitiesToFetch.length) {
        cutoff = true;
        entitiesToFetch = entitiesToFetch.slice(
          0,
          Math.max(0, this.#limitEntities - result.size),
        );
      }

      const { items } = await this.#catalog.getEntitiesByRefs(
        { entityRefs: entitiesToFetch, fields, filter },
        { credentials },
      );

      const foundEntities = items.filter(
        (v): v is NonNullable<typeof v> => !!v,
      );

      for (const entity of foundEntities) {
        result.set(stringifyEntityRef(entity), entity);
      }

      entitiesToFetch = Array.from(
        new Set(
          foundEntities.flatMap((entity): string[] =>
            (entity.relations ?? [])
              .filter(rel => includeRelation(rel))
              .map(rel => rel.targetRef),
          ),
        ),
      ).filter(entityRef => !visited.has(entityRef));

      if (entitiesToFetch.length === 0) {
        break;
      }
    }

    return {
      entities: Array.from(result.values()),
      cutoff,
    };
  }
}
