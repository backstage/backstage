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
import { Client } from '@elastic/elasticsearch';
import { Readable } from 'stream';
import { Logger } from 'winston';

type IndexerOptions = {
  type: string;
  index: string;
  alias: string;
  logger: Logger;
  elasticSearchClient: Client;
};

export class ElasticSearchEngineIndexer extends BatchSearchEngineIndexer {
  private initialized = false;
  private received: number = 0;
  private processed: number = 0;
  private removableIndices: string[] = [];

  private readonly type: string;
  private readonly indexName: string;
  private readonly alias: string;
  private readonly logger: Logger;
  private readonly sourceStream: Readable;
  private readonly elasticSearchClient: Client;
  private bulkResult: Promise<any>;

  constructor(options: IndexerOptions) {
    super({ batchSize: 100 });
    this.logger = options.logger;
    this.type = options.type;
    this.indexName = options.index;
    this.alias = options.alias;
    this.elasticSearchClient = options.elasticSearchClient;
    this.sourceStream = new Readable({ objectMode: true });
    this.sourceStream._read = () => {};

    // eslint-disable-next-line consistent-this
    const that = this;
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

  async index(documents: IndexableDocument[]): Promise<void> {
    await this.isInitialized();
    await this.isReady();
    documents.forEach(document => {
      this.received++;
      this.sourceStream.push(document);
    });
  }

  async _final(done: Function) {
    super._final(async e => {
      if (e) {
        done(e);
        return;
      }

      await this.isReady();
      this.sourceStream.push(null);
      await this.bulkResult;
      done();
      this.emit('close');
    });
  }

  async _destroy() {
    if (this.removableIndices.length) {
      this.logger.info('Removing stale search indices', this.removableIndices);
      await this.elasticSearchClient.indices.delete({
        index: this.removableIndices,
      });
    }
  }

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

  private async isInitialized(): Promise<void> {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    this.logger.info(`Started indexing documents for index ${this.type}`);

    const aliases = await this.elasticSearchClient.cat.aliases({
      format: 'json',
      name: this.alias,
    });

    this.removableIndices = aliases.body.map(
      (r: Record<string, any>) => r.index,
    );

    await this.elasticSearchClient.indices.create({
      index: this.indexName,
    });
  }
}
