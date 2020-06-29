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
} from '../../lib/PassportStrategyHelper';
import {
  OAuthProviderHandlers,
  AuthProviderConfig,
  RedirectInfo,
  EnvironmentProviderConfig,
  OAuthProviderOptions,
  OAuthProviderConfig,
  OAuthResponse,
  PassportDoneCallback,
} from '../types';
import { OAuthProvider } from '../../lib/OAuthProvider';
import {
  EnvironmentHandlers,
  EnvironmentHandler,
} from '../../lib/EnvironmentHandler';
import { Logger } from 'winston';
import { TokenIssuer } from '../../identity';
import passport from 'passport';

export class GitlabAuthProvider implements OAuthProviderHandlers {
  private readonly _strategy: GitlabStrategy;
  private static _defaultExpiresInSeconds = 2 * 3600;

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
    return {
      providerInfo: {
        accessToken,
        scope: params.scope,
        expiresInSeconds:
          params.expires_in || GitlabAuthProvider._defaultExpiresInSeconds,
      },
      profile,
    };
  }

  constructor(options: OAuthProviderOptions) {
    this._strategy = new GitlabStrategy(
      { ...options },
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

  async start(
    req: express.Request,
    options: Record<string, string>,
  ): Promise<RedirectInfo> {
    return await executeRedirectStrategy(req, this._strategy, options);
  }

  async handler(req: express.Request): Promise<{ response: OAuthResponse }> {
    return await executeFrameHandlerStrategy<OAuthResponse>(
      req,
      this._strategy,
    );
  }
}

export function createGitlabProvider(
  { baseUrl }: AuthProviderConfig,
  providerConfig: EnvironmentProviderConfig,
  logger: Logger,
  tokenIssuer: TokenIssuer,
) {
  const envProviders: EnvironmentHandlers = {};

  for (const [env, envConfig] of Object.entries(providerConfig)) {
    const {
      secure,
      appOrigin,
      clientId,
      clientSecret,
      audience,
    } = (envConfig as unknown) as OAuthProviderConfig;
    const callbackURLParam = `?env=${env}`;

    const opts = {
      clientID: clientId,
      clientSecret: clientSecret,
      callbackURL: `${baseUrl}/gitlab/handler/frame${callbackURLParam}`,
      baseURL: audience,
    };

    if (!opts.clientID || !opts.clientSecret) {
      if (process.env.NODE_ENV !== 'development') {
        throw new Error(
          'Failed to initialize Gitlab auth provider, set AUTH_GITLAB_CLIENT_ID and AUTH_GITLAB_CLIENT_SECRET env vars',
        );
      }

      logger.warn(
        'Gitlab auth provider disabled, set AUTH_GITLAB_CLIENT_ID and AUTH_GITLAB_CLIENT_SECRET env vars to enable',
      );
      continue;
    }

    envProviders[env] = new OAuthProvider(new GitlabAuthProvider(opts), {
      disableRefresh: true,
      providerId: 'gitlab',
      secure,
      baseUrl,
      appOrigin,
      tokenIssuer,
    });
  }
  return new EnvironmentHandler(envProviders);
}
