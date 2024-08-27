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

import { BatchSearchEngineIndexer } from '@backstage/plugin-search-backend-node';
import { IndexableDocument } from '@backstage/plugin-search-common';
import { Knex } from 'knex';
import { DatabaseStore } from '../database';
import { LoggerService } from '@backstage/backend-plugin-api';

/** @public */
export type PgSearchEngineIndexerOptions = {
  batchSize: number;
  type: string;
  databaseStore: DatabaseStore;
  logger?: LoggerService;
};

/** @public */
export class PgSearchEngineIndexer extends BatchSearchEngineIndexer {
  private logger?: LoggerService;
  private store: DatabaseStore;
  private type: string;
  private tx: Knex.Transaction | undefined;
  private numRecords = 0;

  constructor(options: PgSearchEngineIndexerOptions) {
    super({ batchSize: options.batchSize });
    this.store = options.databaseStore;
    this.type = options.type;
    this.logger = options.logger;
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

    const refs = [...new Set(documents.map(d => d.authorization?.resourceRef))];
    this.logger?.debug(
      `Attempting to index the following entities: ${refs.toString()}`,
    );

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
      this.logger?.warn(
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

  /**
   * Custom handler covering the case where an error occurred somewhere else in
   * the indexing pipeline (e.g. a collator or decorator). In such cases, the
   * finalize method is not called, which leaves a dangling transaction and
   * therefore an open connection to PG. This handler ensures we close the
   * transaction and associated connection.
   *
   * todo(@backstage/search-maintainers): Consider introducing a more
   * formal mechanism for handling such errors in BatchSearchEngineIndexer and
   * replacing this method with it. See: #17291
   *
   * @internal
   */
  async _destroy(error: Error | null, done: (error?: Error | null) => void) {
    // Ignore situations where there was no error.
    if (!error) {
      done();
      return;
    }

    if (!this.tx!.isCompleted()) {
      await this.tx!.rollback(error);
    }

    done(error);
  }
}
