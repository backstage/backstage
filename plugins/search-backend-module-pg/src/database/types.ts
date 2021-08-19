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
import { IndexableDocument } from '@backstage/search-common';
import { Knex } from 'knex';

export interface PgSearchQuery {
  fields?: Record<string, string | string[]>;
  types?: string[];
  pgTerm?: string;
  offset: number;
  limit: number;
}

export interface DatabaseStore {
  transaction<T>(fn: (tx: Knex.Transaction) => Promise<T>): Promise<T>;
  prepareInsert(tx: Knex.Transaction): Promise<void>;
  insertDocuments(
    tx: Knex.Transaction,
    type: string,
    documents: IndexableDocument[],
  ): Promise<void>;
  completeInsert(tx: Knex.Transaction, type: string): Promise<void>;
  query(
    tx: Knex.Transaction,
    pgQuery: PgSearchQuery,
  ): Promise<DocumentResultRow[]>;
}

export interface RawDocumentRow {
  document: IndexableDocument;
  type: string;
  hash: unknown;
}

export interface DocumentResultRow {
  document: IndexableDocument;
  type: string;
}
