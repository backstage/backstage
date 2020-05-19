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
import express from 'express';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {
  AuthProvider,
  AuthProviderRouteHandlers,
  AuthResponse,
} from './../types';

const postMessageResponse = (res: express.Response, data: AuthResponse) => {
  const jsonData = JSON.stringify(data);
  const base64Data = Buffer.from(jsonData, 'utf8').toString('base64');

  res.setHeader('X-Frame-Options', 'sameorigin');
  res.end(`
<html>
<body>
  <script>
    (window.opener || window.parent).postMessage(JSON.parse(atob('${base64Data}')), location.origin)
  </script>
</body>
</html>
  `);
};

export class GoogleAuthProvider
  implements AuthProvider, AuthProviderRouteHandlers {
  providerConfig: any;
  constructor(providerConfig: any) {
    this.providerConfig = providerConfig;
  }

  start(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const scopes = req.query.scopes?.toString().split(',');
    return passport.authenticate('google', {
      scope: scopes,
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
      postMessageResponse(res, {
        type: 'auth-result',
        payload: user,
      });
    })(req, res, next);
  }

  logout(_req: express.Request, res: express.Response) {
    return res.send('logout!');
  }

  strategy(): passport.Strategy {
    return new GoogleStrategy(
      { ...this.providerConfig.options, passReqToCallback: true },
      (
        _req: any,
        accessToken: any,
        refreshToken: any,
        profile: any,
        cb: any,
      ) => {
        cb(undefined, { profile, accessToken, refreshToken });
      },
    );
  }
}
