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
import passport from 'passport';
import { RedirectInfo, RefreshTokenResponse } from './types';

export const executeRedirectStrategy = async (
  req: express.Request,
  providerStrategy: passport.Strategy,
  options: any,
): Promise<RedirectInfo> => {
  return new Promise(resolve => {
    const strategy = Object.create(providerStrategy);
    strategy.redirect = (url: string, status?: number) => {
      resolve({ url, status: status ?? undefined });
    };

    strategy.authenticate(req, { ...options });
  });
};

export const executeFrameHandlerStrategy = async (
  req: express.Request,
  providerStrategy: passport.Strategy,
) => {
  return new Promise<{ user: any; info: any }>((resolve, reject) => {
    const strategy = Object.create(providerStrategy);
    strategy.success = (user: any, info: any) => {
      resolve({ user, info });
    };
    strategy.fail = (
      info: { type: 'success' | 'error'; message?: string },
      // _status: number,
    ) => {
      reject(new Error(`Authentication rejected, ${info.message ?? ''}`));
    };
    strategy.error = (error: Error) => {
      reject(new Error(`Authentication failed, ${error}`));
    };
    strategy.redirect = () => {
      reject(new Error('Unexpected redirect'));
    };

    strategy.authenticate(req);
  });
};

export const executeRefreshTokenStrategy = async (
  providerstrategy: passport.Strategy,
  refreshToken: string,
  scope: string,
): Promise<RefreshTokenResponse> => {
  return new Promise((resolve, reject) => {
    const anyStrategy = providerstrategy as any;
    const OAuth2 = anyStrategy._oauth2.constructor;
    const oauth2 = new OAuth2(
      anyStrategy._oauth2._clientId,
      anyStrategy._oauth2._clientSecret,
      anyStrategy._oauth2._baseSite,
      anyStrategy._oauth2._authorizeUrl,
      anyStrategy._refreshURL || anyStrategy._oauth2._accessTokenUrl,
      anyStrategy._oauth2._customHeaders,
    );

    oauth2.getOAuthAccessToken(
      refreshToken,
      {
        scope,
        grant_type: 'refresh_token',
      },
      (
        err: Error | null,
        accessToken: string,
        _refreshToken: string,
        params: any,
      ) => {
        if (err) {
          reject(new Error(`Failed to refresh access token ${err}`));
        }
        if (!accessToken) {
          reject(
            new Error(
              `Failed to refresh access token, no access token received`,
            ),
          );
        }
        resolve({
          accessToken,
          params,
        });
      },
    );
  });
};
