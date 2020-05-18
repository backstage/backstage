import express from 'express';
import passport from 'passport';

export type AuthProviderHandlers = {
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

export type AuthProvider = {
  [key: string]: {
    makeStrategy(options: any): passport.Strategy;
    makeRouter(handlers: AuthProviderHandlers): express.Router;
  };
};

export type AuthInfo = {
  profile: passport.Profile;
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
};

export type AuthResponse = {
  type: string;
  payload: AuthInfo;
};
