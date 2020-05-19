import express from 'express';
import passport from 'passport';

export interface AuthProviderRouteHandlers {
  start(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<any>;
  frameHandler(
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
}
export interface AuthProvider {
  strategy(): passport.Strategy;
  router?(): express.Router;
}

export type AuthProviderFactories = {
  [key: string]: {
    new (providerConfig: any): AuthProvider & AuthProviderRouteHandlers;
  };
};

export type AuthInfo = {
  profile: passport.Profile;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
};

export type AuthResponse =
  | {
      type: 'auth-result';
      payload: AuthInfo;
    }
  | {
      type: 'auth-result';
      error: Error | undefined;
    };
