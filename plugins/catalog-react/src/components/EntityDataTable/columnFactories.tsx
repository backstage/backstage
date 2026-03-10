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
  Entity,
  RELATION_OWNED_BY,
  RELATION_PART_OF,
} from '@backstage/catalog-model';
import { Cell, CellText, Column, ColumnConfig, TableItem } from '@backstage/ui';
import {
  EntityRefLink,
  EntityRefLinks,
  humanizeEntityRef,
} from '../EntityRefLink';
import { EntityTableColumnTitle } from '../EntityTable/TitleColumn';
import { getEntityRelations } from '../../utils';

/** @public */
export type EntityRow = Entity & TableItem;

/** @public */
export interface EntityColumnConfig extends ColumnConfig<EntityRow> {
  sortValue?: (entity: EntityRow) => string;
}

/** @public */
export const columnFactories = Object.freeze({
  createEntityRefColumn(options: {
    defaultKind?: string;
    isRowHeader?: boolean;
  }): EntityColumnConfig {
    const isRowHeader = options.isRowHeader ?? true;
    return {
      id: 'name',
      label: 'Name',
      header: () => (
        <Column id="name" isRowHeader={isRowHeader} allowsSorting>
          <EntityTableColumnTitle translationKey="name" />
        </Column>
      ),
      isRowHeader,
      isSortable: true,
      cell: entity => (
        <Cell>
          <EntityRefLink
            entityRef={entity}
            defaultKind={options.defaultKind}
            title={entity.metadata?.title}
          />
        </Cell>
      ),
      sortValue: entity =>
        entity.metadata?.title ||
        humanizeEntityRef(entity, { defaultKind: options.defaultKind }),
    };
  },

  createEntityRelationColumn(options: {
    id: string;
    translationKey: 'owner' | 'system' | 'domain';
    relation: string;
    defaultKind?: string;
    filter?: { kind: string };
  }): EntityColumnConfig {
    return {
      id: options.id,
      label: options.id.charAt(0).toUpperCase() + options.id.slice(1),
      header: () => (
        <Column id={options.id} allowsSorting>
          <EntityTableColumnTitle translationKey={options.translationKey} />
        </Column>
      ),
      isSortable: true,
      cell: entity => (
        <Cell>
          <EntityRefLinks
            entityRefs={getEntityRelations(
              entity,
              options.relation,
              options.filter,
            )}
            defaultKind={options.defaultKind}
          />
        </Cell>
      ),
      sortValue: entity =>
        getEntityRelations(entity, options.relation, options.filter)
          .map(r => humanizeEntityRef(r, { defaultKind: options.defaultKind }))
          .join(', '),
    };
  },

  createOwnerColumn(): EntityColumnConfig {
    return columnFactories.createEntityRelationColumn({
      id: 'owner',
      translationKey: 'owner',
      relation: RELATION_OWNED_BY,
      defaultKind: 'group',
    });
  },

  createSystemColumn(): EntityColumnConfig {
    return columnFactories.createEntityRelationColumn({
      id: 'system',
      translationKey: 'system',
      relation: RELATION_PART_OF,
      defaultKind: 'system',
      filter: { kind: 'system' },
    });
  },

  createDomainColumn(): EntityColumnConfig {
    return columnFactories.createEntityRelationColumn({
      id: 'domain',
      translationKey: 'domain',
      relation: RELATION_PART_OF,
      defaultKind: 'domain',
      filter: { kind: 'domain' },
    });
  },

  createMetadataDescriptionColumn(): EntityColumnConfig {
    return {
      id: 'description',
      label: 'Description',
      header: () => (
        <Column id="description" allowsSorting>
          <EntityTableColumnTitle translationKey="description" />
        </Column>
      ),
      isSortable: true,
      cell: entity => <CellText title={entity.metadata.description ?? ''} />,
      sortValue: entity => entity.metadata.description ?? '',
    };
  },

  createSpecTypeColumn(): EntityColumnConfig {
    return {
      id: 'type',
      label: 'Type',
      header: () => (
        <Column id="type" allowsSorting>
          <EntityTableColumnTitle translationKey="type" />
        </Column>
      ),
      isSortable: true,
      cell: entity => (
        <CellText
          title={
            (entity.spec as Record<string, string> | undefined)?.type ?? ''
          }
        />
      ),
      sortValue: entity =>
        (entity.spec as Record<string, string> | undefined)?.type ?? '',
    };
  },

  createSpecLifecycleColumn(): EntityColumnConfig {
    return {
      id: 'lifecycle',
      label: 'Lifecycle',
      header: () => (
        <Column id="lifecycle" allowsSorting>
          <EntityTableColumnTitle translationKey="lifecycle" />
        </Column>
      ),
      isSortable: true,
      cell: entity => (
        <CellText
          title={
            (entity.spec as Record<string, string> | undefined)?.lifecycle ?? ''
          }
        />
      ),
      sortValue: entity =>
        (entity.spec as Record<string, string> | undefined)?.lifecycle ?? '',
    };
  },
});
