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
import { DatabaseStore } from '../database';

type IndexerOptions = {
  batchSize: number;
  type: string;
  databaseStore: DatabaseStore;
};

export class PgSearchEngineIndexer extends BatchSearchEngineIndexer {
  private store: DatabaseStore;
  private type: string;

  constructor(options: IndexerOptions) {
    super({ batchSize: options.batchSize });
    this.store = options.databaseStore;
    this.type = options.type;
  }

  async index(documents: IndexableDocument[]): Promise<void> {
    await this.store.transaction(async tx => {
      await this.store.prepareInsert(tx);
      await this.store.insertDocuments(tx, this.type, documents);
      await this.store.completeInsert(tx, this.type);
    });
  }
}
