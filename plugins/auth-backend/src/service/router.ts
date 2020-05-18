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
import Router from 'express-promise-router';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Logger } from 'winston';
import { providers } from './../providers/config';

export interface RouterOptions {
  logger: Logger;
}

type AuthProviderHandlers = {
  start(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<any>;
  handle(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): express.Response<any>;
  refresh?(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<any>;
  logout(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): express.Response<any>;
};

type AuthProvider = {
  [key: string]: {
    makeStrategy(options: any): passport.Strategy;
    makeRouter(handlers: AuthProviderHandlers): express.Router;
  };
};

type AuthInfo = {
  profile: passport.Profile;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
};

type AuthResponse = {
  type: string;
  payload: AuthInfo;
};

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

const GoogleAuthProviderHandler: AuthProviderHandlers = {
  start(req, res, next) {
    return passport.authenticate('google', {
      scope: ['profile', 'email'],
      accessType: 'offline',
      prompt: 'consent',
      state: '8745634875963',
    })(req, res, next);
  },
  handle(req, res, next) {
    return passport.authenticate('google', function (_, user) {
      postMessageResponse(res, {
        type: 'oauth-result',
        payload: user,
      });
    })(req, res, next);
  },
  logout(_req, res, _next) {
    return res.send('logout!');
  },
};

const providerFactories: AuthProvider = {
  google: {
    makeStrategy(options: any): passport.Strategy {
      return new GoogleStrategy(options, function (
        _req: any,
        accessToken: any,
        refreshToken: any,
        profile: any,
        cb: any,
      ) {
        cb(undefined, { profile, accessToken, refreshToken });
      });
    },
    makeRouter(handlers: AuthProviderHandlers): express.Router {
      const router = Router();
      router.get('/start', handlers.start);
      router.get('/handler/frame', handlers.handle);
      router.get('/logout', handlers.logout);
      if (handlers.refresh) {
        router.get('/refreshToken', handlers.refresh);
      }
      return router;
    },
  },
};

function makeProvider(config: any) {
  const provider = config.provider;
  const providerFactory = providerFactories[provider];
  const strategy: passport.Strategy = providerFactory.makeStrategy(
    config.options,
  );
  const providerRouter = providerFactory.makeRouter(GoogleAuthProviderHandler);
  return { provider, strategy, providerRouter };
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();

  for (const providerConfig of providers) {
    const { provider, strategy, providerRouter } = makeProvider(providerConfig);
    passport.use(strategy);

    router.use(`/${provider}`, providerRouter);
  }

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });

  router.use(passport.initialize());
  router.use(passport.session());

  router.get('/ping', async (_req, res) => {
    res.status(200).send('pong');
  });

  return router;
}
