/*
 * Copyright 2022 The Backstage Authors
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

import { CompoundEntityRef } from '@backstage/catalog-model';
import { LocationSpec as NonDeprecatedLocationSpec } from '@backstage/plugin-catalog-common';

/**
 * Holds the entity location information.
 *
 * @remarks
 *
 *  `presence` flag: when using repo importer plugin, location is being created before the component yaml file is merged to the main branch.
 *  This flag is then set to indicate that the file can be not present.
 *  default value: 'required'.
 *
 * @public
 * @deprecated use the same type from `@backstage/plugin-catalog-common` instead
 */
export type LocationSpec = NonDeprecatedLocationSpec;

/**
 * Holds the relation data for entities.
 *
 * @public
 */
export type EntityRelationSpec = {
  /**
   * The source entity of this relation.
   */
  source: CompoundEntityRef;

  /**
   * The type of the relation.
   */
  type: string;

  /**
   * The target entity of this relation.
   */
  target: CompoundEntityRef;
};

/**
 * A filter expression for entities.
 *
 * @public
 */
export type EntityFilter =
  | { allOf: EntityFilter[] }
  | { anyOf: EntityFilter[] }
  | { not: EntityFilter }
  | EntitiesSearchFilter;

/**
 * Matches rows in the search table.
 *
 * @public
 */
export type EntitiesSearchFilter = {
  /**
   * The key to match on.
   *
   * Matches are always case insensitive.
   */
  key: string;

  /**
   * Match on plain equality of values.
   *
   * Match on values that are equal to any of the given array items. Matches are
   * always case insensitive.
   */
  values?: string[];
};
