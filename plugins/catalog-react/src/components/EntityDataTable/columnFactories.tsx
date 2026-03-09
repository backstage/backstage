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
import { EntityRefLink, EntityRefLinks } from '../EntityRefLink';
import { EntityTableColumnTitle } from '../EntityTable/TitleColumn';
import { getEntityRelations } from '../../utils';

/** @public */
export type EntityRow = Entity & TableItem;

/** @public */
export const columnFactories = Object.freeze({
  createEntityRefColumn(options: {
    defaultKind?: string;
    isRowHeader?: boolean;
  }): ColumnConfig<EntityRow> {
    const isRowHeader = options.isRowHeader ?? true;
    return {
      id: 'name',
      label: 'Name',
      header: () => (
        <Column id="name" isRowHeader={isRowHeader}>
          <EntityTableColumnTitle translationKey="name" />
        </Column>
      ),
      isRowHeader,
      cell: entity => (
        <Cell>
          <EntityRefLink
            entityRef={entity}
            defaultKind={options.defaultKind}
            title={entity.metadata?.title}
          />
        </Cell>
      ),
    };
  },

  createEntityRelationColumn(options: {
    id: string;
    translationKey: 'owner' | 'system' | 'domain';
    relation: string;
    defaultKind?: string;
    filter?: { kind: string };
  }): ColumnConfig<EntityRow> {
    return {
      id: options.id,
      label: options.id.charAt(0).toUpperCase() + options.id.slice(1),
      header: () => (
        <Column id={options.id}>
          <EntityTableColumnTitle translationKey={options.translationKey} />
        </Column>
      ),
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
    };
  },

  createOwnerColumn(): ColumnConfig<EntityRow> {
    return this.createEntityRelationColumn({
      id: 'owner',
      translationKey: 'owner',
      relation: RELATION_OWNED_BY,
      defaultKind: 'group',
    });
  },

  createSystemColumn(): ColumnConfig<EntityRow> {
    return this.createEntityRelationColumn({
      id: 'system',
      translationKey: 'system',
      relation: RELATION_PART_OF,
      defaultKind: 'system',
      filter: { kind: 'system' },
    });
  },

  createDomainColumn(): ColumnConfig<EntityRow> {
    return this.createEntityRelationColumn({
      id: 'domain',
      translationKey: 'domain',
      relation: RELATION_PART_OF,
      defaultKind: 'domain',
      filter: { kind: 'domain' },
    });
  },

  createMetadataDescriptionColumn(): ColumnConfig<EntityRow> {
    return {
      id: 'description',
      label: 'Description',
      header: () => (
        <Column id="description">
          <EntityTableColumnTitle translationKey="description" />
        </Column>
      ),
      cell: entity => <CellText title={entity.metadata.description ?? ''} />,
    };
  },

  createSpecTypeColumn(): ColumnConfig<EntityRow> {
    return {
      id: 'type',
      label: 'Type',
      header: () => (
        <Column id="type">
          <EntityTableColumnTitle translationKey="type" />
        </Column>
      ),
      cell: entity => (
        <CellText
          title={
            (entity.spec as Record<string, string> | undefined)?.type ?? ''
          }
        />
      ),
    };
  },

  createSpecLifecycleColumn(): ColumnConfig<EntityRow> {
    return {
      id: 'lifecycle',
      label: 'Lifecycle',
      header: () => (
        <Column id="lifecycle">
          <EntityTableColumnTitle translationKey="lifecycle" />
        </Column>
      ),
      cell: entity => (
        <CellText
          title={
            (entity.spec as Record<string, string> | undefined)?.lifecycle ?? ''
          }
        />
      ),
    };
  },
});
