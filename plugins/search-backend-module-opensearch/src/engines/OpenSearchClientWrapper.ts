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

import { Client as OpenSearchClient } from '@opensearch-project/opensearch';
import type {
  BulkHelper,
  BulkStats,
} from '@opensearch-project/opensearch/lib/Helpers.js';
import { Readable } from 'node:stream';
import type { OpenSearchClientOptions } from './OpenSearchClientOptions';
import type {
  OpenSearchAliasAction,
  OpenSearchClientResponsePromise,
  OpenSearchIndexAction,
  OpenSearchIndexTemplate,
} from './types';

/**
 * Thin wrapper around the OpenSearch client exposing only the APIs used by
 * the search engine.
 *
 * @public
 */
export class OpenSearchClientWrapper {
  private readonly client: OpenSearchClient;

  private constructor(client: OpenSearchClient) {
    this.client = client;
  }

  /**
   * Creates a wrapper from provider-supplied client options.
   */
  static fromClientOptions(
    options: OpenSearchClientOptions,
  ): OpenSearchClientWrapper {
    return new OpenSearchClientWrapper(new OpenSearchClient(options));
  }

  search(options: {
    index: string | string[];
    body: object;
  }): OpenSearchClientResponsePromise {
    return this.client.search({
      ...options,
      ignore_unavailable: true,
      allow_no_indices: true,
    }) as OpenSearchClientResponsePromise;
  }

  bulk(bulkOptions: {
    datasource: Readable;
    onDocument: (doc: any) => OpenSearchIndexAction;
    refreshOnCompletion?: string | boolean;
  }): BulkHelper<BulkStats> {
    return this.client.helpers.bulk(bulkOptions);
  }

  putIndexTemplate(
    template: OpenSearchIndexTemplate,
  ): OpenSearchClientResponsePromise {
    return this.client.indices.putIndexTemplate(
      template,
    ) as OpenSearchClientResponsePromise;
  }

  listIndices(options: { index: string }): OpenSearchClientResponsePromise {
    return this.client.indices.get(options) as OpenSearchClientResponsePromise;
  }

  indexExists(options: {
    index: string | string[];
  }): OpenSearchClientResponsePromise<boolean> {
    return this.client.indices.exists(
      options,
    ) as OpenSearchClientResponsePromise<boolean>;
  }

  deleteIndex(options: {
    index: string | string[];
  }): OpenSearchClientResponsePromise {
    return this.client.indices.delete(
      options,
    ) as OpenSearchClientResponsePromise;
  }

  createIndex(options: { index: string }): OpenSearchClientResponsePromise {
    return this.client.indices.create(
      options,
    ) as OpenSearchClientResponsePromise;
  }

  updateAliases(options: {
    actions: OpenSearchAliasAction[];
  }): OpenSearchClientResponsePromise {
    return this.client.indices.updateAliases({
      body: { actions: options.actions.filter(Boolean) },
    }) as OpenSearchClientResponsePromise;
  }
}
