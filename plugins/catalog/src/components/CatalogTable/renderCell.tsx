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

import type { ReactNode, ReactElement, CSSProperties } from 'react';
import {
  Cell,
  CellText,
  TagGroup,
  Tag,
  ButtonIcon,
  TooltipTrigger,
  Tooltip,
  Flex,
} from '@backstage/ui';
import { EntityRefLink, EntityRefLinks } from '@backstage/plugin-catalog-react';
import { TableColumn, TableProps } from '@backstage/core-components';
import { CatalogTableRow } from './types';
import { extractValueByField } from './utils';

/**
 * Renders the appropriate cell component based on the column field
 * @internal
 */
export function renderCell(
  item: CatalogTableRow,
  column: TableColumn<CatalogTableRow>,
  actions?: TableProps<CatalogTableRow>['actions'],
): JSX.Element {
  const cellId = column.field || String(column.title);
  const cellValue = column.field
    ? extractValueByField(item, column.field)
    : null;

  // If column has a custom render function, use it (for backward compatibility with old format)
  if (column.render) {
    // Material Table's render signature: (rowData: T) => ReactNode
    // Our custom format uses: ({ entity, resolved }) => ReactNode
    // Type assertion needed because TypeScript expects Material Table's signature
    const renderFn = column.render as (data: {
      entity: CatalogTableRow['entity'];
      resolved: CatalogTableRow['resolved'];
    }) => ReactNode;
    const renderedContent = renderFn({
      entity: item.entity,
      resolved: item.resolved,
    });
    return (
      <Cell id={cellId} className="bui-TableCell" hidden={column.hidden}>
        {renderedContent}
      </Cell>
    );
  }

  // Determine cell component based on field

  // Name column - EntityRefLink
  if (column.field === 'resolved.entityRef') {
    // The old column format uses filters.kind?.value as defaultKind (see defaultCatalogTableColumnsFunc.tsx)
    // Since we can't access the filter context here, we use the entity's kind as defaultKind
    // This ensures that if the entity kind matches the defaultKind, the kind prefix is omitted
    // (e.g., "api:default/hello-world" with defaultKind="api" shows as "hello-world")
    const defaultKind = item.entity.kind || 'Component';

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

  // Actions column - render action buttons (handled last since it's always the last column)
  if (column.field === '__actions__') {
    if (!actions || actions.length === 0) {
      return <Cell id="actions" className="bui-TableCell" />;
    }

    const actionElements = actions
      .map((actionFnOrObj, index) => {
        // Actions can be either functions that take { entity } and return an action object,
        // or static action objects. Material Table supports both formats.
        let action: {
          icon: () => ReactElement;
          tooltip: string;
          disabled?: boolean;
          onClick: () => void;
          cellStyle?: CSSProperties;
        } | null;

        if (typeof actionFnOrObj === 'function') {
          // Function format: call with { entity }
          const actionFnTyped = actionFnOrObj as (data: {
            entity: CatalogTableRow['entity'];
          }) => {
            icon: () => ReactElement;
            tooltip: string;
            disabled?: boolean;
            onClick: () => void;
            cellStyle?: CSSProperties;
          } | null;
          action = actionFnTyped({ entity: item.entity });
        } else {
          // Object format: use directly
          action = actionFnOrObj as {
            icon: () => ReactElement;
            tooltip: string;
            disabled?: boolean;
            onClick: () => void;
            cellStyle?: CSSProperties;
          } | null;
        }

        if (!action) return null;

        const { icon, tooltip, disabled, onClick, cellStyle } = action;
        const IconComponent = icon();

        return (
          <TooltipTrigger key={index} isDisabled={disabled}>
            <ButtonIcon
              icon={IconComponent}
              aria-label={tooltip}
              isDisabled={disabled}
              onPress={onClick}
              style={cellStyle}
            />
            <Tooltip>{tooltip}</Tooltip>
          </TooltipTrigger>
        );
      })
      .filter(Boolean);

    return (
      <Cell id="actions" className="bui-TableCell">
        <Flex direction="row" gap="2" align="center">
          {actionElements}
        </Flex>
      </Cell>
    );
  }

  // Fallback: use simple string value for other columns
  const cellTitle =
    cellValue !== undefined && cellValue !== null ? String(cellValue) : '';

  return <CellText id={cellId} title={cellTitle} hidden={column.hidden} />;
}
