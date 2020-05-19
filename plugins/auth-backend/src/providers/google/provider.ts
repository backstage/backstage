import passport from 'passport';
import express from 'express';
import Router from 'express-promise-router';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { AuthProviderHandlers, AuthResponse } from './../types';

export const provider = {
  makeStrategy(options: any): passport.Strategy {
    return new GoogleStrategy(
      { ...options, passReqToCallback: true },
      function (
        _req: any,
        accessToken: any,
        refreshToken: any,
        profile: any,
        cb: any,
      ) {
        cb(undefined, { profile, accessToken, refreshToken });
      },
    );
  },
  makeRouter(): express.Router {
    return defaultRouter(GoogleAuthProviderHandler);
  },
};

const defaultRouter = (handlers: AuthProviderHandlers) => {
  const router = Router();
  router.get('/start', handlers.start);
  router.get('/handler/frame', handlers.handle);
  router.get('/logout', handlers.logout);
  if (handlers.refresh) {
    router.get('/refreshToken', handlers.refresh);
  }
  return router;
};

// Make this a class
// add a getStrategy method
// pass the config as a new constructor

// class GoogleAuthProvider implements AuthProviderHandlers {
//   config: any;
//   constructor(config: any) {
//     this.config = config;
//   }

// }

export const GoogleAuthProviderHandler: AuthProviderHandlers = {
  start(req, res, next) {
    const scopes = req.query.scopes?.toString().split(',');
    return passport.authenticate('google', {
      scope: scopes,
      accessType: 'offline',
      prompt: 'consent',
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
