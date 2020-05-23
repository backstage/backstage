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
import passport from 'passport';

export type AuthProviderConfig = {
  provider: string;
  options: any;
};

export interface AuthProvider {
  strategy(): passport.Strategy;
  router?(): express.Router;
}

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
  ): Promise<any>;
  refresh?(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<any>;
  logout(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ): Promise<any>;
}

export type AuthProviderFactories = {
  [key: string]: AuthProviderFactory;
};

export type AuthProviderFactory = {
  new (providerConfig: any): AuthProvider & AuthProviderRouteHandlers;
};

export type AuthInfo = {
  profile: passport.Profile;
  accessToken: string;
  expiresInSeconds?: number;
};

export type AuthResponse =
  | {
      type: 'auth-result';
      payload: AuthInfo;
    }
  | {
      type: 'auth-result';
      error: Error;
    };
