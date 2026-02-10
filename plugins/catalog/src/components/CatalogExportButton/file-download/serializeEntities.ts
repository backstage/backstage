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
import { Entity } from '@backstage/catalog-model';
import stringifySync from 'csv-stringify/lib/sync';

/**
 * @public
 */
export interface ExportColumn {
  entityFilterKey: string;
  title: string;
}

const getByPath = (obj: any, path: string): unknown => {
  return path
    .split('.')
    .reduce(
      (acc, part) =>
        acc === null || acc === undefined ? undefined : acc[part],
      obj,
    );
};

const escapeCsvValue = (value: string): string => {
  if (value === null || value === undefined) return '';

  // Preserve newlines, as the JSON exporter does this as well
  let safe = value.replace(/(\r\n|\n|\r)/gm, '\\n');

  // Prevent CSV / formula injection
  if (/^[=+\-@]/.test(safe)) {
    safe = `'${safe}`;
  }

  return safe;
};

export const getEntityDataFromColumns = (
  entity: Entity,
  columns: ExportColumn[],
) => {
  const mappedData: Record<string, unknown> = {};
  for (const col of columns) {
    mappedData[col.title] = getByPath(entity, col.entityFilterKey);
  }
  return mappedData;
};

export const serializeEntitiesToCsv = (
  entities: Entity[],
  columns: ExportColumn[],
  addHeader: boolean = true,
): string => {
  const rows = entities.map(e => getEntityDataFromColumns(e, columns));
  return stringifySync(rows, {
    header: addHeader,
    columns: columns.map(c => ({ key: c.title, header: c.title })),
    cast: {
      string: escapeCsvValue,
    },
  });
};

export const serializeEntityToJsonRow = (
  entity: Entity,
  columns: ExportColumn[],
): string => {
  const row = getEntityDataFromColumns(entity, columns);
  return JSON.stringify(row, null, 2);
};
