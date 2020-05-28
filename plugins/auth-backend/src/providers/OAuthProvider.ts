import { AuthProviderRouteHandlers, OAuthProviderHandlers } from './types';
import express from 'express';
import { InputError } from '@backstage/backend-common';
import {
  setNonceCookie,
  verifyNonce,
  setRefreshTokenCookie,
  removeRefreshTokenCookie,
} from './OAuthHelper';
import { postMessageResponse, ensuresXRequestedWith } from './utils';

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
