/*
 * Copyright 2020 The Backstage Authors
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
    /** Backend configuration for when request authentication is enabled */
    auth?: {
      /** Keys shared by all backends for signing and validating backend tokens. */
      keys?: {
        /**
         * Secret for generating tokens. Should be a base64 string, recommended
         * length is 24 bytes.
         *
         * @visibility secret
         */
        secret: string;
      }[];
    };

    baseUrl: string; // defined in core, but repeated here without doc

    /** Address that the backend should listen to. */
    listen:
      | string
      | {
          /** Address of the interface that the backend should bind to. */
          host?: string;
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
          /** Certificate configuration */
          certificate?: {
            /** PEM encoded certificate. Use $file to load in a file */
            cert: string;
            /**
             * PEM encoded certificate key. Use $file to load in a file.
             * @visibility secret
             */
            key: string;
          };
        };

    /** Database connection configuration, select base database type using the `client` field */
    database: {
      /** Default database client to use */
      client: 'better-sqlite3' | 'sqlite3' | 'pg';
      /**
       * Base database connection string, or object with individual connection properties
       * @visibility secret
       */
      connection:
        | string
        | {
            /**
             * Password that belongs to the client User
             * @visibility secret
             */
            password?: string;
            /**
             * Other connection settings
             */
            [key: string]: unknown;
          };
      /** Database name prefix override */
      prefix?: string;
      /**
       * Whether to ensure the given database exists by creating it if it does not.
       * Defaults to true if unspecified.
       */
      ensureExists?: boolean;
      /**
       * How plugins databases are managed/divided in the provided database instance.
       *
       * `database` -> Plugins are each given their own database to manage their schemas/tables.
       *
       * `schema` -> Plugins will be given their own schema (in the specified/default database)
       *             to manage their tables.
       *
       * NOTE: Currently only supported by the `pg` client.
       *
       * @default database
       */
      pluginDivisionMode?: 'database' | 'schema';
      /** Configures the ownership of newly created schemas in pg databases. */
      role?: string;
      /**
       * Arbitrary config object to pass to knex when initializing
       * (https://knexjs.org/#Installation-client). Most notable is the debug
       * and asyncStackTraces booleans
       */
      knexConfig?: object;
      /** Plugin specific database configuration and client override */
      plugin?: {
        [pluginId: string]: {
          /** Database client override */
          client?: 'better-sqlite3' | 'sqlite3' | 'pg';
          /**
           * Database connection string or Knex object override
           * @visibility secret
           */
          connection?: string | object;
          /**
           * Whether to ensure the given database exists by creating it if it does not.
           * Defaults to base config if unspecified.
           */
          ensureExists?: boolean;
          /**
           * Arbitrary config object to pass to knex when initializing
           * (https://knexjs.org/#Installation-client). Most notable is the
           * debug and asyncStackTraces booleans.
           *
           * This is merged recursively into the base knexConfig
           */
          knexConfig?: object;
          /** Configures the ownership of newly created schemas in pg databases. */
          role?: string;
        };
      };
    };

    /** Cache connection configuration, select cache type using the `store` field */
    cache?:
      | {
          store: 'memory';
        }
      | {
          store: 'redis';
          /**
           * A redis connection string in the form `redis://user:pass@host:port`.
           * @visibility secret
           */
          connection: string;
        }
      | {
          store: 'memcache';
          /**
           * A memcache connection string in the form `user:pass@host:port`.
           * @visibility secret
           */
          connection: string;
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
     * Configuration related to URL reading, used for example for reading catalog info
     * files, scaffolder templates, and techdocs content.
     */
    reading?: {
      /**
       * A list of targets to allow outgoing requests to. Users will be able to make
       * requests on behalf of the backend to the targets that are allowed by this list.
       */
      allow?: Array<{
        /**
         * A host to allow outgoing requests to, being either a full host or
         * a subdomain wildcard pattern with a leading `*`. For example `example.com`
         * and `*.example.com` are valid values, `prod.*.example.com` is not.
         * The host may also contain a port, for example `example.com:8080`.
         */
        host: string;

        /**
         * An optional list of paths. In case they are present only targets matching
         * any of them will are allowed. You can use trailing slashes to make sure only
         * subdirectories are allowed, for example `/mydir/` will allow targets with
         * paths like `/mydir/a` but will block paths like `/mydir2`.
         */
        paths?: string[];
      }>;
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

  /** Discovery options. */
  discovery?: {
    /**
     * Endpoints
     *
     * A list of target baseUrls and the associated plugins.
     */
    endpoints: {
      /**
       * The target baseUrl to use for the plugin
       *
       * Can be either a string or an object with internal and external keys.
       * Targets with `{{pluginId}}` or `{{ pluginId }} in the url will be replaced with the pluginId.
       */
      target: string | { internal: string; external: string };
      /** Array of plugins which use the target baseUrl. */
      plugins: string[];
    }[];
  };
}
