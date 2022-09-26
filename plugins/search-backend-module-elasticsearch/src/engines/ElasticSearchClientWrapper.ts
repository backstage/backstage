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

import { Client as ElasticSearchClient } from '@elastic/elasticsearch';
import { Client as OpenSearchClient } from '@opensearch-project/opensearch';
import { Readable } from 'stream';
import {
  ElasticSearchClientOptions,
  isOpenSearchCompatible,
} from './ElasticSearchClientOptions';
import { ElasticSearchCustomIndexTemplate } from './types';

/**
 * @public
 */
export type ElasticSearchAliasAction =
  | {
      remove: { index: any; alias: any };
      add?: undefined;
    }
  | {
      add: { indices: any; alias: any; index?: undefined };
      remove?: undefined;
    }
  | {
      add: { index: any; alias: any; indices?: undefined };
      remove?: undefined;
    }
  | undefined;

/**
 * @public
 */
export type ElasticSearchIndexAction = {
  index: {
    _index: string;
    [key: string]: any;
  };
};

/**
 * A wrapper class that exposes logical methods that are conditionally fired
 * against either a configured Elasticsearch client or a configured Opensearch
 * client.
 *
 * This is necessary because, despite its intention to be API-compatible, the
 * opensearch client does not support API key-based authentication. This is
 * also the sanest way to accomplish this while making typescript happy.
 *
 * In the future, if the differences between implementations become
 * unmaintainably divergent, we should split out the Opensearch and
 * Elasticsearch search engine implementations.
 *
 * @public
 */
export class ElasticSearchClientWrapper {
  private readonly elasticSearchClient: ElasticSearchClient | undefined;
  private readonly openSearchClient: OpenSearchClient | undefined;

  private constructor(options: {
    openSearchClient?: OpenSearchClient;
    elasticSearchClient?: ElasticSearchClient;
  }) {
    this.openSearchClient = options.openSearchClient;
    this.elasticSearchClient = options.elasticSearchClient;
  }

  static fromClientOptions(options: ElasticSearchClientOptions) {
    if (isOpenSearchCompatible(options)) {
      return new ElasticSearchClientWrapper({
        openSearchClient: new OpenSearchClient(options),
      });
    }

    return new ElasticSearchClientWrapper({
      elasticSearchClient: new ElasticSearchClient(options),
    });
  }

  search(options: { index: string | string[]; body: Object }) {
    if (this.openSearchClient) {
      return this.openSearchClient.search(options);
    }

    if (this.elasticSearchClient) {
      return this.elasticSearchClient.search(options);
    }

    throw new Error('No client defined');
  }

  bulk(bulkOptions: {
    datasource: Readable;
    onDocument: () => ElasticSearchIndexAction;
    refreshOnCompletion?: string | boolean;
  }) {
    if (this.openSearchClient) {
      return this.openSearchClient.helpers.bulk(bulkOptions);
    }

    if (this.elasticSearchClient) {
      return this.elasticSearchClient.helpers.bulk(bulkOptions);
    }

    throw new Error('No client defined');
  }

  putIndexTemplate(template: ElasticSearchCustomIndexTemplate) {
    if (this.openSearchClient) {
      return this.openSearchClient.indices.putIndexTemplate(template);
    }

    if (this.elasticSearchClient) {
      return this.elasticSearchClient.indices.putIndexTemplate(template);
    }

    throw new Error('No client defined');
  }

  indexExists(options: { index: string | string[] }) {
    if (this.openSearchClient) {
      return this.openSearchClient.indices.exists(options);
    }

    if (this.elasticSearchClient) {
      return this.elasticSearchClient.indices.exists(options);
    }

    throw new Error('No client defined');
  }

  deleteIndex(options: { index: string | string[] }) {
    if (this.openSearchClient) {
      return this.openSearchClient.indices.delete(options);
    }

    if (this.elasticSearchClient) {
      return this.elasticSearchClient.indices.delete(options);
    }

    throw new Error('No client defined');
  }

  createIndex(options: { index: string }) {
    if (this.openSearchClient) {
      return this.openSearchClient.indices.create(options);
    }

    if (this.elasticSearchClient) {
      return this.elasticSearchClient.indices.create(options);
    }

    throw new Error('No client defined');
  }

  getAliases(options: { aliases: string[] }) {
    const { aliases } = options;

    if (this.openSearchClient) {
      return this.openSearchClient.cat.aliases({
        format: 'json',
        name: aliases,
      });
    }

    if (this.elasticSearchClient) {
      return this.elasticSearchClient.cat.aliases({
        format: 'json',
        name: aliases,
      });
    }

    throw new Error('No client defined');
  }

  updateAliases(options: { actions: ElasticSearchAliasAction[] }) {
    const filteredActions = options.actions.filter(Boolean);

    if (this.openSearchClient) {
      return this.openSearchClient.indices.updateAliases({
        body: {
          actions: filteredActions,
        },
      });
    }

    if (this.elasticSearchClient) {
      return this.elasticSearchClient.indices.updateAliases({
        body: {
          actions: filteredActions,
        },
      });
    }

    throw new Error('No client defined');
  }
}
