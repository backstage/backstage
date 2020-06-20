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
import crypto from 'crypto';
import { URL } from 'url';
import {
  AuthResponse,
  AuthProviderRouteHandlers,
  OAuthProviderHandlers,
} from '../providers/types';
import { InputError } from '@backstage/backend-common';
import { TokenIssuer } from '../identity';

export const THOUSAND_DAYS_MS = 1000 * 24 * 60 * 60 * 1000;
export const TEN_MINUTES_MS = 600 * 1000;

export type Options = {
  providerId: string;
  secure: boolean;
  disableRefresh?: boolean;
  baseUrl: string;
  appOrigin: string;
  tokenIssuer: TokenIssuer;
};

export const verifyNonce = (req: express.Request, providerId: string) => {
  const cookieNonce = req.cookies[`${providerId}-nonce`];
  const stateNonce = req.query.state;

  if (!cookieNonce || !stateNonce) {
    throw new Error('Missing nonce');
  }

  if (cookieNonce !== stateNonce) {
    throw new Error('Invalid nonce');
  }
};

export const postMessageResponse = (
  res: express.Response,
  appOrigin: string,
  data: AuthResponse,
) => {
  const jsonData = JSON.stringify(data);
  const base64Data = Buffer.from(jsonData, 'utf8').toString('base64');

  res.setHeader('Content-Type', 'text/html');
  res.setHeader('X-Frame-Options', 'sameorigin');

  // TODO: Make target app origin configurable globally
  res.end(`
<html>
<body>
  <script>
    (window.opener || window.parent).postMessage(JSON.parse(atob('${base64Data}')), '${appOrigin}')
    window.close()
  </script>
</body>
</html>
  `);
};

export const ensuresXRequestedWith = (req: express.Request) => {
  const requiredHeader = req.header('X-Requested-With');

  if (!requiredHeader || requiredHeader !== 'XMLHttpRequest') {
    return false;
  }
  return true;
};

export class OAuthProvider implements AuthProviderRouteHandlers {
  private readonly domain: string;
  private readonly basePath: string;

  constructor(
    private readonly providerHandlers: OAuthProviderHandlers,
    private readonly options: Options,
  ) {
    const url = new URL(options.baseUrl);
    this.domain = url.hostname;
    this.basePath = url.pathname;
  }

  async start(req: express.Request, res: express.Response): Promise<any> {
    // retrieve scopes from request
    const scope = req.query.scope?.toString() ?? '';

    if (!scope) {
      throw new InputError('missing scope parameter');
    }

    const nonce = crypto.randomBytes(16).toString('base64');
    // set a nonce cookie before redirecting to oauth provider
    this.setNonceCookie(res, nonce);

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
      verifyNonce(req, this.options.providerId);

      const { user, info } = await this.providerHandlers.handler(req);

      if (!this.options.disableRefresh) {
        // throw error if missing refresh token
        const { refreshToken } = info;
        if (!refreshToken) {
          throw new Error('Missing refresh token');
        }

        // set new refresh token
        this.setRefreshTokenCookie(res, refreshToken);
      }

      user.userIdToken = await this.options.tokenIssuer.issueToken({
        sub: user.profile.email,
      });

      // post message back to popup if successful
      return postMessageResponse(res, this.options.appOrigin, {
        type: 'auth-result',
        payload: user,
      });
    } catch (error) {
      // post error message back to popup if failure
      return postMessageResponse(res, this.options.appOrigin, {
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

    if (!this.options.disableRefresh) {
      // remove refresh token cookie before logout
      this.removeRefreshTokenCookie(res);
    }
    return res.send('logout!');
  }

  async refresh(req: express.Request, res: express.Response): Promise<any> {
    if (!ensuresXRequestedWith(req)) {
      return res.status(401).send('Invalid X-Requested-With header');
    }

    if (!this.providerHandlers.refresh || this.options.disableRefresh) {
      return res.send(
        `Refresh token not supported for provider: ${this.options.providerId}`,
      );
    }

    try {
      const refreshToken =
        req.cookies[`${this.options.providerId}-refresh-token`];

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

      refreshInfo.userIdToken = await this.options.tokenIssuer.issueToken({
        sub: refreshInfo.profile?.email,
      });

      return res.send(refreshInfo);
    } catch (error) {
      return res.status(401).send(`${error.message}`);
    }
  }

  private setNonceCookie = (res: express.Response, nonce: string) => {
    res.cookie(`${this.options.providerId}-nonce`, nonce, {
      maxAge: TEN_MINUTES_MS,
      secure: this.options.secure,
      sameSite: 'none',
      domain: this.domain,
      path: `${this.basePath}/${this.options.providerId}/handler`,
      httpOnly: true,
    });
  };

  private setRefreshTokenCookie = (
    res: express.Response,
    refreshToken: string,
  ) => {
    res.cookie(`${this.options.providerId}-refresh-token`, refreshToken, {
      maxAge: THOUSAND_DAYS_MS,
      secure: this.options.secure,
      sameSite: 'none',
      domain: this.domain,
      path: `${this.basePath}/${this.options.providerId}`,
      httpOnly: true,
    });
  };

  private removeRefreshTokenCookie = (res: express.Response) => {
    res.cookie(`${this.options.providerId}-refresh-token`, '', {
      maxAge: 0,
      secure: false,
      sameSite: 'none',
      domain: `${this.domain}`,
      path: `${this.basePath}/${this.options.providerId}`,
      httpOnly: true,
    });
  };
}
