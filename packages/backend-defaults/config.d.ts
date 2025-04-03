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

import { HumanDuration } from '@backstage/types';

export interface Config {
  app: {
    baseUrl: string; // defined in core, but repeated here without doc
  };

  backend?: {
    /**
     * The full base URL of the backend, as seen from the browser's point of
     * view as it makes calls to the backend.
     */
    baseUrl: string;

    lifecycle?: {
      /**
       * The maximum time that paused requests will wait for the service to start, before returning an error.
       * Defaults to 5 seconds
       * Supported formats:
       * - A string in the format of '1d', '2 seconds' etc. as supported by the `ms`
       *   library.
       * - A standard ISO formatted duration string, e.g. 'P2DT6H' or 'PT1M'.
       * - An object with individual units (in plural) as keys, e.g. `{ days: 2, hours: 6 }`.
       */
      startupRequestPauseTimeout?: string | HumanDuration;
      /**
       * The minimum time that the HTTP server will delay the shutdown of the backend. During this delay health checks will be set to failing, allowing traffic to drain.
       * Defaults to 0 seconds.
       * Supported formats:
       * - A string in the format of '1d', '2 seconds' etc. as supported by the `ms`
       *   library.
       * - A standard ISO formatted duration string, e.g. 'P2DT6H' or 'PT1M'.
       * - An object with individual units (in plural) as keys, e.g. `{ days: 2, hours: 6 }`.
       */
      serverShutdownDelay?: string | HumanDuration;
    };

    /** Address that the backend should listen to. */
    listen?:
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

    /**
     * Options used by the default auth, httpAuth and userInfo services.
     */
    auth?: {
      /**
       * Keys shared by all backends for signing and validating backend tokens.
       * @deprecated this will be removed when the backwards compatibility is no longer needed with backend-common
       */
      keys?: {
        /**
         * Secret for generating tokens. Should be a base64 string, recommended
         * length is 24 bytes.
         *
         * @visibility secret
         */
        secret: string;
      }[];
      /**
       * This disables the otherwise default auth policy, which requires all
       * requests to be authenticated with either user or service credentials.
       *
       * Disabling this check means that the backend will no longer block
       * unauthenticated requests, but instead allow them to pass through to
       * plugins.
       *
       * If permissions are enabled, unauthenticated requests will be treated
       * exactly as such, leaving it to the permission policy to determine what
       * permissions should be allowed for an unauthenticated identity. Note
       * that this will also apply to service-to-service calls between plugins
       * unless you configure credentials for service calls.
       */
      dangerouslyDisableDefaultAuthPolicy?: boolean;

      /** Controls how to store keys for plugin-to-plugin auth */
      pluginKeyStore?:
        | { type: 'database' }
        | {
            type: 'static';
            static: {
              /**
               * Must be declared at least once and the first one will be used for signing.
               */
              keys: Array<{
                /**
                 * Path to the public key file in the SPKI format. Should be an absolute path.
                 */
                publicKeyFile: string;
                /**
                 * Path to the matching private key file in the PKCS#8 format. Should be an absolute path.
                 *
                 * The first array entry must specify a private key file, the rest must not.
                 */
                privateKeyFile?: string;
                /**
                 * ID to uniquely identify this key within the JWK set.
                 */
                keyId: string;
                /**
                 * JWS "alg" (Algorithm) Header Parameter value. Defaults to ES256.
                 * Must match the algorithm used to generate the keys in the provided files
                 */
                algorithm?: string;
              }>;
            };
          };

      /**
       * Configures methods of external access, ie ways for callers outside of
       * the Backstage ecosystem to get authorized for access to APIs that do
       * not permit unauthorized access.
       */
      externalAccess?: Array<
        | {
            /**
             * This is the legacy service-to-service access method, where a set
             * of static keys were shared among plugins and used for symmetric
             * signing and verification. These correspond to the old
             * `backend.auth.keys` set and retain their behavior for backwards
             * compatibility. Please migrate to other access methods when
             * possible.
             *
             * Callers generate JWT tokens with the following payload:
             *
             * ```json
             * {
             *   "sub": "backstage-plugin",
             *   "exp": <epoch seconds one hour in the future>
             * }
             * ```
             *
             * And sign them with HS256, using the base64 decoded secret. The
             * tokens are then passed along with requests in the Authorization
             * header:
             *
             * ```
             * Authorization: Bearer eyJhbGciOiJIUzI...
             * ```
             */
            type: 'legacy';
            options: {
              /**
               * Any set of base64 encoded random bytes to be used as both the
               * signing and verification key. Should be sufficiently long so as
               * not to be easy to guess by brute force.
               *
               * Can be generated eg using
               *
               * ```sh
               * node -p 'require("crypto").randomBytes(24).toString("base64")'
               * ```
               *
               * @visibility secret
               */
              secret: string;

              /**
               * Sets the subject of the principal, when matching this token.
               * Useful for debugging and tracking purposes.
               */
              subject: string;
            };
            /**
             * Restricts what types of access that are permitted for this access
             * method. If no access restrictions are given, it'll have unlimited
             * access. This access restriction applies for the framework level;
             * individual plugins may have their own access control mechanisms
             * on top of this.
             */
            accessRestrictions?: Array<{
              /**
               * Permit access to make requests to this plugin.
               *
               * Can be further refined by setting additional fields below.
               */
              plugin: string;
              /**
               * If given, this method is limited to only performing actions
               * with these named permissions in this plugin.
               *
               * Note that this only applies where permissions checks are
               * enabled in the first place. Endpoints that are not protected by
               * the permissions system at all, are not affected by this
               * setting.
               */
              permission?: string | Array<string>;
              /**
               * If given, this method is limited to only performing actions
               * whose permissions have these attributes.
               *
               * Note that this only applies where permissions checks are
               * enabled in the first place. Endpoints that are not protected by
               * the permissions system at all, are not affected by this
               * setting.
               */
              permissionAttribute?: {
                /**
                 * One of more of 'create', 'read', 'update', or 'delete'.
                 */
                action?: string | Array<string>;
              };
            }>;
          }
        | {
            /**
             * This access method consists of random static tokens that can be
             * handed out to callers.
             *
             * The tokens are then passed along verbatim with requests in the
             * Authorization header:
             *
             * ```
             * Authorization: Bearer eZv5o+fW3KnR3kVabMW4ZcDNLPl8nmMW
             * ```
             */
            type: 'static';
            options: {
              /**
               * A raw token that can be any string, but for security reasons
               * should be sufficiently long so as not to be easy to guess by
               * brute force.
               *
               * Can be generated eg using
               *
               * ```sh
               * node -p 'require("crypto").randomBytes(24).toString("base64")'
               * ```
               *
               * Since the tokens can be any string, you are free to add
               * additional identifying data to them if you like. For example,
               * adding a `freben-local-dev-` prefix for debugging purposes to a
               * token that you know will be handed out for use as a personal
               * access token during development.
               *
               * @visibility secret
               */
              token: string;

              /**
               * Sets the subject of the principal, when matching this token.
               * Useful for debugging and tracking purposes.
               */
              subject: string;
            };
            /**
             * Restricts what types of access that are permitted for this access
             * method. If no access restrictions are given, it'll have unlimited
             * access. This access restriction applies for the framework level;
             * individual plugins may have their own access control mechanisms
             * on top of this.
             */
            accessRestrictions?: Array<{
              /**
               * Permit access to make requests to this plugin.
               *
               * Can be further refined by setting additional fields below.
               */
              plugin: string;
              /**
               * If given, this method is limited to only performing actions
               * with these named permissions in this plugin.
               *
               * Note that this only applies where permissions checks are
               * enabled in the first place. Endpoints that are not protected by
               * the permissions system at all, are not affected by this
               * setting.
               */
              permission?: string | Array<string>;
              /**
               * If given, this method is limited to only performing actions
               * whose permissions have these attributes.
               *
               * Note that this only applies where permissions checks are
               * enabled in the first place. Endpoints that are not protected by
               * the permissions system at all, are not affected by this
               * setting.
               */
              permissionAttribute?: {
                /**
                 * One of more of 'create', 'read', 'update', or 'delete'.
                 */
                action?: string | Array<string>;
              };
            }>;
          }
        | {
            /**
             * This access method consists of a JWKS endpoint that can be used to
             * verify JWT tokens.
             *
             * Callers generate JWT tokens via 3rd party tooling
             * and pass them in the Authorization header:
             *
             * ```
             * Authorization: Bearer eZv5o+fW3KnR3kVabMW4ZcDNLPl8nmMW
             * ```
             */
            type: 'jwks';
            options: {
              /**
               * The full URL of the JWKS endpoint.
               */
              url: string;
              /**
               * Sets the algorithm(s) that should be used to verify the JWT tokens.
               * The passed JWTs must have been signed using one of the listed algorithms.
               */
              algorithm?: string | string[];
              /**
               * Sets the issuer(s) that should be used to verify the JWT tokens.
               * Passed JWTs must have an `iss` claim which matches one of the specified issuers.
               */
              issuer?: string | string[];
              /**
               * Sets the audience(s) that should be used to verify the JWT tokens.
               * The passed JWTs must have an "aud" claim that matches one of the audiences specified,
               * or have no audience specified.
               */
              audience?: string | string[];
              /**
               * Sets an optional subject prefix. Passes the subject to called plugins.
               * Useful for debugging and tracking purposes.
               */
              subjectPrefix?: string;
            };
            /**
             * Restricts what types of access that are permitted for this access
             * method. If no access restrictions are given, it'll have unlimited
             * access. This access restriction applies for the framework level;
             * individual plugins may have their own access control mechanisms
             * on top of this.
             */
            accessRestrictions?: Array<{
              /**
               * Permit access to make requests to this plugin.
               *
               * Can be further refined by setting additional fields below.
               */
              plugin: string;
              /**
               * If given, this method is limited to only performing actions
               * with these named permissions in this plugin.
               *
               * Note that this only applies where permissions checks are
               * enabled in the first place. Endpoints that are not protected by
               * the permissions system at all, are not affected by this
               * setting.
               */
              permission?: string | Array<string>;
              /**
               * If given, this method is limited to only performing actions
               * whose permissions have these attributes.
               *
               * Note that this only applies where permissions checks are
               * enabled in the first place. Endpoints that are not protected by
               * the permissions system at all, are not affected by this
               * setting.
               */
              permissionAttribute?: {
                /**
                 * One of more of 'create', 'read', 'update', or 'delete'.
                 */
                action?: string | Array<string>;
              };
            }>;
          }
      >;
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
             * The specific config for cloudsql connections
             */
            type: 'cloudsql';
            /**
             * The instance connection name for the cloudsql instance, e.g. `project:region:instance`
             */
            instance: string;
            /**
             * The ip address type to use for the connection. Defaults to 'PUBLIC'
             */
            ipAddressType?: 'PUBLIC' | 'PRIVATE' | 'PSC';
          }
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
       * Whether to ensure the given database schema exists by creating it if it does not.
       * Defaults to false if unspecified.
       *
       * NOTE: Currently only supported by the `pg` client when pluginDivisionMode: schema
       */
      ensureSchemaExists?: boolean;
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
      /** Skip running database migrations. */
      skipMigrations?: boolean;
      /** Plugin specific database configuration and client override */
      plugin?: {
        [pluginId: string]: {
          /** Database client override */
          client?: 'better-sqlite3' | 'sqlite3' | 'pg';
          /**
           * Database connection string or Knex object override
           * @visibility secret
           */
          connection?:
            | string
            | {
                /**
                 * The specific config for cloudsql connections
                 */
                type: 'cloudsql';
                /**
                 * The instance connection name for the cloudsql instance, e.g. `project:region:instance`
                 */
                instance: string;
              }
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

          /**
           * Whether to ensure the given database exists by creating it if it does not.
           * Defaults to base config if unspecified.
           */
          ensureExists?: boolean;
          /**
           * Whether to ensure the given database schema exists by creating it if it does not.
           * Defaults to false if unspecified.
           *
           * NOTE: Currently only supported by the `pg` client when pluginDivisionMode: schema
           */
          ensureSchemaExists?: boolean;
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
          /** Skip running database migrations. */
          skipMigrations?: boolean;
        };
      };
    };

