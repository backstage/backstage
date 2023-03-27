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
import { OidcAuthResult } from '../oidc';
import { OidcAuthProvider } from '../oidc/provider';
import { OAuthAdapter, OAuthEnvironmentHandler } from '../../lib/oauth';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';
import { AuthHandler, SignInResolver } from '../types';

/**
 * Auth provider integration for Pinniped
 *
 * @public
 */
export const pinniped = createAuthProviderIntegration({
  create(options?: {
    authHandler?: AuthHandler<OidcAuthResult>;
    signIn?: {
      resolver: SignInResolver<OidcAuthResult>;
    };
  }) {
    return ({ providerId, globalConfig, config, resolverContext }) =>
      OAuthEnvironmentHandler.mapConfig(config, envConfig => {
        const clientId = envConfig.getString('clientId');
        const clientSecret = envConfig.getString('clientSecret');
        const customCallbackUrl = envConfig.getOptionalString('callbackUrl');
        const callbackUrl =
          customCallbackUrl ||
          `${globalConfig.baseUrl}/${providerId}/handler/frame`;
        const metadataUrl = `${envConfig.getString(
          'federationDomain',
        )}/.well-known/openid-configuration`;
        const tokenSignedResponseAlg = 'ES256';
        const prompt = 'auto';
        const authHandler: AuthHandler<OidcAuthResult> = async ({
          userinfo,
        }) => ({
          profile: {},
        });

        const provider = new OidcAuthProvider({
          clientId,
          clientSecret,
          callbackUrl,
          tokenSignedResponseAlg,
          metadataUrl,
          prompt,
          signInResolver: options?.signIn?.resolver,
          authHandler,
          resolverContext,
        });

        return OAuthAdapter.fromConfig(globalConfig, provider, {
          providerId,
          callbackUrl,
        });
      });
  },
});
