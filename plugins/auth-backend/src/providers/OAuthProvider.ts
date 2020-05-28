import express, { CookieOptions } from 'express';
import crypto from 'crypto';
import { AuthProviderRouteHandlers, OAuthProviderHandlers } from './types';
import { InputError } from '@backstage/backend-common';
import { postMessageResponse, ensuresXRequestedWith } from './utils';

export const THOUSAND_DAYS_MS = 1000 * 24 * 60 * 60 * 1000;
export const TEN_MINUTES_MS = 600 * 1000;

export class OAuthProvider implements AuthProviderRouteHandlers {
  private readonly provider: string;
  private readonly providerHandlers: OAuthProviderHandlers;
  constructor(providerHandlers: OAuthProviderHandlers, provider: string) {
    this.provider = provider;
    this.providerHandlers = providerHandlers;
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

      // throw error if missing refresh token
      const { refreshToken } = info;
      if (!refreshToken) {
        throw new Error('Missing refresh token');
      }

      // set new refresh token
      setRefreshTokenCookie(res, this.provider, refreshToken);

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

    // remove refresh token cookie before logout
    removeRefreshTokenCookie(res, this.provider);
    return res.send('logout!');
  }

  async refresh(req: express.Request, res: express.Response): Promise<any> {
    if (!ensuresXRequestedWith(req)) {
      return res.status(401).send('Invalid X-Requested-With header');
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
      res.send(refreshInfo);
    } catch (error) {
      res.status(401).send(`${error.message}`);
    }
  }
}

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
