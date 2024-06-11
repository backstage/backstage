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

import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';

import {
  authProvidersExtensionPoint,
  commonSignInResolvers,
  createProxyAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { createHolosProxyAuthenticator } from './authenticator';
import { oidcProxySignInResolvers } from './resolvers';

/**
 * authModuleOidcProxyProvider implements oidc id token authentication against a
 * header set by an identity aware proxy.  The issuer and audience config values
 * are required.  The optional oidcIdTokenHeader config setting represents the
 * http request header with the id token value.  The x-oidc-id-token header is
 * used by default if oidcIdTokenHeader is undefined.
 *
 * @public
 */
export const authModuleOidcProxyProvider = createBackendModule({
  pluginId: 'auth',
  moduleId: 'oidc-proxy-provider',
  register(reg) {
    reg.registerInit({
      deps: {
        logger: coreServices.logger,
        providers: authProvidersExtensionPoint,
      },
      async init({ logger, providers }) {
        providers.registerProvider({
          providerId: 'oidcProxy',
          factory: createProxyAuthProviderFactory({
            authenticator: createHolosProxyAuthenticator(logger),
            signInResolverFactories: {
              ...oidcProxySignInResolvers,
              ...commonSignInResolvers,
            },
          }),
        });
        logger.info('auth backend-module holos-proxy-provider initialized');
      },
    });
  },
});
