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

import express, { CookieOptions } from 'express';
import crypto from 'crypto';
import { AuthProviderRouteHandlers, OAuthProviderHandlers } from './types';
import { InputError } from '@backstage/backend-common';
import { postMessageResponse, ensuresXRequestedWith } from './utils';

export const THOUSAND_DAYS_MS = 1000 * 24 * 60 * 60 * 1000;
export const TEN_MINUTES_MS = 600 * 1000;

export const verifyNonce = (req: express.Request, provider: string) => {
  const cookieNonce = req.cookies[`${provider}-nonce`];
  const stateNonce = req.query.state;

  if (!cookieNonce || !stateNonce) {
    throw new Error('Missing nonce');
  }

  if (cookieNonce !== stateNonce) {
    throw new Error('Invalid nonce');
  }
};

export const setNonceCookie = (res: express.Response, provider: string) => {
  const nonce = crypto.randomBytes(16).toString('base64');

  const options: CookieOptions = {
    maxAge: TEN_MINUTES_MS,
    secure: false,
    sameSite: 'none',
    domain: 'localhost',
    path: `/auth/${provider}/handler`,
    httpOnly: true,
  };

  res.cookie(`${provider}-nonce`, nonce, options);

  return nonce;
};

export const setRefreshTokenCookie = (
  res: express.Response,
  provider: string,
  refreshToken: string,
) => {
  const options: CookieOptions = {
    maxAge: THOUSAND_DAYS_MS,
    secure: false,
    sameSite: 'none',
    domain: 'localhost',
    path: `/auth/${provider}`,
    httpOnly: true,
  };

  res.cookie(`${provider}-refresh-token`, refreshToken, options);
};

export const removeRefreshTokenCookie = (
  res: express.Response,
  provider: string,
) => {
  const options: CookieOptions = {
    maxAge: 0,
    secure: false,
    sameSite: 'none',
    domain: 'localhost',
    path: `/auth/${provider}`,
    httpOnly: true,
  };

  res.cookie(`${provider}-refresh-token`, '', options);
};

export class OAuthProvider implements AuthProviderRouteHandlers {
  private readonly provider: string;
  private readonly providerHandlers: OAuthProviderHandlers;
  private readonly disableRefresh: boolean;
  constructor(
    providerHandlers: OAuthProviderHandlers,
    provider: string,
    disableRefresh?: boolean,
  ) {
    this.provider = provider;
    this.providerHandlers = providerHandlers;
    this.disableRefresh = disableRefresh ?? false;
  }

  async start(req: express.Request, res: express.Response): Promise<any> {
    // retrieve scopes from request
    const scope = req.query.scope?.toString() ?? '';

    if (!scope) {
      throw new InputError('missing scope parameter');
    }

    // set a nonce cookie before redirecting to oauth provider
    const nonce = setNonceCookie(res, this.provider);

    const options = {
      scope,
      accessType: 'offline',
      prompt: 'consent',
      state: nonce,
    };
    const { url, status } = await this.providerHandlers.start(req, options);

    res.statusCode = status || 302;
    res.setHeader('Location', url);
    res.setHeader('Content-Length', '0');
    res.end();
  }

  async frameHandler(
    req: express.Request,
    res: express.Response,
  ): Promise<any> {
    try {
      // verify nonce cookie and state cookie on callback
      verifyNonce(req, this.provider);

      const { user, info } = await this.providerHandlers.handler(req);

      if (!this.disableRefresh) {
        // throw error if missing refresh token
        const { refreshToken } = info;
        if (!refreshToken) {
          throw new Error('Missing refresh token');
        }

        // set new refresh token
        setRefreshTokenCookie(res, this.provider, refreshToken);
      }

      // post message back to popup if successful
      return postMessageResponse(res, {
        type: 'auth-result',
        payload: user,
      });
    } catch (error) {
      // post error message back to popup if failure
      return postMessageResponse(res, {
        type: 'auth-result',
        error: {
          name: error.name,
          message: error.message,
        },
      });
    }
  }

  async logout(req: express.Request, res: express.Response): Promise<any> {
    if (!ensuresXRequestedWith(req)) {
      return res.status(401).send('Invalid X-Requested-With header');
    }

    if (!this.disableRefresh) {
      // remove refresh token cookie before logout
      removeRefreshTokenCookie(res, this.provider);
    }
    return res.send('logout!');
  }

  async refresh(req: express.Request, res: express.Response): Promise<any> {
    if (!ensuresXRequestedWith(req)) {
      return res.status(401).send('Invalid X-Requested-With header');
    }

    if (!this.providerHandlers.refresh || this.disableRefresh) {
      return res.send(
        `Refresh token not supported for provider: ${this.provider}`,
      );
    }

    try {
      const refreshToken = req.cookies[`${this.provider}-refresh-token`];

      // throw error if refresh token is missing in the request
      if (!refreshToken) {
        throw new Error('Missing session cookie');
      }

      const scope = req.query.scope?.toString() ?? '';

      // get new access_token
      const refreshInfo = await this.providerHandlers.refresh(
        refreshToken,
        scope,
      );
      return res.send(refreshInfo);
    } catch (error) {
      return res.status(401).send(`${error.message}`);
    }
  }
}
