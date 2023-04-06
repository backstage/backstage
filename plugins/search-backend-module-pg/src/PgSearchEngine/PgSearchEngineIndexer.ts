/*
 * Copyright 2022 The Backstage Authors
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

import { getVoidLogger } from '@backstage/backend-common';
import { BatchSearchEngineIndexer } from '@backstage/plugin-search-backend-node';
import { IndexableDocument } from '@backstage/plugin-search-common';
import { Knex } from 'knex';
import { Logger } from 'winston';
import { DatabaseStore } from '../database';

/** @public */
export type PgSearchEngineIndexerOptions = {
  batchSize: number;
  type: string;
  databaseStore: DatabaseStore;
  logger?: Logger;
};

/** @public */
export class PgSearchEngineIndexer extends BatchSearchEngineIndexer {
  private logger: Logger;
  private store: DatabaseStore;
  private type: string;
  private tx: Knex.Transaction | undefined;
  private numRecords = 0;

  constructor(options: PgSearchEngineIndexerOptions) {
    super({ batchSize: options.batchSize });
    this.store = options.databaseStore;
    this.type = options.type;
    this.logger = options.logger || getVoidLogger();
  }

  async initialize(): Promise<void> {
    this.tx = await this.store.getTransaction();
    try {
      await this.store.prepareInsert(this.tx);
    } catch (e) {
      // In case of error, rollback the transaction and re-throw the error so
      // that the stream can be closed and destroyed properly.
      this.tx.rollback(e);
      throw e;
    }
  }

  async index(documents: IndexableDocument[]): Promise<void> {
    this.numRecords += documents.length;

    try {
      await this.store.insertDocuments(this.tx!, this.type, documents);
    } catch (e) {
      // In case of error, rollback the transaction and re-throw the error so
      // that the stream can be closed and destroyed properly.
      this.tx!.rollback(e);
      throw e;
    }
  }

  async finalize(): Promise<void> {
    // If no documents were indexed, rollback the transaction, log a warning,
    // and do not continue. This ensures that collators that return empty sets
    // of documents do not cause the index to be deleted.
    if (this.numRecords === 0) {
      this.logger.warn(
        `Index for ${this.type} was not replaced: indexer received 0 documents`,
      );
      this.tx!.rollback!();
      return;
    }

    // Attempt to complete and commit the transaction.
    try {
      await this.store.completeInsert(this.tx!, this.type);
      this.tx!.commit();
    } catch (e) {
      // Otherwise, rollback the transaction and re-throw the error so that the
      // stream can be closed and destroyed properly.
      this.tx!.rollback!(e);
      throw e;
    }
  }
}
