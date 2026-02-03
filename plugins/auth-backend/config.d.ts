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
     * identity token. If this is enabled the `ent` claim will only be available
     * via the user info endpoint and the `UserInfoService`.
     *
     * Defaults to `false`.
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
     * Defaults to 1 hour (3600s). Maximum allowed is 24 hours.
     */
    backstageTokenExpiration?: HumanDuration | string;

    /**
     * Additional app origins to allow for authenticating
     */
    experimentalExtraAllowedOrigins?: string[];

    /**
     * Configuration for dynamic client registration
     */
    experimentalDynamicClientRegistration?: {
      /**
       * Whether to enable dynamic client registration
       * Defaults to false
       */
      enabled?: boolean;

      /**
       * A list of allowed URI patterns to use for redirect URIs during
       * dynamic client registration. Defaults to '[*]' which allows any redirect URI.
       */
      allowedRedirectUriPatterns?: string[];

      /**
       * The expiration time for the client registration access tokens.
       * Defaults to 1 hour (3600s). Maximum allowed is 24 hours.
       */
      tokenExpiration?: HumanDuration | string;
    };
  };
}
