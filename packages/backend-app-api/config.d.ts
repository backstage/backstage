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
  backend?: {
    auth?: {
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

      /**
       * Configures methods of external access, ie ways for callers outside of
       * the Backstage ecosystem to get authorized for access to APIs that do
       * not permit unauthorized access.
       */
      externalAccess: Array<
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
          }
      >;
    };
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
