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
     * The available auth-provider options and attributes
     */
    providers?: {
      google?: {
        development: { [key: string]: string };
      };
      github?: {
        development: { [key: string]: string };
      };
      gitlab?: {
        development: { [key: string]: string };
      };
      saml?: {
        entryPoint: string;
        logoutUrl?: string;
        issuer: string;
        cert?: string;
        privateKey?: string;
        decryptionPvk?: string;
        signatureAlgorithm?: 'sha256' | 'sha512';
        digestAlgorithm?: string;
      };
      okta?: {
        development: { [key: string]: string };
      };
      oauth2?: {
        development: { [key: string]: string };
      };
      oidc?: {
        development: { [key: string]: string };
      };
      auth0?: {
        development: { [key: string]: string };
      };
      microsoft?: {
        development: { [key: string]: string };
      };
      onelogin?: {
        development: { [key: string]: string };
      };
      awsalb?: {
        issuer?: string;
        region: string;
      };
    };
  };
}
