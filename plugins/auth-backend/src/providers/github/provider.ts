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
  executeRefreshTokenStrategy,
} from '../PassportStrategyHelper';
import {
  OAuthProviderHandlers,
  AuthProviderConfig,
  RedirectInfo,
  AuthInfoBase,
  AuthInfoPrivate,
} from '../types';

export class GithubAuthProvider implements OAuthProviderHandlers {
  private readonly providerConfig: AuthProviderConfig;
  private readonly _strategy: GithubStrategy;

  constructor(providerConfig: AuthProviderConfig) {
    this.providerConfig = providerConfig;
    this._strategy = new GithubStrategy(
      { ...this.providerConfig.options },
      (
        accessToken: any,
        refreshToken: any,
        params: any,
        profile: any,
        done: any,
      ) => {
        done(
          undefined,
          {
            profile,
            accessToken,
            scope: 'user', // params.scope is an empty string here for some reason, so hardcoding for now
            expiresInSeconds: params.expires_in,
          },
          { refreshToken },
        );
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

  async refresh(refreshToken: string, scope: string): Promise<AuthInfoBase> {
    const { accessToken, params } = await executeRefreshTokenStrategy(
      this._strategy,
      refreshToken,
      scope,
    );

    return {
      accessToken,
      expiresInSeconds: params.expires_in,
      scope: params.scope,
    };
  }
}
