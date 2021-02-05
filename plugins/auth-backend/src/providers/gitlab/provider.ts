/*
 * Copyright 2020 Spotify AB
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
import { Strategy as GitlabStrategy } from 'passport-gitlab2';
import {
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
  makeProfileInfo,
  PassportDoneCallback,
} from '../../lib/passport';
import { RedirectInfo, AuthProviderFactory } from '../types';
import {
  OAuthAdapter,
  OAuthProviderOptions,
  OAuthHandlers,
  OAuthResponse,
  OAuthEnvironmentHandler,
  OAuthStartRequest,
  encodeState,
} from '../../lib/oauth';
import passport from 'passport';

export type GitlabAuthProviderOptions = OAuthProviderOptions & {
  baseUrl: string;
};

export class GitlabAuthProvider implements OAuthHandlers {
  private readonly _strategy: GitlabStrategy;

  static transformPassportProfile(rawProfile: any): passport.Profile {
    const profile: passport.Profile = {
      id: rawProfile.id,
      username: rawProfile.username,
      provider: rawProfile.provider,
      displayName: rawProfile.displayName,
    };

    if (rawProfile.emails && rawProfile.emails.length > 0) {
      profile.emails = rawProfile.emails;
    }
    if (rawProfile.avatarUrl) {
      profile.photos = [{ value: rawProfile.avatarUrl }];
    }

    return profile;
  }

  static transformOAuthResponse(
    accessToken: string,
    rawProfile: any,
    params: any = {},
  ): OAuthResponse {
    const passportProfile = GitlabAuthProvider.transformPassportProfile(
      rawProfile,
    );

    const profile = makeProfileInfo(passportProfile, params.id_token);
    const providerInfo = {
      accessToken,
      scope: params.scope,
      expiresInSeconds: params.expires_in,
      idToken: params.id_token,
    };

    // gitlab provides an id numeric value (123)
    // as a fallback
    let id = passportProfile!.id;

    if (profile.email) {
      id = profile.email.split('@')[0];
    }

    if (params.expires_in) {
      providerInfo.expiresInSeconds = params.expires_in;
    }
    if (params.id_token) {
      providerInfo.idToken = params.id_token;
    }
    return {
      providerInfo,
      profile,
      backstageIdentity: {
        id,
      },
    };
  }

  constructor(options: GitlabAuthProviderOptions) {
    this._strategy = new GitlabStrategy(
      {
        clientID: options.clientId,
        clientSecret: options.clientSecret,
        callbackURL: options.callbackUrl,
        baseURL: options.baseUrl,
      },
      (
        accessToken: any,
        _: any,
        params: any,
        rawProfile: any,
        done: PassportDoneCallback<OAuthResponse>,
      ) => {
        const oauthResponse = GitlabAuthProvider.transformOAuthResponse(
          accessToken,
          rawProfile,
          params,
        );
        done(undefined, oauthResponse);
      },
    );
  }

  async start(req: OAuthStartRequest): Promise<RedirectInfo> {
    return await executeRedirectStrategy(req, this._strategy, {
      scope: req.scope,
      state: encodeState(req.state),
    });
  }

  async handler(req: express.Request): Promise<{ response: OAuthResponse }> {
    return await executeFrameHandlerStrategy<OAuthResponse>(
      req,
      this._strategy,
    );
  }
}

export const createGitlabProvider: AuthProviderFactory = ({
  providerId,
  globalConfig,
  config,
  tokenIssuer,
}) =>
  OAuthEnvironmentHandler.mapConfig(config, envConfig => {
    const clientId = envConfig.getString('clientId');
    const clientSecret = envConfig.getString('clientSecret');
    const audience = envConfig.getString('audience');
    const baseUrl = audience || 'https://gitlab.com';
    const callbackUrl = `${globalConfig.baseUrl}/${providerId}/handler/frame`;

    const provider = new GitlabAuthProvider({
      clientId,
      clientSecret,
      callbackUrl,
      baseUrl,
    });

    return OAuthAdapter.fromConfig(globalConfig, provider, {
      disableRefresh: true,
      providerId,
      tokenIssuer,
    });
  });
