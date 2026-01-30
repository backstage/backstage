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

import { Entity } from '@backstage/catalog-model';
import { TableColumn } from '@backstage/core-components';
import { CatalogTableRow } from './types';

/**
 * Configuration for a custom column.
 * @public
 */
export interface CustomColumnConfig {
  title: string;
  field: string;
  width?: number;
  sortable?: boolean;
  defaultValue?: string;
  kind?: string | string[];
}

/**
 * Configuration for catalog table columns.
 * @public
 */
export interface ColumnConfig {
  include?: string[];
  exclude?: string[];
  custom?: CustomColumnConfig[];
}

/**
 * Built-in column IDs that can be used with include/exclude.
 * @public
 */
export const BUILTIN_COLUMN_IDS = [
  'name',
  'owner',
  'type',
  'lifecycle',
  'description',
  'tags',
  'namespace',
  'system',
  'targets',
] as const;

export type BuiltinColumnId = (typeof BUILTIN_COLUMN_IDS)[number];

/**
 * Resolves a field path from an entity.
 * Supports dot notation and bracket notation for annotations/labels.
 * Examples:
 *   - "metadata.name"
 *   - "metadata.annotations['backstage.io/techdocs-ref']"
 *   - "spec.type"
 * @public
 */
export function resolveFieldPath(entity: Entity, fieldPath: string): unknown {
  const parts: string[] = [];
  let current = '';
  let inBracket = false;

  for (let i = 0; i < fieldPath.length; i++) {
    const char = fieldPath[i];

    if (char === '[' && !inBracket) {
      if (current) {
        parts.push(current);
        current = '';
      }
      inBracket = true;
    } else if (char === ']' && inBracket) {
      // Remove quotes from bracket notation
      const bracketContent = current.replace(/^['"]|['"]$/g, '');
      parts.push(bracketContent);
      current = '';
      inBracket = false;
    } else if (char === '.' && !inBracket) {
      if (current) {
        parts.push(current);
        current = '';
      }
    } else {
      current += char;
    }
  }

  if (current) {
    parts.push(current);
  }

  let value: unknown = entity;
  for (const part of parts) {
    if (value === null || value === undefined) {
      return undefined;
    }
    if (typeof value === 'object') {
      value = (value as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }

  return value;
}

/**
 * Creates a custom column from configuration.
 */
export function createCustomColumn(
  config: CustomColumnConfig,
): TableColumn<CatalogTableRow> {
  const { title, field, width, sortable = true, defaultValue, kind } = config;

  return {
    title,
    field: `entity.${field}`,
    width: width ? `${width}px` : 'auto',
    sorting: sortable,
    render: ({ entity }) => {
      // Check if kind filter applies
      if (kind) {
        const entityKind = entity.kind?.toLowerCase();
        const allowedKinds = Array.isArray(kind)
          ? kind.map(k => k.toLowerCase())
          : [kind.toLowerCase()];
        if (!allowedKinds.includes(entityKind)) {
          return null;
        }
      }

      const value = resolveFieldPath(entity, field);

      if (value === undefined || value === null || value === '') {
        return defaultValue ?? '';
      }

      if (Array.isArray(value)) {
        return value.join(', ');
      }

      return String(value);
    },
    customSort: sortable
      ? ({ entity: entity1 }, { entity: entity2 }) => {
          const value1 = resolveFieldPath(entity1, field);
          const value2 = resolveFieldPath(entity2, field);
          const str1 =
            value1 !== null && value1 !== undefined ? String(value1) : '';
          const str2 =
            value2 !== null && value2 !== undefined ? String(value2) : '';
          return str1.localeCompare(str2);
        }
      : undefined,
  };
}

/**
 * Applies column configuration to filter and extend columns.
 * @public
 */
export function applyColumnConfig(
  columns: TableColumn<CatalogTableRow>[],
  config: ColumnConfig | undefined,
): TableColumn<CatalogTableRow>[] {
  if (!config) {
    return columns;
  }

  let result = [...columns];

  // Apply include filter (whitelist)
  if (config.include && config.include.length > 0) {
    const includeSet = new Set(config.include.map(id => id.toLowerCase()));
    result = result.filter(col => {
      const colId = getColumnId(col);
      return colId && includeSet.has(colId.toLowerCase());
    });
  }

  // Apply exclude filter (blacklist)
  if (config.exclude && config.exclude.length > 0) {
    const excludeSet = new Set(config.exclude.map(id => id.toLowerCase()));
    result = result.filter(col => {
      const colId = getColumnId(col);
      return !colId || !excludeSet.has(colId.toLowerCase());
    });
  }

  // Add custom columns
  if (config.custom && config.custom.length > 0) {
    const customColumns = config.custom.map(createCustomColumn);
    result = [...result, ...customColumns];
  }

  return result;
}

/**
 * Extracts the column ID from a TableColumn.
 * The ID is derived from the field property or title.
 */
function getColumnId(column: TableColumn<CatalogTableRow>): string | undefined {
  if (typeof column.field === 'string') {
    // Extract the last part of field path for matching
    // e.g., "entity.spec.type" -> "type"
    // e.g., "resolved.ownedByRelationsTitle" -> "owner" (special case)
    const field = column.field;

    if (field.includes('ownedByRelations')) {
      return 'owner';
    }
    if (field.includes('partOfSystemRelation')) {
      return 'system';
    }
    if (field === 'resolved.entityRef' || field.includes('.name')) {
      return 'name';
    }
    if (field.includes('spec.type')) {
      return 'type';
    }
    if (field.includes('spec.lifecycle')) {
      return 'lifecycle';
    }
    if (field.includes('description')) {
      return 'description';
    }
    if (field.includes('tags')) {
      return 'tags';
    }
    if (field.includes('namespace')) {
      return 'namespace';
    }
    if (field.includes('targets') || field.includes('target')) {
      return 'targets';
    }
  }

  // Fallback to title-based matching
  const title =
    typeof column.title === 'string' ? column.title.toLowerCase() : undefined;

  if (title) {
    for (const id of BUILTIN_COLUMN_IDS) {
      if (title.includes(id)) {
        return id;
      }
    }
  }

  return undefined;
}
