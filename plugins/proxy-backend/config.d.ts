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
  proxy?: {
    /**
     * Rather than failing to start up, the proxy backend will instead just warn on invalid endpoints.
     */
    skipInvalidProxies?: boolean;

    /**
     * Revive request bodies that have already been consumed by earlier middleware.
     */
    reviveConsumedRequestBodies?: boolean;

    /**
     * A list of forwarding-proxies. Each key is a route to match,
     * below the prefix that the proxy plugin is mounted on. It must
     * start with a '/'.
     */
    endpoints?: {
      [key: string]:
        | string
        | {
            /**
             * Target of the proxy. Url string to be parsed with the url module.
             */
            target: string;
            /**
             * Object with extra headers to be added to target requests.
             */
            headers?: {
              /** @visibility secret */
              Authorization?: string;
              /** @visibility secret */
              authorization?: string;
              /** @visibility secret */
              'X-Api-Key'?: string;
              /** @visibility secret */
              'x-api-key'?: string;
              [key: string]: string | undefined;
            };
            /**
             * Changes the origin of the host header to the target URL. Default: true.
             */
            changeOrigin?: boolean;
            /**
             * Rewrite target's url path. Object-keys will be used as RegExp to match paths.
             * If pathRewrite is not specified, it is set to a single rewrite that removes the entire prefix and route.
             */
            pathRewrite?: { [regexp: string]: string };
            /**
             * Limit the forwarded HTTP methods, for example allowedMethods: ['GET'] to enforce read-only access.
             */
            allowedMethods?: string[];
            /**
             * Limit the forwarded HTTP methods. By default, only the headers that are considered safe for CORS
             * and headers that are set by the proxy will be forwarded.
             */
            allowedHeaders?: string[];
            /**
             * The credentials policy to apply.
             *
             * @remarks
             *
             * The values are as follows:
             *
             * - 'require': Callers must provide Backstage user or service
             *   credentials with each request. The credentials are not
             *   forwarded to the proxy target.
             * - 'forward': Callers must provide Backstage user or service
             *   credentials with each request, and those credentials are
             *   forwarded to the proxy target.
             * - 'dangerously-allow-unauthenticated': No Backstage credentials
             *   are required to access this proxy target. The target can still
             *   apply its own credentials checks, but the proxy will not help
             *   block non-Backstage-blessed callers.
             *
             * Note that if you have
             * `backend.auth.dangerouslyDisableDefaultAuthPolicy` set to `true`,
             * the `credentials` value does not apply; the proxy will behave as
             * if all endpoints were set to `dangerously-allow-unauthenticated`.
             */
            credentials?:
              | 'require'
              | 'forward'
              | 'dangerously-allow-unauthenticated';
          };
    };
  } & {
    /**
     * This was the legacy way of expressing proxies, and is now deprecated. We
     * keep it around in the config schema, to ensure that legacy setups still
     * have properly secret-marked values so that they get redacted.
     *
     * TODO(freben): Remove this in the future (suggestion: after 2024-03-01)
     * when people likely have moved off of this format.
     */
    [key: string]:
      | string
      | {
          /**
           * Target of the proxy. Url string to be parsed with the url module.
           */
          target: string;
          /**
           * Object with extra headers to be added to target requests.
           */
          headers?: {
            /** @visibility secret */
            Authorization?: string;
            /** @visibility secret */
            authorization?: string;
            /** @visibility secret */
            'X-Api-Key'?: string;
            /** @visibility secret */
            'x-api-key'?: string;
            [key: string]: string | undefined;
          };
          /**
           * Changes the origin of the host header to the target URL. Default: true.
           */
          changeOrigin?: boolean;
          /**
           * Rewrite target's url path. Object-keys will be used as RegExp to match paths.
           * If pathRewrite is not specified, it is set to a single rewrite that removes the entire prefix and route.
           */
          pathRewrite?: { [regexp: string]: string };
          /**
           * Limit the forwarded HTTP methods, for example allowedMethods: ['GET'] to enforce read-only access.
           */
          allowedMethods?: string[];
          /**
           * Limit the forwarded HTTP methods. By default, only the headers that are considered safe for CORS
           * and headers that are set by the proxy will be forwarded.
           */
          allowedHeaders?: string[];
          /**
           * The credentials policy to apply.
           *
           * @remarks
           *
           * The values are as follows:
           *
           * - 'require': Callers must provide Backstage user or service
           *   credentials with each request. The credentials are not forwarded
           *   to the proxy target.
           * - 'forward': Callers must provide Backstage user or service
           *   credentials with each request, and those credentials are
           *   forwarded to the proxy target.
           * - 'dangerously-allow-unauthenticated': No Backstage credentials are
           *   required to access this proxy target. The target can still apply
           *   its own credentials checks, but the proxy will not help block
           *   non-Backstage-blessed callers.
           *
           * Note that if you have
           * `backend.auth.dangerouslyDisableDefaultAuthPolicy` set to `true`,
           * the `credentials` value does not apply; the proxy will behave as if
           * all endpoints were set to `dangerously-allow-unauthenticated`.
           */
          credentials?:
            | 'require'
            | 'forward'
            | 'dangerously-allow-unauthenticated';
        };
  };
}
