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

export interface Config {
  /** Configuration options for the search plugin */
  search?: {
    /**
     * Options for ElasticSearch
     */
    elasticSearch?:
      | // elastic = Elastic.co ElasticSearch provider
      {
          provider: 'elastic';

          /**
           * Elastic.co CloudID
           * See: https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/client-connecting.html#authentication
           */
          cloudId: string;

          auth: {
            username: string;

            /**
             * @visibility secret
             */
            password: string;
          };
        }

      /**
       *  AWS = Amazon Elasticsearch Service provider
       *
       *  Authentication is handled using the default AWS credentials provider chain
       */
      | {
          provider: 'aws';

          /**
           * Node configuration.
           * URL AWS ES endpoint to connect to.
           * Eg. https://my-es-cluster.eu-west-1.es.amazonaws.com
           */
          node: string;
        }

      /**
       * Standard ElasticSearch
       *
       * Includes self-hosted clusters and others that provide direct connection via an endpoint
       * and authentication method (see possible authentication options below)
       */
      | {
          /**
           * Node configuration.
           * URL/URLS to ElasticSearch node to connect to.
           * Either direct URL like 'https://localhost:9200' or with credentials like 'https://username:password@localhost:9200'
           */
          node: string | string[];

          /**
           * Authentication credentials for ElasticSearch
           * If both ApiKey/Bearer token and username+password is provided, tokens take precedence
           */
          auth: {
            username?: string;

            /**
             * @visibility secret
             */
            password?: string;

            /**
             * Base64 Encoded API key to be used to connect to the cluster.
             * See: https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-api-key.html
             *
             * @visibility secret
             */
            apiKey?: string;

            /**
             * Bearer authentication token to connect to the cluster.
             * See: https://www.elastic.co/guide/en/elasticsearch/reference/current/security-api-create-service-token.html
             *
             * @visibility secret
             */
            bearer?: string;
          };
        };
  };
}
