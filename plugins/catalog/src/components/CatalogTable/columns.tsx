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
import { EntityRefLink, EntityRefLinks } from '@backstage/plugin-catalog-react';
import Chip from '@material-ui/core/Chip';
import { CatalogTableRow } from './types';
import { ColumnConfig, Cell, CellText } from '@backstage/ui';
import { Entity } from '@backstage/catalog-model';

// The columnFactories symbol is not directly exported, but through the
// CatalogTable.columns field.
/** @public */
export const columnFactories = Object.freeze({
  createNameColumn(options?: {
    defaultKind?: string;
  }): ColumnConfig<CatalogTableRow> {
    return {
      id: 'name',
      label: 'Name',
      isRowHeader: true,
      isSortable: true,
      cell: ({ entity }) => (
        <Cell>
          <EntityRefLink
            entityRef={entity}
            defaultKind={options?.defaultKind || 'Component'}
          />
        </Cell>
      ),
    };
  },
  createSystemColumn(): ColumnConfig<CatalogTableRow> {
    return {
      id: 'system',
      label: 'System',
      cell: ({ resolved }) => (
        <Cell>
          <EntityRefLinks
            entityRefs={resolved.partOfSystemRelations}
            defaultKind="system"
          />
        </Cell>
      ),
    };
  },
  createOwnerColumn(): ColumnConfig<CatalogTableRow> {
    return {
      id: 'owner',
      label: 'Owner',
      cell: ({ resolved }) => (
        <Cell>
          <EntityRefLinks
            entityRefs={resolved.ownedByRelations}
            defaultKind="group"
          />
        </Cell>
      ),
    };
  },
  createSpecTargetsColumn(): ColumnConfig<CatalogTableRow> {
    return {
      id: 'targets',
      label: 'Targets',
      cell: ({ entity }) => {
        const targets = entity?.spec?.targets || entity?.spec?.target;
        if (!targets) return <Cell />;
        const targetText = Array.isArray(targets)
          ? targets.join(', ')
          : String(targets);
        return <CellText title={targetText} />;
      },
    };
  },
  createSpecTypeColumn(
    options: {
      hidden: boolean;
    } = { hidden: false },
  ): ColumnConfig<CatalogTableRow> {
    return {
      id: 'type',
      label: 'Type',
      isHidden: options.hidden,
      cell: ({ entity }) => (
        <CellText title={String(entity.spec?.type || '')} />
      ),
    };
  },
  createSpecLifecycleColumn(): ColumnConfig<CatalogTableRow> {
    return {
      id: 'lifecycle',
      label: 'Lifecycle',
      cell: ({ entity }) => (
        <CellText title={String(entity.spec?.lifecycle || '')} />
      ),
    };
  },
  createMetadataDescriptionColumn(): ColumnConfig<CatalogTableRow> {
    return {
      id: 'description',
      label: 'Description',
      cell: ({ entity }) => (
        <CellText title={entity.metadata.description || ''} />
      ),
    };
  },
  createTagsColumn(): ColumnConfig<CatalogTableRow> {
    return {
      id: 'tags',
      label: 'Tags',
      cell: ({ entity }) => (
        <Cell>
          {entity.metadata.tags &&
            entity.metadata.tags.map(t => (
              <Chip
                key={t}
                label={t}
                size="small"
                variant="outlined"
                style={{ marginBottom: '0px', marginRight: '4px' }}
              />
            ))}
        </Cell>
      ),
    };
  },
  createTitleColumn(options?: {
    hidden?: boolean;
  }): ColumnConfig<CatalogTableRow> {
    return {
      id: 'title',
      label: 'Title',
      isHidden: options?.hidden,
      cell: ({ entity }) => <CellText title={entity.metadata.title || ''} />,
    };
  },
  createLabelColumn(
    key: string,
    options?: { title?: string; defaultValue?: string },
  ): ColumnConfig<CatalogTableRow> {
    return {
      id: `label-${key}`,
      label: options?.title || 'Label',
      isSortable: true,
      cell: ({ entity }: { entity: Entity }) => {
        const labels: Record<string, string> | undefined =
          entity.metadata?.labels;
        const specifiedLabelValue =
          (labels && labels[key]) || options?.defaultValue;
        return (
          <Cell>
            {specifiedLabelValue && (
              <Chip
                key={specifiedLabelValue}
                label={specifiedLabelValue}
                size="small"
                variant="outlined"
              />
            )}
          </Cell>
        );
      },
    };
  },
  createNamespaceColumn(): ColumnConfig<CatalogTableRow> {
    return {
      id: 'namespace',
      label: 'Namespace',
      cell: ({ entity }) => (
        <CellText title={entity.metadata.namespace || 'default'} />
      ),
    };
  },
});
