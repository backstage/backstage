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

import { assertError } from '@backstage/errors';
import { IndexableDocument } from '@backstage/plugin-search-common';
import { Writable } from 'stream';

/**
 * Options for {@link BatchSearchEngineIndexer}
 * @public
 */
export type BatchSearchEngineOptions = {
  batchSize: number;
};

/**
 * Base class encapsulating batch-based stream processing. Useful as a base
 * class for search engine indexers.
 * @public
 */
export abstract class BatchSearchEngineIndexer extends Writable {
  private batchSize: number;
  private currentBatch: IndexableDocument[] = [];
  private initialized: Promise<undefined | Error>;

  constructor(options: BatchSearchEngineOptions) {
    super({ objectMode: true });
    this.batchSize = options.batchSize;

    // @todo Once node v15 is minimum, convert to _construct implementation.
    this.initialized = new Promise(done => {
      // Necessary to allow concrete implementation classes to construct
      // themselves before calling their initialize() methods.
      setImmediate(async () => {
        try {
          await this.initialize();
          done(undefined);
        } catch (e) {
          assertError(e);
          done(e);
        }
      });
    });
  }

  /**
   * Receives an array of indexable documents (of size this.batchSize) which
   * should be written to the search engine. This method won't be called again
   * at least until it resolves.
   */
  public abstract index(documents: IndexableDocument[]): Promise<void>;

  /**
   * Any asynchronous setup tasks can be performed here.
   */
  public abstract initialize(): Promise<void>;

  /**
   * Any asynchronous teardown tasks can be performed here.
   */
  public abstract finalize(): Promise<void>;

  /**
   * Encapsulates batch stream write logic.
   * @internal
   */
  async _write(
    doc: IndexableDocument,
    _e: any,
    done: (error?: Error | null) => void,
  ) {
    // Wait for init before proceeding. Throw error if initialization failed.
    const maybeError = await this.initialized;
    if (maybeError) {
      done(maybeError);
      return;
    }

    this.currentBatch.push(doc);
    if (this.currentBatch.length < this.batchSize) {
      done();
      return;
    }

    try {
      await this.index(this.currentBatch);
      this.currentBatch = [];
      done();
    } catch (e) {
      assertError(e);
      done(e);
    }
  }

  /**
   * Encapsulates finalization and final error handling logic.
   * @internal
   */
  async _final(done: (error?: Error | null) => void) {
    try {
      // Index any remaining documents.
      if (this.currentBatch.length) {
        await this.index(this.currentBatch);
        this.currentBatch = [];
      }
      await this.finalize();
      done();
    } catch (e) {
      assertError(e);
      done(e);
    }
  }
}
