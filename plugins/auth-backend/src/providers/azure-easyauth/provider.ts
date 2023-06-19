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
  AuthHandler,
  AuthProviderRouteHandlers,
  AuthResolverContext,
  AuthResponse,
  SignInResolver,
} from '@backstage/plugin-auth-node';
import { Request, Response } from 'express';
import { makeProfileInfo } from '../../lib/passport';
import { AuthenticationError } from '@backstage/errors';
import { prepareBackstageIdentityResponse } from '../prepareBackstageIdentityResponse';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';
import { Profile } from 'passport';
import { decodeJwt } from 'jose';

export const ID_TOKEN_HEADER = 'x-ms-token-aad-id-token';
export const ACCESS_TOKEN_HEADER = 'x-ms-token-aad-access-token';

type Options = {
  authHandler: AuthHandler<EasyAuthResult>;
  signInResolver: SignInResolver<EasyAuthResult>;
  resolverContext: AuthResolverContext;
};

/** @public */
export type EasyAuthResult = {
  fullProfile: Profile;
  accessToken?: string;
};

export type EasyAuthResponse = AuthResponse<{}>;

export class EasyAuthAuthProvider implements AuthProviderRouteHandlers {
  private readonly resolverContext: AuthResolverContext;
  private readonly authHandler: AuthHandler<EasyAuthResult>;
  private readonly signInResolver: SignInResolver<EasyAuthResult>;

  constructor(options: Options) {
    this.authHandler = options.authHandler;
    this.signInResolver = options.signInResolver;
    this.resolverContext = options.resolverContext;
  }

  frameHandler(): Promise<void> {
    return Promise.resolve(undefined);
  }

  async refresh(req: Request, res: Response): Promise<void> {
    const result = await this.getResult(req);
    const response = await this.handleResult(result);
    res.json(response);
  }

  start(): Promise<void> {
    return Promise.resolve(undefined);
  }

  private async getResult(req: Request): Promise<EasyAuthResult> {
    const idToken = req.header(ID_TOKEN_HEADER);
    const accessToken = req.header(ACCESS_TOKEN_HEADER);
    if (idToken === undefined) {
      throw new AuthenticationError(`Missing ${ID_TOKEN_HEADER} header`);
    }

    return {
      fullProfile: this.idTokenToProfile(idToken),
      accessToken: accessToken,
    };
  }

  private idTokenToProfile(idToken: string) {
    const claims = decodeJwt(idToken);

    if (claims.ver !== '2.0') {
      throw new Error('id_token is not version 2.0 ');
    }

    return {
      id: claims.oid,
      displayName: claims.name,
      provider: 'easyauth',
      emails: [{ value: claims.email }],
      username: claims.preferred_username,
    } as Profile;
  }

  private async handleResult(
    result: EasyAuthResult,
  ): Promise<EasyAuthResponse> {
    const { profile } = await this.authHandler(result, this.resolverContext);

    const backstageIdentity = await this.signInResolver(
      {
        result,
        profile,
      },
      this.resolverContext,
    );

    return {
      providerInfo: {
        accessToken: result.accessToken,
      },
      backstageIdentity: prepareBackstageIdentityResponse(backstageIdentity),
      profile,
    };
  }
}

/**
 * Auth provider integration for Azure EasyAuth
 *
 * @public
 */
export const easyAuth = createAuthProviderIntegration({
  create(options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<EasyAuthResult>;

    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn: {
      /**
       * Maps an auth result to a Backstage identity for the user.
       */
      resolver: SignInResolver<EasyAuthResult>;
    };
  }) {
    return ({ resolverContext }) => {
      validateAppServiceConfiguration(process.env);

      if (options?.signIn.resolver === undefined) {
        throw new Error(
          'SignInResolver is required to use this authentication provider',
        );
      }

      const authHandler =
        options.authHandler ??
        (async ({ fullProfile }) => ({
          profile: makeProfileInfo(fullProfile),
        }));

      return new EasyAuthAuthProvider({
        signInResolver: options.signIn.resolver,
        authHandler,
        resolverContext,
      });
    };
  },
});

function validateAppServiceConfiguration(env: NodeJS.ProcessEnv) {
  // Based on https://github.com/AzureAD/microsoft-identity-web/blob/f7403779d1a91f4a3fec0ed0993bd82f50f299e1/src/Microsoft.Identity.Web/AppServicesAuth/AppServicesAuthenticationInformation.cs#L38-L59
  //
  // It's critical to validate we're really running in a correctly configured Azure App Services,
  // As we rely on App Services to manage & validate the ID and Access Token headers
  // Without that, this users can be trivially impersonated.
  if (env.WEBSITE_SKU === undefined) {
    throw new Error('Backstage is not running on Azure App Services');
  }
  if (env.WEBSITE_AUTH_ENABLED?.toLowerCase() !== 'true') {
    throw new Error('Azure App Services does not have authentication enabled');
  }
  if (
    env.WEBSITE_AUTH_DEFAULT_PROVIDER?.toLowerCase() !== 'azureactivedirectory'
  ) {
    throw new Error('Authentication provider is not Azure Active Directory');
  }
  if (process.env.WEBSITE_AUTH_TOKEN_STORE?.toLowerCase() !== 'true') {
    throw new Error('Token Store is not enabled');
  }
}
