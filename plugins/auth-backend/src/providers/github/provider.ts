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
import { Strategy as GithubStrategy } from 'passport-github2';
import {
  executeFrameHandlerStrategy,
  executeRedirectStrategy,
} from '../../lib/PassportStrategyHelper';
import {
  OAuthProviderHandlers,
  AuthProviderConfig,
  RedirectInfo,
  AuthInfoBase,
  AuthInfoPrivate,
  EnvironmentProviderConfig,
  OAuthProviderOptions,
  OAuthProviderConfig,
} from '../types';
import { OAuthProvider } from '../../lib/OAuthProvider';
import {
  EnvironmentHandlers,
  EnvironmentHandler,
} from '../../lib/EnvironmentHandler';
import { Logger } from 'winston';
import { TokenIssuer } from '../../identity';

export class GithubAuthProvider implements OAuthProviderHandlers {
  private readonly _strategy: GithubStrategy;

  constructor(options: OAuthProviderOptions) {
    this._strategy = new GithubStrategy(
      { ...options },
      (accessToken: any, _: any, params: any, profile: any, done: any) => {
        done(undefined, {
          profile,
          accessToken,
          scope: params.scope,
          expiresInSeconds: params.expires_in,
        });
      },
    );
  }

  async start(req: express.Request, options: any): Promise<RedirectInfo> {
    return await executeRedirectStrategy(req, this._strategy, options);
  }

  async handler(
    req: express.Request,
  ): Promise<{ user: AuthInfoBase; info: AuthInfoPrivate }> {
    return await executeFrameHandlerStrategy(req, this._strategy);
  }
}

export function createGithubProvider(
  { baseUrl }: AuthProviderConfig,
  providerConfig: EnvironmentProviderConfig,
  logger: Logger,
  tokenIssuer: TokenIssuer,
) {
  const envProviders: EnvironmentHandlers = {};

  for (const [env, envConfig] of Object.entries(providerConfig)) {
    const config = (envConfig as unknown) as OAuthProviderConfig;
    const { secure, appOrigin } = config;
    const callbackURLParam = `?env=${env}`;
    const opts = {
      clientID: config.clientId,
      clientSecret: config.clientSecret,
      callbackURL: `${baseUrl}/github/handler/frame${callbackURLParam}`,
    };

    if (!opts.clientID || !opts.clientSecret) {
      if (process.env.NODE_ENV !== 'development') {
        throw new Error(
          'Failed to initialize Github auth provider, set AUTH_GITHUB_CLIENT_ID and AUTH_GITHUB_CLIENT_SECRET env vars',
        );
      }

      logger.warn(
        'Github auth provider disabled, set AUTH_GITHUB_CLIENT_ID and AUTH_GITHUB_CLIENT_SECRET env vars to enable',
      );
      continue;
    }

    envProviders[env] = new OAuthProvider(new GithubAuthProvider(opts), {
      disableRefresh: true,
      providerId: 'github',
      secure,
      baseUrl,
      appOrigin,
      tokenIssuer,
    });
  }
  return new EnvironmentHandler(envProviders);
}
