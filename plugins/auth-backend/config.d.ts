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
  /** Configuration options for the auth plugin */
  auth?: {
    /**
     * The 'environment' attribute
     * @visibility frontend
     */
    environment?: string;

    session?: {
      /**
       * The secret attribute of session object.
       * @visibility secret
       */
      secret?: string;
    };

    /**
     * JWS "alg" (Algorithm) Header Parameter value. Defaults to ES256.
     * Must match one of the algorithms defined for IdentityClient.
     * When setting a different algorithm, check if the `key` field
     * of the `signing_keys` table can fit the length of the generated keys.
     * If not, add a knex migration file in the migrations folder.
     * More info on supported algorithms: https://github.com/panva/jose
     */
    identityTokenAlgorithm?: string;

    /**
     * Whether to omit the entity ownership references (`ent`) claim from the
     * identity token.
     *
     * If this is disabled an `ent` claim will be included in the token
     * containing all of the user's ownership refs as returned by the sign in
     * resolver. This can in extreme cases lead to tokens that risk hitting HTTP
     * header size limits. Setting it to `false` is therefore discouraged, and
     * is only provided for backward compatibility reasons.
     *
     * Defaults to `true`, which means that the `ent` claim instead is available
     * via the user info endpoint and the `UserInfoService`.
     */
    omitIdentityTokenOwnershipClaim?: boolean;

    /** To control how to store JWK data in auth-backend */
    keyStore?: {
      provider?: 'database' | 'memory' | 'firestore' | 'static';
      firestore?: {
        /** The host to connect to */
        host?: string;
        /** The port to connect to */
        port?: number;
        /** Whether to use SSL when connecting. */
        ssl?: boolean;
        /** The Google Cloud Project ID */
        projectId?: string;
        /**
         * Local file containing the Service Account credentials.
         * You can omit this value to automatically read from
         * GOOGLE_APPLICATION_CREDENTIALS env which is useful for local
         * development.
         */
        keyFilename?: string;
        /** The path to use for the collection. Defaults to 'sessions' */
        path?: string;
        /** Timeout used for database operations. Defaults to 10000ms */
        timeout?: number;
      };
      static?: {
        /** Must be declared at least once and the first one will be used for signing */
        keys: Array<{
          /** Path to the public key file in the SPKI format */
          publicKeyFile: string;
          /** Path to the matching private key file in the PKCS#8 format */
          privateKeyFile: string;
          /** id to uniquely identify this key within the JWK set */
          keyId: string;
          /** JWS "alg" (Algorithm) Header Parameter value. Defaults to ES256.
           * Must match the algorithm used to generate the keys in the provided files
           */
          algorithm?: string;
        }>;
      };
    };

    /**
     * The backstage token expiration.
     */
    backstageTokenExpiration?: HumanDuration | string;

    /**
     * Configuration for refresh tokens (offline access)
     * @visibility backend
     */
    experimentalRefreshToken?: {
      /**
       * Whether to enable refresh tokens
       * @default false
       * @visibility backend
       */
      enabled?: boolean;
      /**
       * Token lifetime before rotation required
       * @default '30 days'
       * @visibility backend
       */
      tokenLifetime?: HumanDuration | string;
      /**
       * Maximum session lifetime across all rotations
       * @default '1 year'
       * @visibility backend
       */
      maxRotationLifetime?: HumanDuration | string;
      /**
       * Maximum number of refresh tokens per user
       * @default 20
       * @visibility backend
       */
      maxTokensPerUser?: number;
      /**
       * Disables the check that verifies the user's catalog entity still
       * exists when refreshing a token. This is an escape hatch for
       * Backstage instances that allow sign-in without a corresponding
       * catalog user entity. Without the check, refresh tokens for
       * removed or offboarded users remain valid until they naturally
       * expire.
       * @default false
       * @visibility backend
       */
      dangerouslyDisableCatalogPresenceCheck?: boolean;
    };

    /**
     * Additional app origins to allow for authenticating
     */
    experimentalExtraAllowedOrigins?: string[];

    /**
     * Configuration for dynamic client registration
     * @deprecated Use `auth.clientIdMetadataDocuments` instead.
     */
    experimentalDynamicClientRegistration?: {
      /**
       * Whether to enable dynamic client registration
       * Defaults to false
       */
      enabled?: boolean;

      /**
       * A list of allowed URI patterns to use for redirect URIs during
       * dynamic client registration.
       *
       * Patterns are matched per URL component: a `*` in the hostname or
       * path only matches within that component, and a `:*` port matches
       * any port. Patterns must include an explicit protocol and only
       * match the path they list, e.g. `http://localhost:*\/*` allows any
       * port and any path on localhost.
       *
       * Defaults to Cursor and loopback addresses (localhost, 127.0.0.1, [::1]).
       *
       * @example ['http://localhost:*\/*', 'https://*.example.com/callback']
       */
      allowedRedirectUriPatterns?: string[];
    };

    /**
     * Configuration for Client ID Metadata Documents (CIMD)
     *
     * @see https://datatracker.ietf.org/doc/draft-ietf-oauth-client-id-metadata-document/
     */
    clientIdMetadataDocuments?: {
      /**
       * Whether to enable Client ID Metadata Documents support
       * Defaults to false
       */
      enabled?: boolean;

      /**
       * A list of allowed URI patterns for client_id URLs.
       * Uses glob-style pattern matching where `*` matches any characters.
       * Defaults to `['https://claude.ai/*', 'https://vscode.dev/*', '{baseUrl}/.well-known/oauth-client/cli.json']`
       * where `{baseUrl}` is the auth backend's base URL.
       *
       * @example ['https://example.com/*', 'https://*.trusted-domain.com/*']
       */
      allowedClientIdPatterns?: string[];

      /**
       * A list of allowed URI patterns for redirect URIs.
       * Uses glob-style pattern matching where `*` matches any characters.
       * Defaults to loopback addresses (localhost, 127.0.0.1, [::1]).
       *
       * @example ['http://localhost:*', 'http://127.0.0.1:*\/callback']
       */
      allowedRedirectUriPatterns?: string[];
    };

    /**
     * Configuration for Client ID Metadata Documents (CIMD)
     * @deprecated This is no longer experimental; use `auth.clientIdMetadataDocuments` instead.
     */
    experimentalClientIdMetadataDocuments?: {
      /**
       * Whether to enable Client ID Metadata Documents support
       * Defaults to false
       */
      enabled?: boolean;

      /**
       * A list of allowed URI patterns for client_id URLs.
       *
       * Patterns are matched per URL component: a `*` in the hostname or
       * path only matches within that component, and a `:*` port matches
       * any port. Patterns must include an explicit protocol.
       *
       * Defaults to `['https://claude.ai/*', 'https://vscode.dev/*', '{baseUrl}/.well-known/oauth-client/cli.json']`
       * where `{baseUrl}` is the auth backend's base URL.
       *
       * @example ['https://example.com/*', 'https://*.trusted-domain.com/*']
       */
      allowedClientIdPatterns?: string[];

      /**
       * A list of allowed URI patterns for redirect URIs.
       *
       * Patterns are matched per URL component: a `*` in the hostname or
       * path only matches within that component, and a `:*` port matches
       * any port. Patterns must include an explicit protocol and only
       * match the path they list, e.g. `http://localhost:*\/*` allows any
       * port and any path on localhost.
       *
       * Defaults to loopback addresses (localhost, 127.0.0.1, [::1]).
       *
       * @example ['http://localhost:*\/*', 'http://127.0.0.1:*\/callback']
       */
      allowedRedirectUriPatterns?: string[];
    };
  };
}
