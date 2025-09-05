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

import { ALL_RELATION_PAIRS, ALL_RELATIONS, RelationPairs } from '../lib/types';
import {
  CatalogGraphApi,
  DefaultRelations,
  DefaultRelationsExclude,
  DefaultRelationsInclude,
} from './CatalogGraphApi';

/**
 * Options for the {@link DefaultCatalogGraphApi}.
 *
 * @public
 */
export interface DefaultCatalogGraphApiOptions {
  readonly knownRelations?: string[];
  readonly knownRelationPairs?: RelationPairs;
  readonly defaultRelationTypes?: DefaultRelations;
}

/**
 * The default implementation of the {@link CatalogGraphApi}.
 *
 * @public
 */
export class DefaultCatalogGraphApi implements CatalogGraphApi {
  readonly knownRelations: string[];
  readonly knownRelationPairs: [string, string][];
  readonly defaultRelations: string[];

  constructor(
    options: DefaultCatalogGraphApiOptions = {
      knownRelations: ALL_RELATIONS,
      knownRelationPairs: ALL_RELATION_PAIRS,
      defaultRelationTypes: { exclude: [] },
    },
  ) {
    this.knownRelations = options.knownRelations ?? ALL_RELATIONS;
    this.knownRelationPairs = options.knownRelationPairs ?? ALL_RELATION_PAIRS;

    const defaultRelations = options.defaultRelationTypes;

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
  }
}
