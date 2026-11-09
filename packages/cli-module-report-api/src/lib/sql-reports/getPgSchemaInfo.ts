/*
 * Copyright 2024 The Backstage Authors
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

import type { Knex } from 'knex';
import { SchemaIndexInfo, SchemaInfo, SchemaSequenceInfo } from './types';

export async function getPgSchemaInfo(knex: Knex): Promise<SchemaInfo> {
  const { rows: tableNames } = await knex.raw<{ rows: { name: string }[] }>(`
    SELECT table_name as name
    FROM information_schema.tables
    WHERE
      table_schema = 'public'
      AND table_type = 'BASE TABLE'
      AND table_name NOT LIKE 'knex_migrations%'
  `);

  const tables = Object.fromEntries(
    await Promise.all(
      tableNames.map(async ({ name }) => {
        const columns = await knex.table(name).columnInfo();
        const { rows: indices } = await knex.raw<{
          rows: SchemaIndexInfo[];
        }>(
          `
          SELECT
            index_class.relname as name,
            index.indisunique as unique,
            index.indisprimary as primary,
            json_agg(attribute.attname ORDER BY keys.rn) as columns
          FROM
            pg_class table_class,
            pg_class index_class,
            pg_index index,
            UNNEST(index.indkey) WITH ORDINALITY keys(id, rn)
          INNER JOIN pg_attribute attribute
            ON attribute.attnum = keys.id
          WHERE
            table_class.oid = index.indrelid
            AND table_class.relkind = 'r'
            AND table_class.relname = ?
            AND index_class.oid = index.indexrelid
            AND attribute.attrelid = table_class.oid
          GROUP BY index_class.relname, index.indexrelid
        `,
          [name],
        );
        return [
          name,
          {
            name,
            columns,
            indices: Object.fromEntries(
              indices.map(index => [index.name, index]),
            ),
          },
        ];
      }),
    ),
  );

  const { rows: sequences } = await knex.raw<{
    rows: SchemaSequenceInfo[];
  }>(`
    SELECT sequence_name as name, data_type as type
    FROM information_schema.sequences
    WHERE
      sequence_schema = 'public'
      AND sequence_name NOT LIKE 'knex_migrations%'
  `);

  return {
    tables,
    sequences: Object.fromEntries(sequences.map(seq => [seq.name, seq])),
  };
}
