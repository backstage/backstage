/*
 * Copyright 2021 The Backstage Authors
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
  SignInResolver,
  createProxyAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { AuthHandler } from '../types';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';
import {
  type OAuth2ProxyResult,
  oauth2ProxyAuthenticator,
} from '@backstage/plugin-auth-backend-module-oauth2-proxy-provider';

/**
 * Auth provider integration for oauth2-proxy auth
 *
 * @public
 * @deprecated Migrate the auth plugin to the new backend system https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
 */
export const oauth2Proxy = createAuthProviderIntegration({
  create(options: {
    /**
     * Configure an auth handler to generate a profile for the user.
     *
     * The default implementation uses the value of the `X-Forwarded-Preferred-Username`
     * header as the display name, falling back to `X-Forwarded-User`, and the value of
     * the `X-Forwarded-Email` header as the email address.
     */
    authHandler?: AuthHandler<OAuth2ProxyResult>;

    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn: {
      /**
       * Maps an auth result to a Backstage identity for the user.
       */
      resolver: SignInResolver<OAuth2ProxyResult>;
    };
  }) {
    return createProxyAuthProviderFactory({
      authenticator: oauth2ProxyAuthenticator,
      profileTransform: options?.authHandler,
      signInResolver: options?.signIn?.resolver,
    });
  },
});
