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

import { Cell, CellText, TagGroup, Tag } from '@backstage/ui';
import { EntityRefLink, EntityRefLinks } from '@backstage/plugin-catalog-react';
import { TableColumn } from '@backstage/core-components';
import { CatalogTableRow } from './types';

/**
 * Helper function to extract value from object using dot-notation path
 */
function extractValueByField(data: any, field: string): any | undefined {
  if (!field) return undefined;
  const path = field.split('.');
  let value = data[path[0]];

  for (let i = 1; i < path.length; ++i) {
    if (value === undefined || value === null) {
      return value;
    }
    value = value[path[i]];
  }

  return value;
}

/**
 * Renders the appropriate cell component based on the column field
 * @internal
 */
export function renderCell(
  item: CatalogTableRow,
  column: TableColumn<CatalogTableRow>,
): JSX.Element {
  const cellId = column.field || String(column.title);
  const cellValue = column.field
    ? extractValueByField(item, column.field)
    : null;

  // Determine cell component based on field

  // Name column - EntityRefLink
  if (column.field === 'resolved.entityRef') {
    // Replicate the formatContent logic from columns.tsx:
    // entity.metadata?.title || humanizeEntityRef(entity, { defaultKind })
    // This ensures we match the exact formatting behavior of the old column format

    // Try to extract defaultKind from the column's render function if it exists
    // The old column format stores defaultKind in the render function's closure
    // Otherwise, fall back to 'Component' (matching old format's default)
    let defaultKind: string = 'Component';

    if (column.render) {
      // The render function receives the item and uses defaultKind from its closure
      // We can't directly extract it, but we can infer from the entity's kind
      // or use the entity's kind as a fallback
      const entityKind = item.entity.kind?.toLowerCase();
      // Use entity kind if it's a common kind, otherwise use Component
      if (
        entityKind &&
        [
          'component',
          'user',
          'system',
          'group',
          'domain',
          'location',
          'template',
        ].includes(entityKind)
      ) {
        defaultKind = item.entity.kind;
      }
    }

    // EntityRefLink uses EntityDisplayName internally, which handles:
    // - metadata.title vs humanizeEntityRef logic via useEntityPresentation
    // - Icon rendering
    // - Tooltip with secondary title
    // We just need to pass defaultKind to match the old column format behavior
    return (
      <Cell id={cellId} className="bui-TableCell" hidden={column.hidden}>
        <EntityRefLink entityRef={item.entity} defaultKind={defaultKind} />
      </Cell>
    );
  }

  // System column - EntityRefLinks
  if (column.field === 'resolved.partOfSystemRelationTitle') {
    return (
      <Cell id={cellId} className="bui-TableCell" hidden={column.hidden}>
        <EntityRefLinks
          entityRefs={item.resolved.partOfSystemRelations || []}
          defaultKind="system"
        />
      </Cell>
    );
  }

  // Owner column - EntityRefLinks
  if (column.field === 'resolved.ownedByRelationsTitle') {
    return (
      <Cell id={cellId} className="bui-TableCell" hidden={column.hidden}>
        <EntityRefLinks
          entityRefs={item.resolved.ownedByRelations || []}
          defaultKind="group"
        />
      </Cell>
    );
  }

  // Tags column
  if (column.field === 'entity.metadata.tags') {
    return (
      <Cell id={cellId} className="bui-TableCell" hidden={column.hidden}>
        <TagGroup>
          {item.entity.metadata.tags &&
            item.entity.metadata.tags.length > 0 &&
            item.entity.metadata.tags.map(tag => (
              <Tag key={tag} size="small">
                {tag}
              </Tag>
            ))}
        </TagGroup>
      </Cell>
    );
  }

  // Description column
  if (column.field === 'entity.metadata.description') {
    return (
      <CellText
        id={cellId}
        title={item.entity.metadata.description || ''}
        hidden={column.hidden}
      />
    );
  }

  // Targets column - use DescriptionCell for comma-separated list
  if (
    column.field === 'entity.spec.targets' ||
    column.field === 'entity.spec.target'
  ) {
    let targets: string[] = [];
    if (item.entity?.spec?.targets && Array.isArray(item.entity.spec.targets)) {
      targets = item.entity.spec.targets as string[];
    } else if (item.entity?.spec?.target) {
      targets = [item.entity.spec.target as string];
    }
    return (
      <CellText id={cellId} title={targets.join(', ')} hidden={column.hidden} />
    );
  }

  // Fallback: use simple string value for other columns
  const cellTitle =
    cellValue !== undefined && cellValue !== null ? String(cellValue) : '';

  return <CellText id={cellId} title={cellTitle} hidden={column.hidden} />;
}
