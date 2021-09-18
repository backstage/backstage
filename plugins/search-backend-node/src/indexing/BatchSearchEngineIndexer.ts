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
import { Writable } from 'stream';

type ErrorCallback = (error?: Error | null) => void;

type BatchSearchEngineOptions = {
  batchSize: number;
};

export abstract class BatchSearchEngineIndexer extends Writable {
  private batchSize: number;
  private currentBatch: IndexableDocument[] = [];

  constructor(options: BatchSearchEngineOptions) {
    super({ objectMode: true });
    this.batchSize = options.batchSize;
  }

  public abstract index(documents: IndexableDocument[]): Promise<void>;

  async _write(doc: IndexableDocument, _e: any, done: ErrorCallback) {
    if (this.currentBatch.length < this.batchSize) {
      this.currentBatch.push(doc);
      done();
      return;
    }

    try {
      await this.index(this.currentBatch);
      this.currentBatch = [];
      done();
    } catch (e) {
      done(e as Error);
    }
  }

  async _final(done: ErrorCallback) {
    try {
      await this.index(this.currentBatch);
      this.currentBatch = [];
      done();
    } catch (e) {
      done(e as Error);
    }
  }
}
