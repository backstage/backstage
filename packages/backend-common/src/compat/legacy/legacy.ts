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
  LoggerService,
  RootConfigService,
  ServiceRef,
  UserInfoService,
} from '@backstage/backend-plugin-api';
import { RequestHandler } from 'express';
import { cacheToPluginCacheManager } from '../cache';
import { loggerToWinstonLogger } from '../logging';
import { ServerTokenManager, TokenManager } from '../../deprecated';
import { Request } from 'express';

/**
 * @public
 * @deprecated Fully use the new backend system instead.
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
// back to the legacy token manager.
function createTokenManagerShim(
  auth: AuthService,
  config: RootConfigService,
  logger: LoggerService,
): TokenManager {
  const tokenManager = ServerTokenManager.fromConfig(config, { logger });
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
  };
}

/**
 * Originally IdentityApi from `@backstage/plugin-auth-node`, re-declared here for backwards compatibility
 * @public
 * @deprecated Only relevant for legacy plugins, which are deprecated.
 */
export interface LegacyIdentityService {
  getIdentity(options: { request: Request<unknown> }): Promise<
    | {
        expiresInSeconds?: number;

        token: string;
        identity: {
          type: 'user';
          userEntityRef: string;
          ownershipEntityRefs: string[];
        };
      }
    | undefined
  >;
}

// This doesn't use DefaultIdentityClient because we will be removing it and break support for ownershipEntityRefs
function createIdentityServiceShim(
  auth: AuthService,
  userInfo: UserInfoService,
): LegacyIdentityService {
  return {
    async getIdentity(options) {
      const authHeader = options.request.headers.authorization;
      if (typeof authHeader !== 'string') {
        return undefined;
      }

      const token = authHeader.match(/^Bearer[ ]+(\S+)$/i)?.[1];
      if (!token) {
        return undefined;
      }

      const credentials = await auth.authenticate(token);
      if (!auth.isPrincipal(credentials, 'user')) {
        return undefined;
      }

      const info = await userInfo.getUserInfo(credentials);

      return {
        token,
        identity: {
          type: 'user',
          userEntityRef: info.userEntityRef,
          ownershipEntityRefs: info.ownershipEntityRefs,
        },
      };
    },
  };
}

/**
 * Creates a new custom plugin compatibility wrapper.
 *
 * @public
 * @deprecated Fully use the new backend system instead.
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
      default: LegacyCreateRouter<
        TransformedEnv<TEnv, TEnvTransforms> & {
          tokenManager: TokenManager;
          identity: LegacyIdentityService;
        }
      >;
    }>,
  ) => {
    return createBackendPlugin({
      pluginId: name,
      register(env) {
        env.registerInit({
          deps: {
            ...envMapping,
            $$router: coreServices.httpRouter,
            $$auth: coreServices.auth,
            $$userInfo: coreServices.userInfo,
            $$config: coreServices.rootConfig,
            $$logger: coreServices.logger,
          },
          async init({
            $$auth,
            $$config,
            $$logger,
            $$router,
            $$userInfo,
            ...envDeps
          }) {
            const { default: createRouter } = await createRouterImport;
            const pluginEnv = Object.fromEntries(
              Object.entries(envDeps).map(([key, dep]) => {
                const transform = envTransforms[key];
                if (transform) {
                  return [key, transform(dep)];
                }
                return [key, dep];
              }),
            );

            const auth = $$auth as typeof coreServices.auth.T;
            const config = $$config as typeof coreServices.rootConfig.T;
            const logger = $$logger as typeof coreServices.logger.T;
            const router = $$router as typeof coreServices.httpRouter.T;
            const userInfo = $$userInfo as typeof coreServices.userInfo.T;

            // Token manager and identity services are no longer supported in the new backend system, so we provide shims for them.
            pluginEnv.tokenManager = createTokenManagerShim(
              auth,
              config,
              logger,
            );
            pluginEnv.identity = createIdentityServiceShim(auth, userInfo);

            const pluginRouter = await createRouter(
              pluginEnv as TransformedEnv<TEnv, TEnvTransforms> & {
                tokenManager: TokenManager;
                identity: LegacyIdentityService;
              },
            );
            router.use(pluginRouter);
          },
        });
      },
    });
  };
}

/**
 * Helper function to create a plugin from a legacy createRouter function and
 * register it with the http router based on the plugin id.
 *
 * @public
 * @deprecated Fully use the new backend system instead.
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
    reader: coreServices.urlReader,
  },
  {
    logger: log => loggerToWinstonLogger(log),
    cache: cache => cacheToPluginCacheManager(cache),
  },
);
