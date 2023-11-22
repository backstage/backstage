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

import {
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  createRouter,
  defaultAuthProviderFactories,
  providers,
} from '@backstage/plugin-auth-backend';
import { Router } from 'express';
import { PluginEnvironment } from '../types';

export default async function createPlugin(
  env: PluginEnvironment,
): Promise<Router> {
  return await createRouter({
    logger: env.logger,
    config: env.config,
    database: env.database,
    discovery: env.discovery,
    tokenManager: env.tokenManager,
    providerFactories: {
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
          resolver: async (info, ctx) => {
            const {
              profile: { email },
            } = info;
            // Profiles are not always guaranteed to to have an email address.
            // You can also find more provider-specific information in `info.result`.
            // It typically contains a `fullProfile` object as well as ID and/or access
            // tokens that you can use for additional lookups.
            if (!info.result.fullProfile.username) {
              throw new Error('Username does not exist');
            }
            if (!email) {
              throw new Error('User profile contained no email');
            }

            // By using `stringifyEntityRef` we ensure that the reference is formatted correctly
            const userEntityRef = stringifyEntityRef({
              kind: 'User',
              name: info.result.fullProfile.username,
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

      // This is an example of how to configure the OAuth2Proxy provider as well
      // as how to sign a user in without a matching user entity in the catalog.
      // You can try it out using `<ProxiedSignInPage {...props} provider="myproxy" />`
      myproxy: providers.oauth2Proxy.create({
        signIn: {
          async resolver({ result }, ctx) {
            const entityRef = stringifyEntityRef({
              kind: 'user',
              namespace: DEFAULT_NAMESPACE,
              name: result.getHeader('x-forwarded-user')!,
            });
            return ctx.issueToken({
              claims: {
                sub: entityRef,
                ent: [entityRef],
              },
            });
          },
        },
      }),
    },
  });
}
