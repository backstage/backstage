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
  AuthProviderRouteHandlers,
  OAuthProviderHandlers,
  WebMessageResponse,
  BackstageIdentity,
} from '../providers/types';
import { InputError } from '@backstage/backend-common';
import { TokenIssuer } from '../identity';

export const THOUSAND_DAYS_MS = 1000 * 24 * 60 * 60 * 1000;
export const TEN_MINUTES_MS = 600 * 1000;

export type Options = {
  providerId: string;
  secure: boolean;
  disableRefresh?: boolean;
  persistScopes?: boolean;
  baseUrl: string;
  appOrigin: string;
  tokenIssuer: TokenIssuer;
};

/* Return the value of `env` key, if it is exists, encoded within
     the `state` parameter in the request
  */
const getEnv = (stateParams: Array<string>): string => {
  const envParams = stateParams.filter(param => param.split('=')[0] === 'env');

  if (envParams.length > 0) {
    return envParams[0].split('=')[1];
  }
  return '';
};

const readState = (stateString: string): Array<string> => {
  return decodeURIComponent(stateString).split('&');
};
export const verifyNonce = (req: express.Request, providerId: string) => {
  const cookieNonce = req.cookies[`${providerId}-nonce`];
  const stateNonce = req.query.state;

  if (!cookieNonce) {
    throw new Error('Auth response is missing cookie nonce');
  }
  if (!stateNonce) {
    throw new Error('Auth response is missing state nonce');
  }
  if (cookieNonce !== stateNonce) {
    throw new Error('Invalid nonce');
  }
};

export const postMessageResponse = (
  res: express.Response,
  appOrigin: string,
  response: WebMessageResponse,
) => {
  const jsonData = JSON.stringify(response);
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

  async start(req: express.Request, res: express.Response): Promise<void> {
    // retrieve scopes from request
    const scope = req.query.scope?.toString() ?? '';
    const env = req.query.env?.toString() ?? '';

    if (this.options.persistScopes) {
      this.setScopesCookie(res, scope);
    }

    const nonce = crypto.randomBytes(16).toString('base64');
    // set a nonce cookie before redirecting to oauth provider
    this.setNonceCookie(res, nonce);

    // const stateObject: {nonce: string,
    //                    env: string}

    const stateObject = { nonce: nonce, env: env };

    const state = Object.keys(stateObject)
      .map(
        key =>
          `${encodeURIComponent(key)}=${encodeURIComponent(stateObject[key])}`,
      )
      .join('&');

    const queryParameters = {
      scope,
      state: state,
    };

    const { url, status } = await this.providerHandlers.start(
      req,
      queryParameters,
    );

    res.statusCode = status || 302;
    res.setHeader('Location', url);
    res.setHeader('Content-Length', '0');
    res.end();
  }

  async frameHandler(
    req: express.Request,
    res: express.Response,
  ): Promise<void> {
    try {
      // verify nonce cookie and state cookie on callback
      verifyNonce(req, this.options.providerId);

      const { response, refreshToken } = await this.providerHandlers.handler(
        req,
      );

      if (this.options.persistScopes) {
        const grantedScopes = this.getScopesFromCookie(
          req,
          this.options.providerId,
        );
        response.providerInfo.scope = grantedScopes;
      }

      if (!this.options.disableRefresh) {
        if (!refreshToken) {
          throw new InputError('Missing refresh token');
        }

        // set new refresh token
        this.setRefreshTokenCookie(res, refreshToken);
      }

      await this.populateIdentity(response.backstageIdentity);

      // post message back to popup if successful
      return postMessageResponse(res, this.options.appOrigin, {
        type: 'authorization_response',
        response,
      });
    } catch (error) {
      // post error message back to popup if failure
      return postMessageResponse(res, this.options.appOrigin, {
        type: 'authorization_response',
        error: {
          name: error.name,
          message: error.message,
        },
      });
    }
  }

  async logout(req: express.Request, res: express.Response): Promise<void> {
    if (!ensuresXRequestedWith(req)) {
      res.status(401).send('Invalid X-Requested-With header');
      return;
    }

    if (!this.options.disableRefresh) {
      // remove refresh token cookie before logout
      this.removeRefreshTokenCookie(res);
    }
    res.send('logout!');
  }

  async refresh(req: express.Request, res: express.Response): Promise<void> {
    if (!ensuresXRequestedWith(req)) {
      res.status(401).send('Invalid X-Requested-With header');
      return;
    }

    if (!this.providerHandlers.refresh || this.options.disableRefresh) {
      res.send(
        `Refresh token not supported for provider: ${this.options.providerId}`,
      );
      return;
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
      const response = await this.providerHandlers.refresh(refreshToken, scope);

      await this.populateIdentity(response.backstageIdentity);

      res.send(response);
    } catch (error) {
      res.status(401).send(`${error.message}`);
    }
  }

  identifyEnv(req: express.Request): string {
    const reqEnv = req.query.env?.toString();
    if (reqEnv) {
      return reqEnv;
    }
    const stateParam = req.query.state?.toString();
    if (!stateParam) {
      return '';
    }
    const env = getEnv(readState(stateParam));
    return env;
  }

  /**
   * If the response from the OAuth provider includes a Backstage identity, we
   * make sure it's populated with all the information we can derive from the user ID.
   */
  private async populateIdentity(identity?: BackstageIdentity) {
    if (!identity) {
      return;
    }

    if (!identity.idToken) {
      identity.idToken = await this.options.tokenIssuer.issueToken({
        claims: { sub: identity.id },
      });
    }
  }

  private setNonceCookie = (res: express.Response, nonce: string) => {
    res.cookie(`${this.options.providerId}-nonce`, nonce, {
      maxAge: TEN_MINUTES_MS,
      secure: this.options.secure,
      sameSite: 'lax',
      domain: this.domain,
      path: `${this.basePath}/${this.options.providerId}/handler`,
      httpOnly: true,
    });
  };

  private setScopesCookie = (res: express.Response, scope: string) => {
    res.cookie(`${this.options.providerId}-scope`, scope, {
      maxAge: TEN_MINUTES_MS,
      secure: this.options.secure,
      sameSite: 'lax',
      domain: this.domain,
      path: `${this.basePath}/${this.options.providerId}/handler`,
      httpOnly: true,
    });
  };

  private getScopesFromCookie = (req: express.Request, providerId: string) => {
    return req.cookies[`${providerId}-scope`];
  };

  private setRefreshTokenCookie = (
    res: express.Response,
    refreshToken: string,
  ) => {
    res.cookie(`${this.options.providerId}-refresh-token`, refreshToken, {
      maxAge: THOUSAND_DAYS_MS,
      secure: this.options.secure,
      sameSite: 'lax',
      domain: this.domain,
      path: `${this.basePath}/${this.options.providerId}`,
      httpOnly: true,
    });
  };

  private removeRefreshTokenCookie = (res: express.Response) => {
    res.cookie(`${this.options.providerId}-refresh-token`, '', {
      maxAge: 0,
      secure: false,
      sameSite: 'lax',
      domain: `${this.domain}`,
      path: `${this.basePath}/${this.options.providerId}`,
      httpOnly: true,
    });
  };
}
