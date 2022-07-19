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
import { Transform } from 'stream';

/**
 * Base class encapsulating simple async transformations. Useful as a base
 * class for Backstage search decorators.
 * @public
 */
export abstract class DecoratorBase extends Transform {
  private initialized: Promise<undefined | Error>;

  constructor() {
    super({ objectMode: true });

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
   * Any asynchronous setup tasks can be performed here.
   */
  public abstract initialize(): Promise<void>;

  /**
   * Receives a single indexable document. In your decorate method, you can:
   *
   * - Resolve `undefined` to indicate the record should be omitted.
   * - Resolve a single modified document, which could contain new fields,
   *   edited fields, or removed fields.
   * - Resolve an array of indexable documents, if the purpose if the decorator
   *   is to convert one document into multiple derivative documents.
   */
  public abstract decorate(
    document: IndexableDocument,
  ): Promise<IndexableDocument | IndexableDocument[] | undefined>;

  /**
   * Any asynchronous teardown tasks can be performed here.
   */
  public abstract finalize(): Promise<void>;

  /**
   * Encapsulates simple transform stream logic.
   * @internal
   */
  async _transform(
    document: IndexableDocument,
    _: any,
    done: (error?: Error | null) => void,
  ) {
    // Wait for init before proceeding. Throw error if initialization failed.
    const maybeError = await this.initialized;
    if (maybeError) {
      done(maybeError);
      return;
    }

    try {
      const decorated = await this.decorate(document);

      // If undefined was returned, omit the record and move on.
      if (decorated === undefined) {
        done();
        return;
      }

      // If an array of documents was given, push them all.
      if (Array.isArray(decorated)) {
        decorated.forEach(doc => {
          this.push(doc);
        });
        done();
        return;
      }

      // Otherwise, just push the decorated document.
      this.push(decorated);
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
      await this.finalize();
      done();
    } catch (e) {
      assertError(e);
      done(e);
    }
  }
}
