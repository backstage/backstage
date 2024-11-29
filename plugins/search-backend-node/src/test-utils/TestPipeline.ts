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

import { IndexableDocument } from '@backstage/plugin-search-common';
import { pipeline, Readable, Transform, Writable } from 'stream';

/**
 * Object resolved after a test pipeline is executed.
 * @public
 */
export type TestPipelineResult = {
  /**
   * If an error was emitted by the pipeline, it will be set here.
   */
  error: unknown;

  /**
   * A list of documents collected at the end of the pipeline. If the subject
   * under test is an indexer, this will be an empty array (because your
   * indexer should have received the documents instead).
   */
  documents: IndexableDocument[];
};

/**
 * Test utility for Backstage Search collators, decorators, and indexers.
 *
 * @example
 * An example test checking that a collator provides expected documents.
 * ```
 * it('provides expected documents', async () => {
 *   const testSubject = await yourCollatorFactory.getCollator();
 *   const pipeline = TestPipeline.fromCollator(testSubject);
 *
 *   const { documents } = await pipeline.execute();
 *
 *   expect(documents).toHaveLength(2);
 * })
 * ```
 *
 * @example
 * An example test checking that a decorator behaves as expected.
 * ```
 * it('filters private documents', async () => {
 *   const testSubject = await yourDecoratorFactory.getDecorator();
 *   const pipeline = TestPipeline
 *     .fromDecorator(testSubject)
 *     .withDocuments([{ title: 'Private', location: '/private', text: '' }]);
 *
 *   const { documents } = await pipeline.execute();
 *
 *   expect(documents).toHaveLength(0);
 * })
 * ```
 *
 * @public
 */
export class TestPipeline {
  private collator?: Readable;
  private decorator?: Transform;
  private indexer?: Writable;

  private constructor({
    collator,
    decorator,
    indexer,
  }: {
    collator?: Readable;
    decorator?: Transform;
    indexer?: Writable;
  }) {
    this.collator = collator;
    this.decorator = decorator;
    this.indexer = indexer;
  }

  /**
   * Provide the collator, decorator, or indexer to be tested.
   *
   * @deprecated Use `fromCollator`, `fromDecorator` or `fromIndexer` static
   *   methods to create a test pipeline instead.
   */
  static withSubject(subject: Readable | Transform | Writable) {
    if (subject instanceof Transform) {
      return new TestPipeline({ decorator: subject });
    }

    if (subject instanceof Writable) {
      return new TestPipeline({ indexer: subject });
    }

    if (subject.readable || subject instanceof Readable) {
      return new TestPipeline({ collator: subject });
    }

    throw new Error(
      'Unknown test subject: are you passing a readable, writable, or transform stream?',
    );
  }

  /**
   * Create a test pipeline given a collator you want to test.
   */
  static fromCollator(collator: Readable) {
    return new TestPipeline({ collator });
  }

  /**
   * Add a collator to the test pipeline.
   */
  withCollator(collator: Readable): this {
    this.collator = collator;
    return this;
  }

  /**
   * Create a test pipeline given a decorator you want to test.
   */
  static fromDecorator(decorator: Transform) {
    return new TestPipeline({ decorator });
  }

  /**
   * Add a decorator to the test pipeline.
   */
  withDecorator(decorator: Transform): this {
    this.decorator = decorator;
    return this;
  }

  /**
   * Create a test pipeline given an indexer you want to test.
   */
  static fromIndexer(indexer: Writable) {
    return new TestPipeline({ indexer });
  }

  /**
   * Add an indexer to the test pipeline.
   */
  withIndexer(indexer: Writable): this {
    this.indexer = indexer;
    return this;
  }

  /**
   * Provide documents for testing decorators and indexers.
   */
  withDocuments(documents: IndexableDocument[]): TestPipeline {
    if (this.collator) {
      throw new Error('Cannot provide documents when testing a collator.');
    }

    // Set a naive readable stream that just pushes all given documents.
    this.collator = new Readable({ objectMode: true });
    this.collator._read = () => {};
    process.nextTick(() => {
      documents.forEach(document => {
        this.collator!.push(document);
      });
      this.collator!.push(null);
    });

    return this;
  }

  /**
   * Execute the test pipeline so that you can make assertions about the result
   * or behavior of the given test subject.
   */
  async execute(): Promise<TestPipelineResult> {
    const documents: IndexableDocument[] = [];
    if (!this.collator) {
      throw new Error(
        'Cannot execute pipeline without a collator or documents',
      );
    }

    // If we are here and there is no indexer, we are testing a collator or a
    // decorator. Set up a naive writable that captures documents in memory.
    if (!this.indexer) {
      this.indexer = new Writable({ objectMode: true });
      this.indexer._write = (document: IndexableDocument, _, done) => {
        documents.push(document);
        done();
      };
    }

    return new Promise<TestPipelineResult>(done => {
      const pipes: (Readable | Transform | Writable)[] = [this.collator!];
      if (this.decorator) {
        pipes.push(this.decorator);
      }
      pipes.push(this.indexer!);

      pipeline(pipes, (error: NodeJS.ErrnoException | null) => {
        done({
          error,
          documents,
        });
      });
    });
  }
}
