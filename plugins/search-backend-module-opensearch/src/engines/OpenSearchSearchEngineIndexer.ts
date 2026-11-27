/*
 * Copyright 2026 The Backstage Authors
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

import type { LoggerService } from '@backstage/backend-plugin-api';
import { BatchSearchEngineIndexer } from '@backstage/plugin-search-backend-node';
import type { IndexableDocument } from '@backstage/plugin-search-common';
import { Readable } from 'node:stream';
import { OpenSearchClientWrapper } from './OpenSearchClientWrapper';

/**
 * Options for instantiating an OpenSearch search engine indexer.
 *
 * @public
 */
export type OpenSearchSearchEngineIndexerOptions = {
  type: string;
  indexPrefix: string;
  indexSeparator: string;
  alias: string;
  logger: LoggerService;
  clientWrapper: OpenSearchClientWrapper;
  batchSize: number;
  batchKeyField?: string;
  skipRefresh?: boolean;
};

function duration(startTimestamp: [number, number]): string {
  const delta = process.hrtime(startTimestamp);
  const seconds = delta[0] + delta[1] / 1e9;
  return `${seconds.toFixed(1)}s`;
}

/**
 * Writes documents to a new OpenSearch index and moves the search alias to it
 * once indexing completes.
 *
 * @public
 */
export class OpenSearchSearchEngineIndexer extends BatchSearchEngineIndexer {
  private processed = 0;
  private hasExistingIndices = false;
  private removableIndices: string[] = [];

  private readonly startTimestamp: [number, number];
  private readonly type: string;
  public readonly indexName: string;
  private readonly indexPrefix: string;
  private readonly indexSeparator: string;
  private readonly alias: string;
  private readonly logger: LoggerService;
  private readonly sourceStream: Readable;
  private readonly clientWrapper: OpenSearchClientWrapper;
  private readonly configuredBatchSize: number;
  private readonly bulkResult: Promise<any>;
  private bulkClientError?: Error;

  constructor(options: OpenSearchSearchEngineIndexerOptions) {
    super({ batchSize: options.batchSize });
    this.configuredBatchSize = options.batchSize;
    this.logger = options.logger.child({ documentType: options.type });
    this.startTimestamp = process.hrtime();
    this.type = options.type;
    this.indexPrefix = options.indexPrefix;
    this.indexSeparator = options.indexSeparator;
    this.indexName = this.constructIndexName(`${Date.now()}`);
    this.alias = options.alias;
    this.clientWrapper = options.clientWrapper;

    // The bulk helper reads from a stream supplied at construction time, so
    // use an inline stream rather than this indexer itself.
    this.sourceStream = new Readable({ objectMode: true });
    this.sourceStream._read = () => {};

    // eslint-disable-next-line consistent-this
    const that = this;
    this.bulkResult = this.clientWrapper.bulk({
      datasource: this.sourceStream,
      onDocument(doc) {
        that.processed++;
        return {
          index: { _index: that.indexName },
          ...(options.batchKeyField && doc[options.batchKeyField]
            ? { _id: doc[options.batchKeyField] }
            : {}),
        };
      },
      refreshOnCompletion:
        options.skipRefresh !== true ? that.indexName : false,
    });

    this.bulkResult.catch(e => {
      this.bulkClientError = e;
    });
  }

  async initialize(): Promise<void> {
    this.logger.info(`Started indexing documents for index ${this.type}`);

    const indices = await this.clientWrapper.listIndices({
      index: this.constructIndexName('*'),
    });

    for (const [key, details] of Object.entries(
      indices.body as Record<string, { aliases?: Record<string, unknown> }>,
    )) {
      this.hasExistingIndices = true;
      // Keep the index currently behind the alias so that in-flight queries
      // can complete; it is removed by the next indexing run instead.
      if (details?.aliases?.[this.alias]) {
        continue;
      }
      this.removableIndices.push(key);
    }

    await this.clientWrapper.createIndex({ index: this.indexName });
  }

  async index(documents: IndexableDocument[]): Promise<void> {
    await this.isReady();
    documents.forEach(document => {
      this.sourceStream.push(document);
    });
  }

  async finalize(): Promise<void> {
    await this.isReady();
    this.sourceStream.push(null);
    const result = await this.bulkResult;

    if (this.processed === 0) {
      this.logger.warn(
        `Index for ${this.indexName} of ${this.type} was not ${
          this.hasExistingIndices ? 'replaced' : 'created'
        }: indexer received 0 documents`,
      );
      try {
        await this.clientWrapper.deleteIndex({ index: this.indexName });
      } catch (error) {
        this.logger.error(`Unable to clean up OpenSearch index: ${error}`);
      }
      return;
    }

    this.logger.info(
      `Indexing completed for index ${this.indexName} of ${
        this.type
      } in ${duration(this.startTimestamp)}`,
      result,
    );

    // Allow errors to bubble up so that the created index can be cleaned up.
    await this.clientWrapper.updateAliases({
      actions: [
        {
          remove: { index: this.constructIndexName('*'), alias: this.alias },
        },
        { add: { index: this.indexName, alias: this.alias } },
      ],
    });

    if (this.removableIndices.length) {
      this.logger.info('Removing stale search indices', {
        removableIndices: this.removableIndices,
      });

      // Delete in chunks to stay within request size limits for large numbers
      // of stale indices. Failure here must not delete the aliased index.
      const chunks = this.removableIndices.reduce(
        (resultArray, item, index) => {
          const chunkIndex = Math.floor(index / 50);
          if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = [];
          }
          resultArray[chunkIndex].push(item);
          return resultArray;
        },
        [] as string[][],
      );

      for (const chunk of chunks) {
        try {
          await this.clientWrapper.deleteIndex({ index: chunk });
        } catch (e) {
          this.logger.warn(`Failed to remove stale search indices: ${e}`);
        }
      }
    }
  }

  /**
   * Ensures the number of documents sent to OpenSearch matches the number
   * queued, so that backpressure is propagated to the indexing pipeline.
   */
  private isReady(): Promise<void> {
    if (this.bulkClientError) {
      return Promise.reject(this.bulkClientError);
    }

    if (this.sourceStream.readableLength < this.configuredBatchSize) {
      return Promise.resolve();
    }

    return new Promise((isReady, abort) => {
      let streamLengthChecks = 0;
      const interval = setInterval(() => {
        streamLengthChecks++;

        if (this.sourceStream.readableLength < this.configuredBatchSize) {
          clearInterval(interval);
          isReady();
        }

        if (streamLengthChecks >= 6000) {
          clearInterval(interval);
          abort(
            new Error(
              'Exceeded 5 minutes waiting for OpenSearch to be ready to accept more documents. Check the OpenSearch logs for possible problems.',
            ),
          );
        }
      }, 50);
    });
  }

  private constructIndexName(postFix: string) {
    return `${this.indexPrefix}${this.type}${this.indexSeparator}${postFix}`;
  }
}
