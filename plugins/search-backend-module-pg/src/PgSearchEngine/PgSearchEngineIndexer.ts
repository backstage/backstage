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

import { BatchSearchEngineIndexer } from '@backstage/plugin-search-backend-node';
import { IndexableDocument } from '@backstage/search-common';
import { Knex } from 'knex';
import { DatabaseStore } from '../database';

type IndexerOptions = {
  batchSize: number;
  type: string;
  databaseStore: DatabaseStore;
};

export class PgSearchEngineIndexer extends BatchSearchEngineIndexer {
  private store: DatabaseStore;
  private type: string;
  private tx: Knex.Transaction | undefined;
  private closeConnection: Function | undefined;

  constructor(options: IndexerOptions) {
    super({ batchSize: options.batchSize });
    this.store = options.databaseStore;
    this.type = options.type;
  }

  initialize(): Promise<void> {
    return new Promise((initDone, initAbort) => {
      // Begin a transaction.
      this.store.transaction(async tx => {
        // Prepare the transaction.
        try {
          await this.store.prepareInsert(tx);
        } catch (e) {
          initAbort(e);
          return;
        }

        // Allow the transaction to be completed in finalize() by awaiting an
        // open-ended promise here, but storing a reference to its resolver on
        // the class.
        await new Promise(resolve => {
          this.closeConnection = resolve;
          this.tx = tx;

          // Signal that initialization is done and indexing can begin.
          initDone();
        });
      });
    });
  }

  async index(documents: IndexableDocument[]): Promise<void> {
    try {
      await this.store.insertDocuments(this.tx!, this.type, documents);
    } catch (e) {
      // In case of error, close the PG connection and re-throw the error so
      // that the stream can be closed and destroyed properly.
      this.closeConnection!();
      throw e;
    }
  }

  async finalize(): Promise<void> {
    // Attempt to complete the transaction and close the connection.
    try {
      await this.store.completeInsert(this.tx!, this.type);
      this.closeConnection!();
    } catch (e) {
      // Otherwise, abort the transaction and re-throw the error so that the
      // stream can be closed and destroyed properly.
      this.closeConnection!(e);
      throw e;
    }
  }
}
