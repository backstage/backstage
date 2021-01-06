/*
 * Copyright 2020 Spotify AB
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
  app: {
    baseUrl: string; // defined in core, but repeated here without doc
  };

  backend: {
    baseUrl: string; // defined in core, but repeated here without doc

    /** Address that the backend should listen to. */
    listen:
      | string
      | {
          /** Address of the interface that the backend should bind to. */
          address?: string;
          /** Port that the backend should listen to. */
          port?: string | number;
        };

    /**
     * HTTPS configuration for the backend. If omitted the backend will serve HTTP.
     *
     * Setting this to `true` will cause self-signed certificates to be generated, which
     * can be useful for local development or other non-production scenarios.
     */
    https?:
      | true
      | {
          /**
           * Certificate configuration or parameters for generating a self-signed certificate
           *
           * Setting parameters for self-signed certificates is deprecated and will be removed in
           * the future, set `backend.https = true` instead.
           */
          certificate?:
            | {
                /** Algorithm to use to generate a self-signed certificate */
                algorithm?: string;
                keySize?: number;
                days?: number;
                attributes: {
                  commonName: string;
                };
              }
            | {
                /** PEM encoded certificate. Use $file to load in a file */
                cert: string;
                /**
                 * PEM encoded certificate key. Use $file to load in a file.
                 * @visibility secret
                 */
                key: string;
              };
        };

    /** Database connection configuration, select database type using the `client` field */
    database:
      | {
          client: 'sqlite3';
          connection: ':memory:' | string;
        }
      | {
          client: 'pg';
          /**
           * PostgreSQL connection string or knex configuration object.
           * @secret
           */
          connection: string | object;
        };

    cors?: {
      origin?: string | string[];
      methods?: string | string[];
      allowedHeaders?: string | string[];
      exposedHeaders?: string | string[];
      credentials?: boolean;
      maxAge?: number;
      preflightContinue?: boolean;
      optionsSuccessStatus?: number;
    };

    /**
     * Content Security Policy options.
     *
     * The keys are the plain policy ID, e.g. "upgrade-insecure-requests". The
     * values are on the format that the helmet library expects them, as an
     * array of strings. There is also the special value false, which means to
     * remove the default value that Backstage puts in place for that policy.
     */
    csp?: { [policyId: string]: string[] | false };
  };

  /** Configuration for integrations towards various external repository provider systems */
  integrations?: {
    /** Integration configuration for Azure */
    azure?: Array<{
      /**
       * The hostname of the given Azure instance
       */
      host: string;
      /**
       * Token used to authenticate requests.
       * @visibility secret
       */
      token?: string;
    }>;

    /** Integration configuration for BitBucket */
    bitbucket?: Array<{
      /**
       * The hostname of the given Bitbucket instance
       */
      host: string;
      /**
       * Token used to authenticate requests.
       * @visibility secret
       */
      token?: string;
      /**
       * The base url for the BitBucket API, for example https://api.bitbucket.org/2.0
       */
      apiBaseUrl?: string;
      /**
       * The username to use for authenticated requests.
       * @visibility secret
       */
      username?: string;
      /**
       * BitBucket app password used to authenticate requests.
       * @visibility secret
       */
      appPassword?: string;
    }>;

    /** Integration configuration for GitHub */
    github?: Array<{
      /**
       * The hostname of the given GitHub instance
       */
      host: string;
      /**
       * Token used to authenticate requests.
       * @visibility secret
       */
      token?: string;
      /**
       * The base url for the GitHub API, for example https://api.github.com
       */
      apiBaseUrl?: string;
      /**
       * The base url for GitHub raw resources, for example https://raw.githubusercontent.com
       */
      rawBaseUrl?: string;
    }>;

    /** Integration configuration for GitLab */
    gitlab?: Array<{
      /**
       * The hostname of the given GitLab instance
       */
      host: string;
      /**
       * Token used to authenticate requests.
       * @visibility secret
       */
      token?: string;
    }>;
  };
}
