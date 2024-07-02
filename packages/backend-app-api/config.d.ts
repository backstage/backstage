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
