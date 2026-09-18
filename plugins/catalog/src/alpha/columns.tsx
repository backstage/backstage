/*
 * Copyright 2026 The Backstage Authors
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
  CatalogColumnBlueprint,
  type CatalogColumnFilterContext,
} from '@backstage/plugin-catalog-react/alpha';
import { type TableColumn } from '@backstage/core-components';
import { columnFactories } from '../components/CatalogTable/columns';

const col = (c: TableColumn<any>): TableColumn<{}> => c;

const kindsWithoutSystem = [
  'user',
  'domain',
  'system',
  'group',
  'template',
  'location',
];
const kindsWithoutLifecycle = [
  'user',
  'domain',
  'system',
  'group',
  'template',
  'location',
];
const kindsWithoutOwner = ['user', 'group', 'template', 'location'];

function hideForKinds(kinds: string[]) {
  return ({ kind }: CatalogColumnFilterContext) =>
    !kind || !kinds.includes(kind.toLocaleLowerCase('en-US'));
}

const catalogNameColumn = CatalogColumnBlueprint.make({
  name: 'name',
  params: {
    column: col(columnFactories.createNameColumn()),
  },
});

const catalogSystemColumn = CatalogColumnBlueprint.make({
  name: 'system',
  params: {
    column: col(columnFactories.createSystemColumn()),
    filter: hideForKinds(kindsWithoutSystem),
  },
});

const catalogOwnerColumn = CatalogColumnBlueprint.make({
  name: 'owner',
  params: {
    column: col(columnFactories.createOwnerColumn()),
    filter: hideForKinds(kindsWithoutOwner),
  },
});

const catalogTypeColumn = CatalogColumnBlueprint.make({
  name: 'type',
  params: {
    column: col(columnFactories.createSpecTypeColumn()),
    filter: ({ kind }) => {
      if (!kind) return true;
      const k = kind.toLocaleLowerCase('en-US');
      return k !== 'user';
    },
  },
});

const catalogLifecycleColumn = CatalogColumnBlueprint.make({
  name: 'lifecycle',
  params: {
    column: col(columnFactories.createSpecLifecycleColumn()),
    filter: hideForKinds(kindsWithoutLifecycle),
  },
});

const catalogDescriptionColumn = CatalogColumnBlueprint.make({
  name: 'description',
  params: {
    column: col(columnFactories.createMetadataDescriptionColumn()),
    filter: ({ kind }) => {
      if (!kind) return true;
      return kind.toLocaleLowerCase('en-US') !== 'location';
    },
  },
});

const catalogTagsColumn = CatalogColumnBlueprint.make({
  name: 'tags',
  params: {
    column: col(columnFactories.createTagsColumn()),
    filter: ({ kind }) => {
      if (!kind) return true;
      return kind.toLocaleLowerCase('en-US') !== 'location';
    },
  },
});

export default [
  catalogNameColumn,
  catalogSystemColumn,
  catalogOwnerColumn,
  catalogTypeColumn,
  catalogLifecycleColumn,
  catalogDescriptionColumn,
  catalogTagsColumn,
];
