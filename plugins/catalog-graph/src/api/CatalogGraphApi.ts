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

import { createApiRef } from '@backstage/core-plugin-api';

/**
 * Utility API reference for the {@link CatalogGraphApi}.
 *
 * @public
 */
export const catalogGraphApiRef = createApiRef<CatalogGraphApi>({
  id: 'plugin.catalog-graph.service',
});

/** @public */
export type DefaultRelationsInclude = { include: string[] };

/** @public */
export type DefaultRelationsExclude = { exclude: string[] };

/**
 * Default relations. Can either be a list of relations to use by default, or
 * a list of relations to _not_ use, i.e. include all other relations.
 *
 * @public
 */
export type DefaultRelations =
  | DefaultRelationsInclude
  | DefaultRelationsExclude;

/**
 * API for driving catalog imports.
 *
 * @public
 */
export interface CatalogGraphApi {
  /** All known relations */
  readonly knownRelations: string[];

  /** All known relation pairs */
  readonly knownRelationPairs: [string, string][];

  /** The default relations to show in the graph */
  readonly defaultRelations: string[];
}
