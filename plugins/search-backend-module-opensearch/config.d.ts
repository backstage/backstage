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

export interface Config {
  /** Configuration options for the search plugin */
  search?: {
    /** Options for the OpenSearch search engine */
    opensearch?: {
      /**
       * The provider that supplies the client connection and authentication.
       *
       * The built-in providers are `default` (self-hosted OpenSearch) and
       * `aws` (Amazon OpenSearch Service, using SigV4 request signing).
       * `opensearch` is accepted as an alias for `default` to ease migration
       * from the Elasticsearch module. Other ids can be supplied by a module
       * that registers a provider through `opensearchProviderExtensionPoint`.
       *
       * Defaults to `default`.
       */
      provider?: string;
      /**
       * URL or URLs of the OpenSearch nodes to connect to.
       * Required for the built-in `default` and `aws` providers.
       */
      node?: string | string[];
      /**
       * Static authentication credentials. If both `apiKey` and
       * username/password are provided, the API key takes precedence.
       */
      auth?:
        | {
            username: string;

            /**
             * @visibility secret
             */
            password: string;
          }
        | {
            /**
             * Base64-encoded API key to be used to connect to the cluster.
             *
             * @visibility secret
             */
            apiKey: string;
          };
      /**
       * The AWS account to use when retrieving credentials for the `aws`
       * provider. When omitted, the default credentials chain is used.
       */
      accountId?: string;
      /**
       * The AWS region to use when signing requests. Only needed for the
       * `aws` provider when it cannot be derived from the node URL.
       */
      region?: string;
      /**
       * The AWS service used when signing requests. Either `es` for managed
       * clusters or `aoss` for Amazon OpenSearch Serverless. Only used by the
       * `aws` provider.
       */
      service?: 'es' | 'aoss';
      /**
       * Prefix to be used for all index creation. Value will be put in front
       * of the index as is.
       */
      indexPrefix?: string;
      /**
       * Batch size for OpenSearch indexing tasks. Defaults to 1000.
       */
      batchSize?: number;
      /**
       * Defines the name of the field in each document that will be used to
       * identify documents during a batch upload. If not provided, a custom
       * ID will be generated for each document.
       */
      batchKeyField?: string;
      /** Options for configuring highlight settings */
      highlightOptions?: {
        /**
         * The size of the highlighted fragment in characters. Defaults to 1000.
         */
        fragmentSize?: number;
        /**
         * Number of result fragments to extract. Fragments will be
         * concatenated with `fragmentDelimiter`. Defaults to 1.
         */
        numFragments?: number;
        /**
         * Delimiter string used to concatenate fragments. Defaults to " ... ".
         */
        fragmentDelimiter?: string;
      };
      queryOptions?: {
        /**
         * Fuzziness allows you to define the maximum Levenshtein distance for
         * fuzzy queries. `AUTO` determines the level based on the term length;
         * a number specifies a fixed level. Defaults to `AUTO`.
         */
        fuzziness?: 'AUTO' | number;
        /**
         * Minimum number of characters that must match exactly at the
         * beginning of the query. Defaults to 0.
         */
        prefixLength?: number;
      };
      /** OpenSearch-specific index template bodies */
      indexTemplates?: Array<{
        name: string;
        body: {
          /**
           * Array of wildcard (*) expressions used to match the names of data
           * streams and indices during creation.
           */
          index_patterns: string[];
          /**
           * An ordered list of component template names.
           */
          composed_of?: string[];
          /** See the OpenSearch index template API for the request body. */
          template?: {
            [key: string]: unknown;
          };
        };
      }>;
      /** Miscellaneous options for the client */
      clientOptions?: {
        ssl?: {
          /**
           * If true the server will reject any connection which is not
           * authorized with the list of supplied CAs.
           * @default true
           */
          rejectUnauthorized?: boolean;
        };
      };
    };
  };
}
