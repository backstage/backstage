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

    /** To control how to store JWK data in auth-backend */
    keyStore?: {
      provider?: 'postgres' | 'memory' | 'firestore';
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
      };
    };

    /**
     * The available auth-provider options and attributes
     */
    providers?: {
      google?: {
        [authEnv: string]: { [key: string]: string };
      };
      github?: {
        [authEnv: string]: { [key: string]: string };
      };
      gitlab?: {
        [authEnv: string]: { [key: string]: string };
      };
      saml?: {
        entryPoint: string;
        logoutUrl?: string;
        issuer: string;
        cert: string;
        privateKey?: string;
        authnContext?: string[];
        identifierFormat?: string;
        decryptionPvk?: string;
        signatureAlgorithm?: 'sha256' | 'sha512';
        digestAlgorithm?: string;
        acceptedClockSkewMs?: number;
      };
      okta?: {
        [authEnv: string]: { [key: string]: string };
      };
      oauth2?: {
        [authEnv: string]: {
          clientId: string;
          clientSecret: string;
          authorizationUrl: string;
          tokenUrl: string;
          scope?: string;
          disableRefresh?: boolean;
        };
      };
      oidc?: {
        [authEnv: string]: { [key: string]: string };
      };
      auth0?: {
        [authEnv: string]: { [key: string]: string };
      };
      microsoft?: {
        [authEnv: string]: { [key: string]: string };
      };
      onelogin?: {
        [authEnv: string]: { [key: string]: string };
      };
      awsalb?: {
        issuer?: string;
        region: string;
      };
    };
  };
}
