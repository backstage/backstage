/*
 * Copyright 2023 The Backstage Authors
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

import {
  AuthService,
  coreServices,
  createBackendPlugin,
  ServiceRef,
} from '@backstage/backend-plugin-api';
import { RequestHandler } from 'express';
import { cacheToPluginCacheManager } from './cache';
import { loggerToWinstonLogger } from './logging';
import { TokenManager } from './tokens';

/**
 * @public
 */
export type LegacyCreateRouter<TEnv> = (deps: TEnv) => Promise<RequestHandler>;

/** @ignore */
type TransformedEnv<
  TEnv extends Record<string, unknown>,
  TEnvTransforms extends { [key in keyof TEnv]?: (dep: TEnv[key]) => unknown },
> = {
  [key in keyof TEnv]: TEnvTransforms[key] extends (dep: TEnv[key]) => infer R
    ? R
    : TEnv[key];
};

// Since the plugin will be using the new system our callers will expect us to support the
// new plugin tokens, which we'll also be signaling by supporting the JWKS endpoint through
// the http router.
// This makes sure that we accept the new plugin tokens as valid tokens, but otherwise fall
// back to whatever the token manager is doing.
function wrapTokenManager(tokenManager: TokenManager, auth: AuthService) {
  return {
    async getToken() {
      return tokenManager.getToken();
    },
    async authenticate(token) {
      if (token) {
        // Unless it's a valid service token, we'll let the token manager do
        // validation. We'll throw if we for example receive an invalid user
        // token here, but that's what the token manager does too.
        const credentials = await auth.authenticate(token);
        if (auth.isPrincipal(credentials, 'service')) {
          return;
        }
      }
      await tokenManager.authenticate(token);
    },
  } satisfies TokenManager;
}

/**
 * Creates a new custom plugin compatibility wrapper.
 *
 * @public
 * @remarks
 *
 * Usually you can use {@link legacyPlugin} directly instead, but you might
 * need to use this if you have customized the plugin environment in your backend.
 */
export function makeLegacyPlugin<
  TEnv extends Record<string, unknown>,
  TEnvTransforms extends { [key in keyof TEnv]?: (dep: TEnv[key]) => unknown },
>(
  envMapping: { [key in keyof TEnv]: ServiceRef<TEnv[key]> },
  envTransforms: TEnvTransforms,
) {
  return (
    name: string,
    createRouterImport: Promise<{
      default: LegacyCreateRouter<TransformedEnv<TEnv, TEnvTransforms>>;
    }>,
  ) => {
    const compatPlugin = createBackendPlugin({
      pluginId: name,
      register(env) {
        env.registerInit({
          deps: {
            ...envMapping,
            _router: coreServices.httpRouter,
            _auth: coreServices.auth,
          },
          async init({ _router, _auth, ...envDeps }) {
            const { default: createRouter } = await createRouterImport;
            const pluginEnv = Object.fromEntries(
              Object.entries(envDeps).map(([key, dep]) => {
                const transform = envTransforms[key];
                if (transform) {
                  return [key, transform(dep)];
                }
                if (key === 'tokenManager') {
                  return [key, wrapTokenManager(dep as TokenManager, _auth)];
                }
                return [key, dep];
              }),
            );
            const router = await createRouter(
              pluginEnv as TransformedEnv<TEnv, TEnvTransforms>,
            );
            _router.use(router);
          },
        });
      },
    });

    return compatPlugin();
  };
}

/**
 * Helper function to create a plugin from a legacy createRouter function and
 * register it with the http router based on the plugin id.
 *
 * @public
 * @remarks
 *
 * This is intended to be used by plugin authors to ease the transition to the
 * new backend system.
 *
 * @example
 *
 *```ts
 *backend.add(legacyPlugin('kafka', import('./plugins/kafka')));
 *```
 */
export const legacyPlugin = makeLegacyPlugin(
  {
    cache: coreServices.cache,
    config: coreServices.rootConfig,
    database: coreServices.database,
    discovery: coreServices.discovery,
    logger: coreServices.logger,
    permissions: coreServices.permissions,
    scheduler: coreServices.scheduler,
    tokenManager: coreServices.tokenManager,
    reader: coreServices.urlReader,
    identity: coreServices.identity,
  },
  {
    logger: log => loggerToWinstonLogger(log),
    cache: cache => cacheToPluginCacheManager(cache),
  },
);
