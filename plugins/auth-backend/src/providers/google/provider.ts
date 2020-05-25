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

import passport from 'passport';
import express, { CookieOptions } from 'express';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import refresh from 'passport-oauth2-refresh';
import {
  AuthProvider,
  AuthProviderRouteHandlers,
  AuthProviderConfig,
} from './../types';
import { postMessageResponse } from './../utils';
import { InputError } from '@backstage/backend-common';

const THOUSAND_DAYS_MS = 1000 * 24 * 60 * 60 * 1000;
export class GoogleAuthProvider
  implements AuthProvider, AuthProviderRouteHandlers {
  private readonly providerConfig: AuthProviderConfig;
  constructor(providerConfig: AuthProviderConfig) {
    this.providerConfig = providerConfig;
  }

  start(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const scope = req.query.scope?.toString() ?? '';
    if (!scope) {
      throw new InputError('missing scope parameter');
    }
    return passport.authenticate('google', {
      scope,
      accessType: 'offline',
      prompt: 'consent',
    })(req, res, next);
  }

  frameHandler(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    return passport.authenticate('google', (_, user) => {
      const { refreshToken } = user;
      delete user.refreshToken;

      const options: CookieOptions = {
        maxAge: THOUSAND_DAYS_MS,
        secure: false,
        sameSite: 'none',
        domain: 'localhost',
        path: '/auth/google',
        httpOnly: true,
      };

      res.cookie('grtoken', refreshToken, options);
      postMessageResponse(res, {
        type: 'auth-result',
        payload: user,
      });
    })(req, res, next);
  }

  async logout(_req: express.Request, res: express.Response) {
    return res.send('logout!');
  }

  async refresh(req: express.Request, res: express.Response) {
    const refreshToken = req.cookies['grtoken'];
    const scope = req.query.scope?.toString() ?? '';
    const params = scope ? { scope } : {};

    if (!refreshToken) {
      return res.status(401).send('Missing session cookie');
    }

    refresh.requestNewAccessToken(
      'google',
      refreshToken,
      params,
      (err, accessToken, _, params) => {
        if (err || !accessToken) {
          return res.status(401).send('Failed to refresh access token');
        }
        return res.send({
          accessToken,
          idToken: params.id_token,
          expiresInSeconds: params.expires_in,
          scope: params.scope,
        });
      },
    );
  }

  strategy(): passport.Strategy {
    // TODO: throw error if env variables not set?
    return new GoogleStrategy(
      { ...this.providerConfig.options },
      (
        accessToken: any,
        refreshToken: any,
        params: any,
        profile: any,
        done: any,
      ) => {
        done(undefined, {
          profile,
          idToken: params.id_token,
          accessToken,
          refreshToken,
          scope: params.scope,
          expiresInSeconds: params.expires_in,
        });
      },
    );
  }
}
