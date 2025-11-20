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
import stringifySync from 'csv-stringify/lib/sync';
import type { Exporter, Column } from '../types';
import { getEntityDataFromColumns } from '../util';
import { Entity } from '@backstage/catalog-model';

export class CsvExporter implements Exporter {
  contentType = 'text/csv; charset=utf-8';
  filename = 'catalog-export.csv';

  async serialize(entities: Entity[], columns: Column[]) {
    const rows = entities.map(e => getEntityDataFromColumns(e, columns));
    return stringifySync(rows, {
      header: true,
      columns: columns.map(c => ({ key: c.title, header: c.title })),
      cast: {
        // Preserve newlines, as the JSON exporter does this as well
        string: (value: string) => value.replace(/(\r\n|\n|\r)/gm, '\\n'),
      },
    });
  }
}
