/*
 * Copyright 2024 The Backstage Authors
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
  auth?: {
    providers?: {
      /**
       * Configuration for the Holos Platform identity aware proxy auth provider.
       */
      oidcProxy?: {
        [authEnv: string]: {
          /**
           * issuer represents the iss claim value to assert validating an id token.
           */
          issuer: string;

          /**
           * audience represents the aud claim value to assert when validating an id token.
           */
          audience: string;

          /**
           * idTokenHeader represents the header to read the id token from.  Defaults to `'x-oidc-id-token'`.
           */
          idTokenHeader?: string;
        };
      };
    };
  };
}
