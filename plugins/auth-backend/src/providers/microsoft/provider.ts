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

import express from 'express';
import passport from 'passport';
import { Strategy as MicrosoftStrategy } from 'passport-microsoft';
import {
  encodeState,
  OAuthAdapter,
  OAuthEnvironmentHandler,
  OAuthHandlers,
  OAuthProviderOptions,
  OAuthRefreshRequest,
  OAuthResponse,
  OAuthResult,
  OAuthStartRequest,
} from '../../lib/oauth';
import {
  executeFetchUserProfileStrategy,
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  executeRefreshTokenStrategy,
  makeProfileInfo,
  PassportDoneCallback,
} from '../../lib/passport';
import {
  AuthHandler,
  RedirectInfo,
  SignInResolver,
  AuthResolverContext,
} from '../types';
import { createAuthProviderIntegration } from '../createAuthProviderIntegration';
import {
  commonByEmailLocalPartResolver,
  commonByEmailResolver,
} from '../resolvers';
import { Logger } from 'winston';
import fetch from 'node-fetch';

type PrivateInfo = {
  refreshToken: string;
};

type Options = OAuthProviderOptions & {
  signInResolver?: SignInResolver<OAuthResult>;
  authHandler: AuthHandler<OAuthResult>;
  logger: Logger;
  resolverContext: AuthResolverContext;
  authorizationUrl?: string;
  tokenUrl?: string;
};

export class MicrosoftAuthProvider implements OAuthHandlers {
  private readonly _strategy: MicrosoftStrategy;
  private readonly signInResolver?: SignInResolver<OAuthResult>;
  private readonly authHandler: AuthHandler<OAuthResult>;
  private readonly logger: Logger;
  private readonly resolverContext: AuthResolverContext;

  constructor(options: Options) {
    this.signInResolver = options.signInResolver;
    this.authHandler = options.authHandler;
    this.logger = options.logger;
    this.resolverContext = options.resolverContext;

    this._strategy = new MicrosoftStrategy(
      {
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        authorizationURL: options.authorizationUrl,
        tokenURL: options.tokenUrl,
        passReqToCallback: false,
      },
      (
        accessToken: any,
        refreshToken: any,
        params: any,
        fullProfile: passport.Profile,
        done: PassportDoneCallback<OAuthResult, PrivateInfo>,
      ) => {
        done(undefined, { fullProfile, accessToken, params }, { refreshToken });
      },
    );
  }

  async start(req: OAuthStartRequest): Promise<RedirectInfo> {
    return await executeRedirectStrategy(req, this._strategy, {
      scope: req.scope,
      state: encodeState(req.state),
    });
  }

  async handler(req: express.Request) {
    const { result, privateInfo } = await executeFrameHandlerStrategy<
      OAuthResult,
      PrivateInfo
    >(req, this._strategy);

    return {
      response: await this.handleResult(result),
      refreshToken: privateInfo.refreshToken,
    };
  }

  async refresh(req: OAuthRefreshRequest) {
    const { accessToken, refreshToken, params } =
      await executeRefreshTokenStrategy(
        this._strategy,
        req.refreshToken,
        req.scope,
      );

    const fullProfile = await executeFetchUserProfileStrategy(
      this._strategy,
      accessToken,
    );

    return {
      response: await this.handleResult({
        fullProfile,
        params,
        accessToken,
      }),
      refreshToken,
    };
  }

  private async handleResult(result: OAuthResult) {
    const photo = await this.getUserPhoto(result.accessToken);
    result.fullProfile.photos = photo ? [{ value: photo }] : undefined;

    const { profile } = await this.authHandler(result, this.resolverContext);

    const response: OAuthResponse = {
      providerInfo: {
        idToken: result.params.id_token,
        accessToken: result.accessToken,
        scope: result.params.scope,
        expiresInSeconds: result.params.expires_in,
      },
      profile,
    };

    if (this.signInResolver) {
      response.backstageIdentity = await this.signInResolver(
        {
          result,
          profile,
        },
        this.resolverContext,
      );
    }

    return response;
  }

  private async getUserPhoto(accessToken: string): Promise<string | undefined> {
    try {
      const res = await fetch(
        'https://graph.microsoft.com/v1.0/me/photos/48x48/$value',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      const data = await res.buffer();

      return `data:image/jpeg;base64,${data.toString('base64')}`;
    } catch (error) {
      this.logger.warn(
        `Could not retrieve user profile photo from Microsoft Graph API: ${error}`,
      );
      return undefined;
    }
  }
}

/**
 * Auth provider integration for Microsoft auth
 *
 * @public
 */
export const microsoft = createAuthProviderIntegration({
  create(options?: {
    /**
     * The profile transformation function used to verify and convert the auth response
     * into the profile that will be presented to the user.
     */
    authHandler?: AuthHandler<OAuthResult>;

    /**
     * Configure sign-in for this provider, without it the provider can not be used to sign users in.
     */
    signIn?: {
      /**
       * Maps an auth result to a Backstage identity for the user.
       */
      resolver: SignInResolver<OAuthResult>;
    };
  }) {
    return ({ providerId, globalConfig, config, logger, resolverContext }) =>
      OAuthEnvironmentHandler.mapConfig(config, envConfig => {
        const clientId = envConfig.getString('clientId');
        const clientSecret = envConfig.getString('clientSecret');
        const tenantId = envConfig.getString('tenantId');

        const customCallbackUrl = envConfig.getOptionalString('callbackUrl');
        const callbackUrl =
          customCallbackUrl ||
          `${globalConfig.baseUrl}/${providerId}/handler/frame`;
        const authorizationUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/authorize`;
        const tokenUrl = `https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`;

        const authHandler: AuthHandler<OAuthResult> = options?.authHandler
          ? options.authHandler
          : async ({ fullProfile, params }) => ({
              profile: makeProfileInfo(fullProfile, params.id_token),
            });

        const provider = new MicrosoftAuthProvider({
          clientId,
          clientSecret,
          callbackUrl,
          authorizationUrl,
          tokenUrl,
          authHandler,
          signInResolver: options?.signIn?.resolver,
          logger,
          resolverContext,
        });

        return OAuthAdapter.fromConfig(globalConfig, provider, {
          providerId,
          callbackUrl,
        });
      });
  },
  resolvers: {
    /**
     * Looks up the user by matching their email local part to the entity name.
     */
    emailLocalPartMatchingUserEntityName: () => commonByEmailLocalPartResolver,
    /**
     * Looks up the user by matching their email to the entity email.
     */
    emailMatchingUserEntityProfileEmail: () => commonByEmailResolver,
    /**
     * Looks up the user by matching their email to the `microsoft.com/email` annotation.
     */
    emailMatchingUserEntityAnnotation(): SignInResolver<OAuthResult> {
      return async (info, ctx) => {
        const { profile } = info;

        if (!profile.email) {
          throw new Error('Microsoft profile contained no email');
        }

        return ctx.signInWithCatalogUser({
          annotations: {
            'microsoft.com/email': profile.email,
          },
        });
      };
    },
  },
});
