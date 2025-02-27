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
import {
  DatabaseService,
  resolvePackagePath,
} from '@backstage/backend-plugin-api';
import { IndexableDocument } from '@backstage/plugin-search-common';
import { Knex } from 'knex';
import {
  DatabaseStore,
  DocumentResultRow,
  PgSearchQuery,
  RawDocumentRow,
} from './types';
import { queryPostgresMajorVersion } from './util';

const migrationsDir = resolvePackagePath(
  '@backstage/plugin-search-backend-module-pg',
  'migrations',
);

/** @public */
export class DatabaseDocumentStore implements DatabaseStore {
  private textSearchConfigName: string = 'english';

  static async create(
    database: DatabaseService,
    textSearchConfigName?: string,
  ): Promise<DatabaseDocumentStore> {
    const knex = await database.getClient();
    try {
      const majorVersion = await queryPostgresMajorVersion(knex);

      if (majorVersion < 12) {
        // We are using some features (like generated columns) that aren't
        // available in older postgres versions.
        throw new Error(
          `The PgSearchEngine requires at least postgres version 12 (but is running on ${majorVersion})`,
        );
      }
    } catch {
      // Actually both mysql and sqlite have a full text search, too. We could
      // implement them separately or add them here.
      throw new Error(
        'The PgSearchEngine is only supported when using a postgres database (>=12.x)',
      );
    }

    if (!database.migrations?.skip) {
      await knex.migrate.latest({
        directory: migrationsDir,
      });
    }

    const instance = new DatabaseDocumentStore(knex);

    // Check and set text search configuration
    if (textSearchConfigName) {
      // Verify if the configuration exists
      const configExists = await knex.raw(
        `SELECT EXISTS (SELECT 1 FROM pg_ts_config WHERE cfgname = ?)`,
        [textSearchConfigName],
      );

      if (configExists.rows[0].exists) {
        instance.textSearchConfigName = textSearchConfigName;

        // Check current column configuration
        const documentsTableName = 'documents';
        const bodyColumnName = 'body';
        const currentConfig = await knex.raw(`
          SELECT pg_get_expr(d.adbin, d.adrelid) as column_default
          FROM pg_catalog.pg_attribute a
          LEFT JOIN pg_catalog.pg_attrdef d ON (a.attrelid = d.adrelid AND a.attnum = d.adnum)
          WHERE a.attrelid = '${documentsTableName}'::regclass
          AND a.attname = '${bodyColumnName}'
          AND NOT a.attisdropped;
        `);

        // Extract current config name from the expression
        const currentConfigMatch =
          currentConfig.rows[0]?.column_default?.match(/to_tsvector\('(\w+)'/);
        const currentConfigName = currentConfigMatch?.[1];

        if (currentConfigName !== textSearchConfigName) {
          // Update the generated column with new text search configuration
          await knex.transaction(async trx => {
            // Drop the generated column
            await trx.schema.alterTable('documents', table => {
              table.dropColumn('body');
            });

            // Recreate the column with new configuration
            await trx.schema.alterTable('documents', table => {
              table.specificType(
                'body',
                'tsvector NOT NULL GENERATED ALWAYS AS (' +
                  `setweight(to_tsvector('${textSearchConfigName}', document->>'title'), 'A') || ` +
                  `setweight(to_tsvector('${textSearchConfigName}', document->>'text'), 'B') || ` +
                  `setweight(to_tsvector('${textSearchConfigName}', document - 'location' - 'title' - 'text'), 'C')` +
                  ') STORED',
              );
            });

            // Create new index
            await trx.schema.alterTable('documents', table => {
              table.index('body', 'documents_body_idx', 'gin');
            });
          });
        }
      } else {
        // If the text search configuration does not exist, throw an error
        throw new Error(
          `The text search configuration ${textSearchConfigName} does not exist`,
        );
      }
    }
    return instance;
  }

  static async supported(knex: Knex): Promise<boolean> {
    try {
      const majorVersion = await queryPostgresMajorVersion(knex);

      return majorVersion >= 12;
    } catch {
      return false;
    }
  }

  constructor(private readonly db: Knex) {}

  async transaction<T>(fn: (tx: Knex.Transaction) => Promise<T>): Promise<T> {
    return await this.db.transaction(fn);
  }

  async getTransaction(): Promise<Knex.Transaction> {
    return this.db.transaction();
  }

  async prepareInsert(tx: Knex.Transaction): Promise<void> {
    // We create a temporary table to collect the hashes of the documents that
    // we expect to be in the documents table at the end. The table is deleted
    // at the end of the transaction.
    // The hash makes sure that we generate a new row for every change.
    await tx.raw(
      'CREATE TEMP TABLE documents_to_insert (' +
        'type text NOT NULL, ' +
        'document jsonb NOT NULL, ' +
        // Generating the hash requires a trick, as the text to bytea
        // conversation runs into errors in case the text contains a backslash.
        // Therefore we have to escape them.
        "hash bytea NOT NULL GENERATED ALWAYS AS (sha256(replace(document::text || type, '\\', '\\\\')::bytea)) STORED" +
        ') ON COMMIT DROP',
    );
  }

  async completeInsert(tx: Knex.Transaction, type: string): Promise<void> {
    // Copy all new rows into the documents table
    await tx
      .insert(
        tx<RawDocumentRow>('documents_to_insert').select(
          'type',
          'document',
          'hash',
        ),
      )
      .into(tx.raw('documents (type, document, hash)'))
      .onConflict('hash')
      .ignore();

    // Delete all documents that we don't expect (deleted and changed)
    const rowsToDelete = tx<RawDocumentRow>('documents')
      .select('documents.hash')
      .leftJoin<RawDocumentRow>('documents_to_insert', {
        'documents.hash': 'documents_to_insert.hash',
      })
      .whereNull('documents_to_insert.hash');

    await tx<RawDocumentRow>('documents')
      .where({ type })
      .whereIn('hash', rowsToDelete)
      .delete();
  }

  async insertDocuments(
    tx: Knex.Transaction,
    type: string,
    documents: IndexableDocument[],
  ): Promise<void> {
    // Insert all documents into the temporary table to process them later
    await tx<DocumentResultRow>('documents_to_insert').insert(
      documents.map(document => ({
        type,
        document,
      })),
    );
  }

  async query(
    tx: Knex.Transaction,
    searchQuery: PgSearchQuery,
  ): Promise<DocumentResultRow[]> {
    const {
      types,
      pgTerm,
      fields,
      offset,
      limit,
      normalization = 0,
      options,
    } = searchQuery;
    // TODO(awanlin): We should make the language a parameter so that we can support more then just english
    // Builds a query like:
    // SELECT ts_rank_cd(body, query, 0) AS rank, type, document,
    // ts_headline('english', document, query) AS highlight
    // FROM documents, to_tsquery('english', 'consent') query
    // WHERE query @@ body AND (document @> '{"kind": "API"}')
    // ORDER BY rank DESC
    // LIMIT 10;
    const query = tx<DocumentResultRow>('documents');

    if (pgTerm) {
      query
        .from(
          tx.raw(`documents, to_tsquery(?, ?) query`, [
            this.textSearchConfigName,
            pgTerm,
          ]),
        )
        .whereRaw('query @@ body');
    } else {
      query.from('documents');
    }

    if (types) {
      query.whereIn('type', types);
    }

    if (fields) {
      Object.keys(fields).forEach(key => {
        const value = fields[key];
        const valueArray = Array.isArray(value) ? value : [value];
        const fieldValueCompare = valueArray
          .map(v => ({ [key]: v }))
          .map(v => JSON.stringify(v));
        const arrayValueCompare = valueArray
          .map(v => ({ [key]: [v] }))
          .map(v => JSON.stringify(v));
        const valueCompare = [...fieldValueCompare, ...arrayValueCompare];
        query.whereRaw(
          `(${valueCompare.map(() => 'document @> ?').join(' OR ')})`,
          valueCompare,
        );
      });
    }

    query.select('type', 'document');

    if (pgTerm && options.useHighlight) {
      const headlineOptions = `MaxWords=${options.maxWords}, MinWords=${options.minWords}, ShortWord=${options.shortWord}, HighlightAll=${options.highlightAll}, MaxFragments=${options.maxFragments}, FragmentDelimiter=${options.fragmentDelimiter}, StartSel=${options.preTag}, StopSel=${options.postTag}`;
      query
        .select(tx.raw(`ts_rank_cd(body, query, ${normalization}) AS "rank"`))
        .select(
          tx.raw(
            `ts_headline(\'${this.textSearchConfigName}\', document, query, '${headlineOptions}') as "highlight"`,
          ),
        )
        .orderBy('rank', 'desc');
    } else if (pgTerm && !options.useHighlight) {
      query
        .select(tx.raw(`ts_rank_cd(body, query, ${normalization}) AS "rank"`))
        .orderBy('rank', 'desc');
    } else {
      query.select(tx.raw('1 as rank'));
    }

    return await query.offset(offset).limit(limit);
  }
}
