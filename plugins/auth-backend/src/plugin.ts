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

import { loggerToWinstonLogger } from '@backstage/backend-common';
import {
  createBackendPlugin,
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';

import {
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  createRouter,
  providers,
  defaultAuthProviderFactories,
  AuthProviderFactory,
} from '@backstage/plugin-auth-backend';
import {
  AuthProviderExtensionPoint,
  authProviderExtensionPoint,
} from '@backstage/plugin-auth-node/alpha';

class AuthProviderExtensionPointImpl implements AuthProviderExtensionPoint {
  #factories: Record<string, AuthProviderFactory> = {};

  addProviders(factories: Record<string, AuthProviderFactory>): void {
    this.#factories = {
      ...this.#factories,
      ...factories,
    };
  }

  get factories() {
    return this.#factories;
  }
}

/**
 * Module that registers Demo Auth Providers.
 *
 * @alpha
 */
export const authModuleDemoAuthProviders = createBackendModule({
  pluginId: 'auth',
  moduleId: 'demoAuthProviders',
  register(env) {
    env.registerInit({
      deps: {
        auth: authProviderExtensionPoint,
      },
      async init({ auth }) {
        auth.addProviders({
          ...defaultAuthProviderFactories,

          // NOTE: DO NOT add this many resolvers in your own instance!
          //       It is important that each real user always gets resolved to
          //       the same sign-in identity. The code below will not do that.
          //       It is here for demo purposes only.
          github: providers.github.create({
            signIn: {
              async resolver({ result: { fullProfile } }, ctx) {
                const userId = fullProfile.username;
                if (!userId) {
                  throw new Error(
                    `GitHub user profile does not contain a username`,
                  );
                }

                const userEntityRef = stringifyEntityRef({
                  kind: 'User',
                  name: userId,
                  namespace: DEFAULT_NAMESPACE,
                });

                return ctx.issueToken({
                  claims: {
                    sub: userEntityRef,
                    ent: [userEntityRef],
                  },
                });
              },
            },
          }),
          gitlab: providers.gitlab.create({
            signIn: {
              async resolver({ result: { fullProfile } }, ctx) {
                return ctx.signInWithCatalogUser({
                  entityRef: {
                    name: fullProfile.id,
                  },
                });
              },
            },
          }),
          microsoft: providers.microsoft.create({
            signIn: {
              resolver:
                providers.microsoft.resolvers.emailMatchingUserEntityAnnotation(),
            },
          }),
          google: providers.google.create({
            signIn: {
              resolver:
                providers.google.resolvers.emailLocalPartMatchingUserEntityName(),
            },
          }),
          okta: providers.okta.create({
            signIn: {
              resolver:
                providers.okta.resolvers.emailMatchingUserEntityAnnotation(),
            },
          }),
          bitbucket: providers.bitbucket.create({
            signIn: {
              resolver:
                providers.bitbucket.resolvers.usernameMatchingUserEntityAnnotation(),
            },
          }),
          onelogin: providers.onelogin.create({
            signIn: {
              async resolver({ result: { fullProfile } }, ctx) {
                return ctx.signInWithCatalogUser({
                  entityRef: {
                    name: fullProfile.id,
                  },
                });
              },
            },
          }),

          bitbucketServer: providers.bitbucketServer.create({
            signIn: {
              resolver:
                providers.bitbucketServer.resolvers.emailMatchingUserEntityProfileEmail(),
            },
          }),
        });
      },
    });
  },
});

/**
 * This is the backend plugin that provides the auth integration.
 * @alpha
 */
export const authPlugin = createBackendPlugin({
  pluginId: 'auth',
  register(env) {
    const providerExtensions = new AuthProviderExtensionPointImpl();
    // plugins depending on this API will be initialized before this plugins init method is executed.
    env.registerExtensionPoint(authProviderExtensionPoint, providerExtensions);

    env.registerInit({
      deps: {
        http: coreServices.httpRouter,
        logger: coreServices.logger,
        config: coreServices.config,
        database: coreServices.database,
        discovery: coreServices.discovery,
        tokenManager: coreServices.tokenManager,
      },
      async init({ http, logger, config, database, discovery, tokenManager }) {
        const winstonLogger = loggerToWinstonLogger(logger);
        const router = await createRouter({
          logger: winstonLogger,
          config: config,
          database: database,
          discovery: discovery,
          tokenManager: tokenManager,
          providerFactories: providerExtensions.factories,
        });
        http.use(router);
      },
    });
  },
});
