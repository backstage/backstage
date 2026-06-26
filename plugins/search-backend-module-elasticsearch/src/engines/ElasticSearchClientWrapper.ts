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

import {
  Client as ElasticSearchClient,
  ClientOptions as ElasticSearchClientLibOptions,
} from '@elastic/elasticsearch';
import { Client as OpenSearchClient } from '@opensearch-project/opensearch';
import { Readable } from 'node:stream';
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
 * The normalized response shape returned by the wrapped client methods.
 *
 * Both the Elasticsearch and Opensearch clients expose the response payload
 * under a `body` property, so consumers can read `response.body` regardless of
 * the configured provider.
 *
 * @public
 */
export type ElasticSearchClientResponse = {
  body: any;
};

/**
 * Adapts the provider-agnostic client options to the shape expected by the
 * `@elastic/elasticsearch` v8 client.
 *
 * The v8 client reads TLS configuration from a `tls` property; the `ssl`
 * property used by the Opensearch client (and by earlier Elasticsearch client
 * versions) is no longer recognized. Map it across so that TLS settings keep
 * being honored.
 */
function toElasticSearchClientOptions(
  options: ElasticSearchClientOptions,
): ElasticSearchClientLibOptions {
  const { ssl, ...rest } = options;
  return {
    ...rest,
    ...(ssl ? { tls: ssl } : {}),
  } as ElasticSearchClientLibOptions;
}

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
 * The Elasticsearch client calls below pass `{ meta: true }`. As of v8 the
 * `@elastic/elasticsearch` client returns the response body directly, whereas
 * the Opensearch client (forked from the v7 Elasticsearch client) still wraps
 * it in `{ body, statusCode, headers, ... }`. Requesting the meta envelope
 * keeps both clients returning the same shape, so consumers can continue to
 * read `response.body` regardless of the configured provider.
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
      elasticSearchClient: new ElasticSearchClient(
        toElasticSearchClientOptions(options),
      ),
    });
  }

  search(options: {
    index: string | string[];
    body: Object;
  }): Promise<ElasticSearchClientResponse> {
    const searchOptions = {
      ignore_unavailable: true,
      allow_no_indices: true,
    };

    if (this.openSearchClient) {
      return this.openSearchClient.search({
        ...options,
        ...searchOptions,
      });
    }

    if (this.elasticSearchClient) {
      return this.elasticSearchClient.search(
        {
          ...options,
          ...searchOptions,
        },
        { meta: true },
      );
    }

    throw new Error('No client defined');
  }

  bulk(bulkOptions: {
    datasource: Readable;
    onDocument: (doc: any) => ElasticSearchIndexAction;
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

  putIndexTemplate(
    template: ElasticSearchCustomIndexTemplate,
  ): Promise<ElasticSearchClientResponse> {
    if (this.openSearchClient) {
      return this.openSearchClient.indices.putIndexTemplate(template);
    }

    if (this.elasticSearchClient) {
      return this.elasticSearchClient.indices.putIndexTemplate(template, {
        meta: true,
      });
    }

    throw new Error('No client defined');
  }

  listIndices(options: {
    index: string;
  }): Promise<ElasticSearchClientResponse> {
    if (this.openSearchClient) {
      return this.openSearchClient.indices.get(options);
    }

    if (this.elasticSearchClient) {
      return this.elasticSearchClient.indices.get(options, { meta: true });
    }

    throw new Error('No client defined');
  }

  indexExists(options: {
    index: string | string[];
  }): Promise<ElasticSearchClientResponse> {
    if (this.openSearchClient) {
      return this.openSearchClient.indices.exists(options);
    }

    if (this.elasticSearchClient) {
      return this.elasticSearchClient.indices.exists(options, { meta: true });
    }

    throw new Error('No client defined');
  }

  deleteIndex(options: {
    index: string | string[];
  }): Promise<ElasticSearchClientResponse> {
    if (this.openSearchClient) {
      return this.openSearchClient.indices.delete(options);
    }

    if (this.elasticSearchClient) {
      return this.elasticSearchClient.indices.delete(options, { meta: true });
    }

    throw new Error('No client defined');
  }

  /**
   * @deprecated unused by the ElasticSearch Engine, will be removed in the future
   */
  getAliases(options: {
    aliases: string[];
  }): Promise<ElasticSearchClientResponse> {
    const { aliases } = options;

    if (this.openSearchClient) {
      return this.openSearchClient.cat.aliases({
        format: 'json',
        name: aliases,
      });
    }

    if (this.elasticSearchClient) {
      return this.elasticSearchClient.cat.aliases(
        {
          format: 'json',
          name: aliases,
        },
        { meta: true },
      );
    }

    throw new Error('No client defined');
  }

  createIndex(options: {
    index: string;
  }): Promise<ElasticSearchClientResponse> {
    if (this.openSearchClient) {
      return this.openSearchClient.indices.create(options);
    }

    if (this.elasticSearchClient) {
      return this.elasticSearchClient.indices.create(options, { meta: true });
    }

    throw new Error('No client defined');
  }

  updateAliases(options: {
    actions: ElasticSearchAliasAction[];
  }): Promise<ElasticSearchClientResponse> {
    const filteredActions = options.actions.filter(Boolean);

    if (this.openSearchClient) {
      return this.openSearchClient.indices.updateAliases({
        body: {
          actions: filteredActions,
        },
      });
    }

    if (this.elasticSearchClient) {
      return this.elasticSearchClient.indices.updateAliases(
        {
          body: {
            actions: filteredActions as any[],
          },
        },
        { meta: true },
      );
    }

    throw new Error('No client defined');
  }
}
