import passport from 'passport';
import express from 'express';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import {
  AuthProvider,
  AuthProviderRouteHandlers,
  AuthResponse,
} from './../types';

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
    return passport.authenticate('google', function (_, user) {
      postMessageResponse(res, {
        type: 'auth-result',
        payload: user,
      });
    })(req, res, next);
  }

  logout(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    return res.send('logout!');
  }

  strategy(): passport.Strategy {
    return new GoogleStrategy(
      { ...this.providerConfig.options, passReqToCallback: true },
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
  }
}

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
