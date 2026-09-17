/*
 * Copyright 2021 The Backstage Authors
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

import { CompoundEntityRef, Entity } from '@backstage/catalog-model';
import { EntityListContextProps } from '@backstage/plugin-catalog-react';
import { TableColumn } from '@backstage/core-components';

/** @public */
export interface CatalogTableRow {
  entity: Entity;
  resolved: {
    // This name is here for backwards compatibility mostly; the presentation of
    // refs in the table should in general be handled with EntityRefLink /
    // EntityName components
    name: string;
    entityRef: string;
    partOfSystemRelationTitle?: string;
    partOfSystemRelations: CompoundEntityRef[];
    ownedByRelationsTitle?: string;
    ownedByRelations: CompoundEntityRef[];
  };
}

/**
 * Typed columns function to dynamically render columns based on entity list context.
 *
 * @public
 */
export type CatalogTableColumnsFunc = (
  entityListContext: EntityListContextProps,
) => TableColumn<CatalogTableRow>[];
