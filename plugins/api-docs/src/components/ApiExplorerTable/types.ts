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

import { ApiEntityV1alpha1, EntityName } from '@backstage/catalog-model';
import { TableColumn, TableFilter } from '@backstage/core';

export type EntityRow = {
  entity: ApiEntityV1alpha1;
  resolved: {
    name: string;
    partOfSystemRelationTitle?: string;
    partOfSystemRelations: EntityName[];
    ownedByRelationsTitle?: string;
    ownedByRelations: EntityName[];
  };
};

export type CustomizableTableProps = {
  columns?: CustomColumn;
  filters?: CustomFilter;
};

// Column types
export type DefaultColumnName =
  | 'name'
  | 'system'
  | 'owner'
  | 'lifecycle'
  | 'type'
  | 'description'
  | 'tags';

export type CustomColumn = Record<
  DefaultColumnName | string,
  TableColumn<EntityRow>
>;

export type NullableColumn = TableColumn<EntityRow> | undefined;

// Filter types
type DefaultFilterName = 'owner' | 'type' | 'lifecycle' | 'tags';
export type CustomFilter = Record<DefaultFilterName | string, TableFilter>;
