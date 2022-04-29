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
import { Client } from '@elastic/elasticsearch';
import { Readable } from 'stream';
import { Logger } from 'winston';

export type ElasticSearchSearchEngineIndexerOptions = {
  type: string;
  indexPrefix: string;
  indexSeparator: string;
  alias: string;
  logger: Logger;
  elasticSearchClient: Client;
};

function duration(startTimestamp: [number, number]): string {
  const delta = process.hrtime(startTimestamp);
  const seconds = delta[0] + delta[1] / 1e9;
  return `${seconds.toFixed(1)}s`;
}

export class ElasticSearchSearchEngineIndexer extends BatchSearchEngineIndexer {
  private received: number = 0;
  private processed: number = 0;
  private removableIndices: string[] = [];

  private readonly startTimestamp: [number, number];
  private readonly type: string;
  public readonly indexName: string;
  private readonly indexPrefix: string;
  private readonly indexSeparator: string;
  private readonly alias: string;
  private readonly removableAlias: string;
  private readonly logger: Logger;
  private readonly sourceStream: Readable;
  private readonly elasticSearchClient: Client;
  private bulkResult: Promise<any>;

  constructor(options: ElasticSearchSearchEngineIndexerOptions) {
    super({ batchSize: 1000 });
    this.logger = options.logger;
    this.startTimestamp = process.hrtime();
    this.type = options.type;
    this.indexPrefix = options.indexPrefix;
    this.indexSeparator = options.indexSeparator;
    this.indexName = this.constructIndexName(`${Date.now()}`);
    this.alias = options.alias;
    this.removableAlias = `${this.alias}_removable`;
    this.elasticSearchClient = options.elasticSearchClient;

    // The ES client bulk helper supports stream-based indexing, but we have to
    // supply the stream directly to it at instantiation-time. We can't supply
    // this class itself, so instead, we create this inline stream instead.
    this.sourceStream = new Readable({ objectMode: true });
    this.sourceStream._read = () => {};

    // eslint-disable-next-line consistent-this
    const that = this;

    // Keep a reference to the ES Bulk helper so that we can know when all
    // documents have been successfully written to ES.
    this.bulkResult = this.elasticSearchClient.helpers.bulk({
      datasource: this.sourceStream,
      onDocument() {
        that.processed++;
        return {
          index: { _index: that.indexName },
        };
      },
      refreshOnCompletion: that.indexName,
    });
  }

  async initialize(): Promise<void> {
    this.logger.info(`Started indexing documents for index ${this.type}`);

    const aliases = await this.elasticSearchClient.cat.aliases({
      format: 'json',
      name: [this.alias, this.removableAlias],
    });

    this.removableIndices = [
      ...new Set(aliases.body.map((r: Record<string, any>) => r.index)),
    ] as string[];

    await this.elasticSearchClient.indices.create({
      index: this.indexName,
    });
  }

  async index(documents: IndexableDocument[]): Promise<void> {
    await this.isReady();
    documents.forEach(document => {
      this.received++;
      this.sourceStream.push(document);
    });
  }

  async finalize(): Promise<void> {
    // Wait for all documents to be processed.
    await this.isReady();

    // Close off the underlying stream connected to ES, indicating that no more
    // documents will be written.
    this.sourceStream.push(null);

    // Wait for the bulk helper to finish processing.
    const result = await this.bulkResult;

    // Rotate main alias upon completion. Apply permanent secondary alias so
    // stale indices can be referenced for deletion in case initial attempt
    // fails. Allow errors to bubble up so that we can clean up the created index.
    this.logger.info(
      `Indexing completed for index ${this.type} in ${duration(
        this.startTimestamp,
      )}`,
      result,
    );
    await this.elasticSearchClient.indices.updateAliases({
      body: {
        actions: [
          {
            remove: { index: this.constructIndexName('*'), alias: this.alias },
          },
          this.removableIndices.length
            ? {
                add: {
                  indices: this.removableIndices,
                  alias: this.removableAlias,
                },
              }
            : undefined,
          {
            add: { index: this.indexName, alias: this.alias },
          },
        ].filter(Boolean),
      },
    });

    // If any indices are removable, remove them. Do not bubble up this error,
    // as doing so would delete the now aliased index. Log instead.
    if (this.removableIndices.length) {
      this.logger.info('Removing stale search indices', this.removableIndices);
      try {
        await this.elasticSearchClient.indices.delete({
          index: this.removableIndices,
        });
      } catch (e) {
        this.logger.warn(`Failed to remove stale search indices: ${e}`);
      }
    }
  }

  /**
   * Ensures that the number of documents sent over the wire to ES matches the
   * number of documents this stream has received so far. This helps manage
   * backpressure in other parts of the indexing pipeline.
   */
  private isReady(): Promise<void> {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (this.received === this.processed) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  }

  private constructIndexName(postFix: string) {
    return `${this.indexPrefix}${this.type}${this.indexSeparator}${postFix}`;
  }
}
