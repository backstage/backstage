/*
 * Copyright 2023 The Backstage Authors
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

import { TableColumn } from '@backstage/core-components';
import { columnFactories } from './columns';
import { CatalogTableColumnsFunc, CatalogTableRow } from './types';

// The defaultCatalogTableColumnsFunc symbol is not directly exported, but through the
// CatalogTable.defaultColumnsFunc field.
/** @public */
export const defaultCatalogTableColumnsFunc: CatalogTableColumnsFunc = ({
  filters,
  entities,
}) => {
  const showTypeColumn = filters.type === undefined;

  return [
    columnFactories.createTitleColumn({ hidden: true }),
    columnFactories.createNameColumn({ defaultKind: filters.kind?.value }),
    ...createEntitySpecificColumns(),
    columnFactories.createMetadataDescriptionColumn(),
    columnFactories.createTagsColumn(),
  ];

  function createEntitySpecificColumns(): TableColumn<CatalogTableRow>[] {
    const baseColumns = [
      columnFactories.createSystemColumn(),
      columnFactories.createOwnerColumn(),
      columnFactories.createSpecTypeColumn({ hidden: !showTypeColumn }),
      columnFactories.createSpecLifecycleColumn(),
    ];
    switch (filters.kind?.value) {
      case 'user':
        return [];
      case 'domain':
      case 'system':
        return [columnFactories.createOwnerColumn()];
      case 'group':
      case 'template':
        return [
          columnFactories.createSpecTypeColumn({ hidden: !showTypeColumn }),
        ];
      case 'location':
        return [
          columnFactories.createSpecTypeColumn({ hidden: !showTypeColumn }),
          columnFactories.createSpecTargetsColumn(),
        ];
      default:
        return entities.every(entity => entity.metadata.namespace === 'default')
          ? baseColumns
          : [...baseColumns, columnFactories.createNamespaceColumn()];
    }
  }
};
