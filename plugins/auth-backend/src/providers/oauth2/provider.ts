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

import { OAuthResult } from '../../lib/oauth';
import { AuthHandler } from '../types';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';
import {
  adaptLegacyOAuthHandler,
  adaptLegacyOAuthSignInResolver,
} from '../../lib/legacy';
import {
  SignInResolver,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { oauth2Authenticator } from '@backstage/plugin-auth-backend-module-oauth2-provider';

/**
 * Auth provider integration for generic OAuth2 auth
 *
 * @public
 * @deprecated Migrate the auth plugin to the new backend system https://backstage.io/docs/backend-system/building-backends/migrating#the-auth-plugin
 */
export const oauth2 = createAuthProviderIntegration({
  create(options?: {
    authHandler?: AuthHandler<OAuthResult>;

    signIn?: {
      resolver: SignInResolver<OAuthResult>;
    };
  }) {
    return createOAuthProviderFactory({
      authenticator: oauth2Authenticator,
      profileTransform: adaptLegacyOAuthHandler(options?.authHandler),
      signInResolver: adaptLegacyOAuthSignInResolver(options?.signIn?.resolver),
    });
  },
});
