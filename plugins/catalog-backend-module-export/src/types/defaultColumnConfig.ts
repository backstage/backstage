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
import { Column } from './column';

// Map API request input to entity filter
export const REQUEST_COLUMN_ENTITY_FILTER_MAP: Record<string, string> = {
  type: 'spec.type',
  lifecycle: 'spec.lifecycle',
  owner: 'spec.owner',
  namespace: 'metadata.namespace',
  name: 'metadata.name',
  title: 'metadata.title',
  description: 'metadata.description',
  tags: 'metadata.tags',
};

export const DEFAULT_COLUMNS: Column[] = [
  { entityFilterKey: 'spec.type', title: 'Type' },
  { entityFilterKey: 'metadata.title', title: 'Title' },
  { entityFilterKey: 'metadata.description', title: 'Description' },
  { entityFilterKey: 'spec.owner', title: 'Owner' },
  { entityFilterKey: 'spec.additionalOwners', title: 'Additional owners' },
  { entityFilterKey: 'metadata.criticality', title: 'Criticality' },
];
