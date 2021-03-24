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
  OAuthResult,
} from '../../lib/oauth';

export type GitlabAuthProviderOptions = OAuthProviderOptions & {
  baseUrl: string;
};

export class GitlabAuthProvider implements OAuthHandlers {
  private readonly _strategy: GitlabStrategy;

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
        _refreshToken: any,
        params: any,
        fullProfile: any,
        done: PassportDoneCallback<OAuthResult>,
      ) => {
        done(undefined, { fullProfile, params, accessToken });
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
    const { result } = await executeFrameHandlerStrategy<OAuthResult>(
      req,
      this._strategy,
    );
    const { accessToken, params } = result;
    const fullProfile = result.fullProfile as OAuthResult['fullProfile'] & {
      avatarUrl?: string;
    };

    const profile = makeProfileInfo(
      {
        ...fullProfile,
        photos: [
          ...(fullProfile.photos ?? []),
          ...(fullProfile.avatarUrl ? [{ value: fullProfile.avatarUrl }] : []),
        ],
      },
      params.id_token,
    );

    // gitlab provides an id numeric value (123)
    // as a fallback
    let id = fullProfile.id;
    if (profile.email) {
      id = profile.email.split('@')[0];
    }

    return {
      response: {
        profile,
        providerInfo: {
          accessToken,
          scope: params.scope,
          expiresInSeconds: params.expires_in,
          idToken: params.id_token,
        },
        backstageIdentity: {
          id,
        },
      },
    };
  }
}

export type GitlabProviderOptions = {};

export const createGitlabProvider = (
  _options?: GitlabProviderOptions,
): AuthProviderFactory => {
  return ({ providerId, globalConfig, config, tokenIssuer }) =>
    OAuthEnvironmentHandler.mapConfig(config, envConfig => {
      const clientId = envConfig.getString('clientId');
      const clientSecret = envConfig.getString('clientSecret');
      const audience = envConfig.getOptionalString('audience');
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
};
