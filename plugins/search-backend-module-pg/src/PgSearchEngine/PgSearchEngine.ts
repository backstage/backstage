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
  SearchQuery,
  IndexableResultSet,
} from '@backstage/plugin-search-common';
import { PgSearchEngineIndexer } from './PgSearchEngineIndexer';
import {
  DatabaseDocumentStore,
  DatabaseStore,
  PgSearchQuery,
} from '../database';

export type ConcretePgSearchQuery = {
  pgQuery: PgSearchQuery;
  pageSize: number;
};

export class PgSearchEngine implements SearchEngine {
  constructor(private readonly databaseStore: DatabaseStore) {}

  static async from(options: {
    database: PluginDatabaseManager;
  }): Promise<PgSearchEngine> {
    return new PgSearchEngine(
      await DatabaseDocumentStore.create(await options.database.getClient()),
    );
  }

  static async supported(database: PluginDatabaseManager): Promise<boolean> {
    return await DatabaseDocumentStore.supported(await database.getClient());
  }

  translator(query: SearchQuery): ConcretePgSearchQuery {
    const pageSize = 25;
    const { page } = decodePageCursor(query.pageCursor);
    const offset = page * pageSize;
    // We request more result to know whether there is another page
    const limit = pageSize + 1;

    return {
      pgQuery: {
        pgTerm: query.term
          .split(/\s/)
          .map(p => p.replace(/[\0()|&:*!]/g, '').trim())
          .filter(p => p !== '')
          .map(p => `(${JSON.stringify(p)} | ${JSON.stringify(p)}:*)`)
          .join('&'),
        fields: query.filters as Record<string, string | string[]>,
        types: query.types,
        offset,
        limit,
      },
      pageSize,
    };
  }

  setTranslator(
    translator: (query: SearchQuery) => ConcretePgSearchQuery,
  ): void {
    this.translator = translator;
  }

  async getIndexer(type: string) {
    return new PgSearchEngineIndexer({
      batchSize: 1000,
      type,
      databaseStore: this.databaseStore,
    });
  }

  async query(query: SearchQuery): Promise<IndexableResultSet> {
    const { pgQuery, pageSize } = this.translator(query);

    const rows = await this.databaseStore.transaction(async tx =>
      this.databaseStore.query(tx, pgQuery),
    );

    // We requested one result more than the page size to know whether there is
    // another page.
    const { page } = decodePageCursor(query.pageCursor);
    const hasNextPage = rows.length > pageSize;
    const hasPreviousPage = page > 0;
    const pageRows = rows.slice(0, pageSize);
    const nextPageCursor = hasNextPage
      ? encodePageCursor({ page: page + 1 })
      : undefined;
    const previousPageCursor = hasPreviousPage
      ? encodePageCursor({ page: page - 1 })
      : undefined;

    const results = pageRows.map(({ type, document }) => ({
      type,
      document,
    }));

    return { results, nextPageCursor, previousPageCursor };
  }
}

export function decodePageCursor(pageCursor?: string): { page: number } {
  if (!pageCursor) {
    return { page: 0 };
  }

  return {
    page: Number(Buffer.from(pageCursor, 'base64').toString('utf-8')),
  };
}

export function encodePageCursor({ page }: { page: number }): string {
  return Buffer.from(`${page}`, 'utf-8').toString('base64');
}
