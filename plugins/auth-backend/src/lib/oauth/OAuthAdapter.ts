/*
 * Copyright 2020 The Backstage Authors
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
import { URL } from 'url';
import {
  BackstageIdentityResponse,
  BackstageSignInResult,
} from '@backstage/plugin-auth-node';
import {
  AuthProviderRouteHandlers,
  AuthProviderConfig,
} from '../../providers/types';
import {
  AuthenticationError,
  InputError,
  isError,
  NotAllowedError,
} from '@backstage/errors';
import { defaultCookieConfigurer, readState, verifyNonce } from './helpers';
import { postMessageResponse, ensuresXRequestedWith } from '../flow';
import {
  OAuthHandlers,
  OAuthStartRequest,
  OAuthRefreshRequest,
  OAuthState,
} from './types';
import { prepareBackstageIdentityResponse } from '../../providers/prepareBackstageIdentityResponse';

export const THOUSAND_DAYS_MS = 1000 * 24 * 60 * 60 * 1000;
export const TEN_MINUTES_MS = 600 * 1000;

export type Options = {
  providerId: string;
  secure: boolean;
  persistScopes?: boolean;
  cookieDomain: string;
  cookiePath: string;
  appOrigin: string;
  isOriginAllowed: (origin: string) => boolean;
  callbackUrl: string;
};
export class OAuthAdapter implements AuthProviderRouteHandlers {
  static fromConfig(
    config: AuthProviderConfig,
    handlers: OAuthHandlers,
    options: Pick<Options, 'providerId' | 'persistScopes' | 'callbackUrl'>,
  ): OAuthAdapter {
    const { origin: appOrigin } = new URL(config.appUrl);

    const cookieConfigurer = config.cookieConfigurer ?? defaultCookieConfigurer;
    const cookieConfig = cookieConfigurer({
      providerId: options.providerId,
      baseUrl: config.baseUrl,
      callbackUrl: options.callbackUrl,
    });

    return new OAuthAdapter(handlers, {
      ...options,
      appOrigin,
      cookieDomain: cookieConfig.domain,
      cookiePath: cookieConfig.path,
      secure: cookieConfig.secure,
      isOriginAllowed: config.isOriginAllowed,
    });
  }

  private readonly baseCookieOptions: CookieOptions;

  constructor(
    private readonly handlers: OAuthHandlers,
    private readonly options: Options,
  ) {
    this.baseCookieOptions = {
      httpOnly: true,
      sameSite: 'lax',
      secure: this.options.secure,
      path: this.options.cookiePath,
      domain: this.options.cookieDomain,
    };
  }

  async start(req: express.Request, res: express.Response): Promise<void> {
    // retrieve scopes from request
    const scope = req.query.scope?.toString() ?? '';
    const env = req.query.env?.toString();
    const origin = req.query.origin?.toString();

    if (!env) {
      throw new InputError('No env provided in request query parameters');
    }

    const nonce = crypto.randomBytes(16).toString('base64');
    // set a nonce cookie before redirecting to oauth provider
    this.setNonceCookie(res, nonce);

    const state: OAuthState = { nonce, env, origin };

    // If scopes are persisted then we pass them through the state so that we
    // can set the cookie on successful auth
    if (this.options.persistScopes) {
      state.scope = scope;
    }
    const forwardReq = Object.assign(req, { scope, state });

    const { url, status } = await this.handlers.start(
      forwardReq as OAuthStartRequest,
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
    let appOrigin = this.options.appOrigin;

    try {
      const state: OAuthState = readState(req.query.state?.toString() ?? '');

      if (state.origin) {
        try {
          appOrigin = new URL(state.origin).origin;
        } catch {
          throw new NotAllowedError('App origin is invalid, failed to parse');
        }
        if (!this.options.isOriginAllowed(appOrigin)) {
          throw new NotAllowedError(`Origin '${appOrigin}' is not allowed`);
        }
      }

      // verify nonce cookie and state cookie on callback
      verifyNonce(req, this.options.providerId);

      const { response, refreshToken } = await this.handlers.handler(req);

      // Store the scope that we have been granted for this session. This is useful if
      // the provider does not return granted scopes on refresh or if they are normalized.
      if (this.options.persistScopes && state.scope) {
        this.setGrantedScopeCookie(res, state.scope);
        response.providerInfo.scope = state.scope;
      }

      if (refreshToken) {
        // set new refresh token
        this.setRefreshTokenCookie(res, refreshToken);
      }

      const identity = await this.populateIdentity(response.backstageIdentity);

      // post message back to popup if successful
      return postMessageResponse(res, appOrigin, {
        type: 'authorization_response',
        response: { ...response, backstageIdentity: identity },
      });
    } catch (error) {
      const { name, message } = isError(error)
        ? error
        : new Error('Encountered invalid error'); // Being a bit safe and not forwarding the bad value
      // post error message back to popup if failure
      return postMessageResponse(res, appOrigin, {
        type: 'authorization_response',
        error: { name, message },
      });
    }
  }

  async logout(req: express.Request, res: express.Response): Promise<void> {
    if (!ensuresXRequestedWith(req)) {
      throw new AuthenticationError('Invalid X-Requested-With header');
    }

    // remove refresh token cookie if it is set
    this.removeRefreshTokenCookie(res);

    res.status(200).end();
  }

  async refresh(req: express.Request, res: express.Response): Promise<void> {
    if (!ensuresXRequestedWith(req)) {
      throw new AuthenticationError('Invalid X-Requested-With header');
    }

    if (!this.handlers.refresh) {
      throw new InputError(
        `Refresh token is not supported for provider ${this.options.providerId}`,
      );
    }

    try {
      const refreshToken =
        req.cookies[`${this.options.providerId}-refresh-token`];

      // throw error if refresh token is missing in the request
      if (!refreshToken) {
        throw new InputError('Missing session cookie');
      }

      let scope = req.query.scope?.toString() ?? '';
      if (this.options.persistScopes) {
        scope = this.getGrantedScopeFromCookie(req);
      }
      const forwardReq = Object.assign(req, { scope, refreshToken });

      // get new access_token
      const { response, refreshToken: newRefreshToken } =
        await this.handlers.refresh(forwardReq as OAuthRefreshRequest);

      const backstageIdentity = await this.populateIdentity(
        response.backstageIdentity,
      );

      if (newRefreshToken && newRefreshToken !== refreshToken) {
        this.setRefreshTokenCookie(res, newRefreshToken);
      }

      res.status(200).json({ ...response, backstageIdentity });
    } catch (error) {
      throw new AuthenticationError('Refresh failed', error);
    }
  }

  /**
   * If the response from the OAuth provider includes a Backstage identity, we
   * make sure it's populated with all the information we can derive from the user ID.
   */
  private async populateIdentity(
    identity?: BackstageSignInResult,
  ): Promise<BackstageIdentityResponse | undefined> {
    if (!identity) {
      return undefined;
    }
    if (!identity.token) {
      throw new InputError(`Identity response must return a token`);
    }

    return prepareBackstageIdentityResponse(identity);
  }

  private setNonceCookie = (res: express.Response, nonce: string) => {
    res.cookie(`${this.options.providerId}-nonce`, nonce, {
      maxAge: TEN_MINUTES_MS,
      ...this.baseCookieOptions,
      path: `${this.options.cookiePath}/handler`,
    });
  };

  private setGrantedScopeCookie = (res: express.Response, scope: string) => {
    res.cookie(`${this.options.providerId}-granted-scope`, scope, {
      maxAge: THOUSAND_DAYS_MS,
      ...this.baseCookieOptions,
    });
  };

  private getGrantedScopeFromCookie = (req: express.Request) => {
    return req.cookies[`${this.options.providerId}-granted-scope`];
  };

  private setRefreshTokenCookie = (
    res: express.Response,
    refreshToken: string,
  ) => {
    res.cookie(`${this.options.providerId}-refresh-token`, refreshToken, {
      maxAge: THOUSAND_DAYS_MS,
      ...this.baseCookieOptions,
    });
  };

  private removeRefreshTokenCookie = (res: express.Response) => {
    res.cookie(`${this.options.providerId}-refresh-token`, '', {
      maxAge: 0,
      ...this.baseCookieOptions,
    });
  };
}
