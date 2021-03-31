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

import {
  createApiEntityRefColumn,
  createApiTagsColumn,
  createApiTypeColumn,
  createDescriptionColumn,
  createLifecycleColumn,
  createOwnerColumn,
  createSystemColumn,
} from './columns';
import {
  createTypeFilter,
  createLifecycleFilter,
  createTagsFilter,
  createOwnerFilter,
} from './filters';
import { Columns, Filters } from './types';

export const defaultColumns: Columns = {
  name: createApiEntityRefColumn(),
  system: createSystemColumn(),
  owner: createOwnerColumn(),
  lifecycle: createLifecycleColumn(),
  type: createApiTypeColumn(),
  description: createDescriptionColumn(),
  tags: createApiTagsColumn(),
};

export const defaultFilters: Filters = {
  owner: createOwnerFilter(),
  type: createTypeFilter(),
  lifecycle: createLifecycleFilter(),
  tags: createTagsFilter(),
};
