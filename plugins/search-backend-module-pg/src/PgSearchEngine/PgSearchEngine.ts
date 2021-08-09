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
import { PluginDatabaseManager } from '@backstage/backend-common';
import { SearchEngine } from '@backstage/plugin-search-backend-node';
import {
  IndexableDocument,
  SearchQuery,
  SearchResultSet,
} from '@backstage/search-common';
import { chunk } from 'lodash';
import {
  DatabaseDocumentStore,
  DatabaseStore,
  PgSearchQuery,
} from '../database';

// TODO: Support paging using page cursor (return cursor and parse cursor)

export class PgSearchEngine implements SearchEngine {
  constructor(private readonly databaseStore: DatabaseStore) {}

  static async from({
    database,
  }: {
    database: PluginDatabaseManager;
  }): Promise<PgSearchEngine> {
    return new PgSearchEngine(
      await DatabaseDocumentStore.create(await database.getClient()),
    );
  }

  static async supported(database: PluginDatabaseManager): Promise<boolean> {
    return await DatabaseDocumentStore.supported(await database.getClient());
  }

  translator(query: SearchQuery): PgSearchQuery {
    return {
      pgTerm: query.term
        .split(/\s/)
        .map(p => p.trim())
        .filter(p => p !== '')
        .map(p => `(${JSON.stringify(p)} | ${JSON.stringify(p)}:*)`)
        .join('&'),
      fields: query.filters as Record<string, string | string[]>,
      types: query.types,
    };
  }

  setTranslator(translator: (query: SearchQuery) => PgSearchQuery): void {
    this.translator = translator;
  }

  async index(type: string, documents: IndexableDocument[]): Promise<void> {
    await this.databaseStore.transaction(async tx => {
      await this.databaseStore.prepareInsert(tx);

      const batchSize = 100;
      for (const documentBatch of chunk(documents, batchSize)) {
        await this.databaseStore.insertDocuments(tx, type, documentBatch);
      }

      await this.databaseStore.completeInsert(tx, type);
    });
  }

  async query(query: SearchQuery): Promise<SearchResultSet> {
    const pgQuery = this.translator(query);

    const rows = await this.databaseStore.transaction(async tx =>
      this.databaseStore.query(tx, pgQuery),
    );
    const results = rows.map(({ type, document }) => ({
      type,
      document,
    }));

    return { results };
  }
}