    /** Cache connection configuration, select cache type using the `store` field */
    cache?:
      | {
          store: 'memory';
          /** An optional default TTL (in milliseconds, if given as a number). */
          defaultTtl?: number | HumanDuration | string;
        }
      | {
          store: 'redis';
          /**
           * A redis connection string in the form `redis://user:pass@host:port`.
           * @visibility secret
           */
          connection: string;
          /** An optional default TTL (in milliseconds, if given as a number). */
          defaultTtl?: number | HumanDuration | string;
          redis?: {
            /**
             * An optional Redis client configuration.  These options are passed to the `@keyv/redis` client.
             */
            client?: {
              /**
               * Namespace for the current instance.
               */
              namespace?: string;
              /**
               * Separator to use between namespace and key.
               */
              keyPrefixSeparator?: string;
              /**
               * Number of keys to delete in a single batch.
               */
              clearBatchSize?: number;
              /**
               * Enable Unlink instead of using Del for clearing keys. This is more performant but may not be supported by all Redis versions.
               */
              useUnlink?: boolean;
              /**
               * Whether to allow clearing all keys when no namespace is set.
               * If set to true and no namespace is set, iterate() will return all keys.
               * Defaults to `false`.
               */
              noNamespaceAffectsAll?: boolean;
            };
            /**
             * An optional Redis cluster configuration.
             */
            cluster?: {
              /**
               * Cluster configuration options to be passed to the `@keyv/redis` client (and node-redis under the hood)
               * https://github.com/redis/node-redis/blob/master/docs/clustering.md
               *
               * @visibility secret
               */
              rootNodes: Array<object>;
              /**
               * Cluster node default configuration options to be passed to the `@keyv/redis` client (and node-redis under the hood)
               * https://github.com/redis/node-redis/blob/master/docs/clustering.md
               *
               * @visibility secret
               */
              defaults?: Partial<object>;
              /**
               * When `true`, `.connect()` will only discover the cluster topology, without actually connecting to all the nodes.
               * Useful for short-term or PubSub-only connections.
               */
              minimizeConnections?: boolean;
              /**
               * When `true`, distribute load by executing readonly commands (such as `GET`, `GEOSEARCH`, etc.) across all cluster nodes. When `false`, only use master nodes.
               */
              useReplicas?: boolean;
              /**
               * The maximum number of times a command will be redirected due to `MOVED` or `ASK` errors.
               */
              maxCommandRedirections?: number;
            };
          };
        }
      | {
          store: 'memcache';
          /**
           * A memcache connection string in the form `user:pass@host:port`.
           * @visibility secret
           */
          connection: string;
          /** An optional default TTL (in milliseconds). */
          defaultTtl?: number | HumanDuration | string;
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

    /**
     * Options for the health check service and endpoint.
     */
    health?: {
      /**
       * Additional headers to always include in the health check response.
       *
       * It can be a good idea to set a header that uniquely identifies your service
       * in a multi-service environment. This ensures that the health check that is
       * configured for your service is actually hitting your service and not another.
       *
       * For example, if using Envoy you can use the `service_name_matcher` configuration
       * and set the `x-envoy-upstream-healthchecked-cluster` header to a matching value.
       */
      headers?: { [name: string]: string };
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
  };

  /**
   * Options used by the default discovery service.
   */
  discovery?: {
    /**
     * A list of target baseUrls and the associated plugins.
     */
    endpoints: Array<{
      /**
       * The target base URL to use for the plugin.
       *
       * Can be either a string or an object with internal and external keys.
       * Targets with `{{pluginId}}` or `{{ pluginId }} in the URL will be replaced with the plugin ID.
       */
      target: string | { internal?: string; external?: string };
      /**
       * Array of plugins which use the target base URL.
       */
      plugins: string[];
    }>;
  };
}
