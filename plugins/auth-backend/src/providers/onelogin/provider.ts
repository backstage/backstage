//import { Strategy as OneLoginStrategy } from 'passport-openidconnect';
import { Strategy as OneLoginStrategy } from 'passport-onelogin';
import express from 'express';
import {
  OAuthAdapter,
  OAuthProviderOptions,
  OAuthHandlers,
  OAuthResponse,
  OAuthEnvironmentHandler,
  OAuthStartRequest,
  encodeState,
  OAuthRefreshRequest,
} from '../../lib/oauth';
import passport from 'passport';
import {
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  executeRefreshTokenStrategy,
  makeProfileInfo,
  executeFetchUserProfileStrategy,
  PassportDoneCallback,
} from '../../lib/passport';
import { RedirectInfo, AuthProviderFactory } from '../types';

type PrivateInfo = {
  refreshToken: string;
};

export type OneLoginProviderOptions = OAuthProviderOptions & {
  issuer: string;
};

export class OneLoginProvider implements OAuthHandlers {
  private readonly _strategy: any;

  constructor(options: OneLoginProviderOptions) {
    this._strategy = new OneLoginStrategy(
      {
        issuer: options.issuer,
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        passReqToCallback: false as true,
      },
      (
        accessToken: any,
        refreshToken: any,
        params: any,
        rawProfile: passport.Profile,
        done: PassportDoneCallback<OAuthResponse, PrivateInfo>,
      ) => {
        const profile = makeProfileInfo(rawProfile, params.id_token);

        done(
          undefined,
          {
            providerInfo: {
              idToken: params.id_token,
              accessToken,
              scope: params.scope,
              //scope: 'profile',
              expiresInSeconds: params.expires_in,
            },
            profile,
          },
          {
            refreshToken,
          },
        );
      },
    );
  }
  async start(req: OAuthStartRequest): Promise<RedirectInfo> {
    return await executeRedirectStrategy(req, this._strategy, {
      accessType: 'offline',
      prompt: 'consent',
      scope: 'openid',
      state: encodeState(req.state),
    });
  }

  async handler(
    req: express.Request,
  ): Promise<{ response: OAuthResponse; refreshToken: string }> {
    const { response, privateInfo } = await executeFrameHandlerStrategy<
      OAuthResponse,
      PrivateInfo
    >(req, this._strategy);

    return {
      response: await this.populateIdentity(response),
      refreshToken: privateInfo.refreshToken,
    };
  }

  async refresh(req: OAuthRefreshRequest): Promise<OAuthResponse> {
    const { accessToken, params } = await executeRefreshTokenStrategy(
      this._strategy,
      req.refreshToken,
      req.scope,
    );

    const profile = await executeFetchUserProfileStrategy(
      this._strategy,
      accessToken,
      params.id_token,
    );

    return this.populateIdentity({
      providerInfo: {
        accessToken,
        idToken: params.id_token,
        expiresInSeconds: params.expires_in,
        scope: params.scope,
      },
      profile,
    });
  }

  private async populateIdentity(
    response: OAuthResponse,
  ): Promise<OAuthResponse> {
    const { profile } = response;

    if (!profile.email) {
      throw new Error('OIDC profile contained no email');
    }

    const id = profile.email.split('@')[0];

    return { ...response, backstageIdentity: { id } };
  }
}

export const createOneLoginProvider: AuthProviderFactory = ({
  globalConfig,
  config,
  tokenIssuer,
}) =>
  OAuthEnvironmentHandler.mapConfig(config, envConfig => {
    const providerId = 'onelogin';
    const clientId = envConfig.getString('clientId');
    const clientSecret = envConfig.getString('clientSecret');
    const issuer = envConfig.getString('issuer');
    const callbackUrl = `${globalConfig.baseUrl}/${providerId}/handler/frame`;

    const provider = new OneLoginProvider({
      clientId,
      clientSecret,
      callbackUrl,
      issuer,
    });

    return OAuthAdapter.fromConfig(globalConfig, provider, {
      disableRefresh: false,
      providerId,
      tokenIssuer,
    });
  });
