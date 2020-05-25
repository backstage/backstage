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
import cookieParser from 'cookie-parser';
import refresh from 'passport-oauth2-refresh';
import OAuth2Strategy from 'passport-oauth2';
import { Logger } from 'winston';
import { providers } from './../providers/config';
import { makeProvider } from '../providers';

export interface RouterOptions {
  logger: Logger;
}

export async function createRouter(
  options: RouterOptions,
): Promise<express.Router> {
  const router = Router();
  const logger = options.logger.child({ plugin: 'auth' });
  const providerRouters: { [key: string]: express.Router } = {};

  // configure all the providers
  for (const providerConfig of providers) {
    const { providerId, strategy, providerRouter } = makeProvider(
      providerConfig,
    );
    logger.info(`Configuring provider: ${providerId}`);
    passport.use(strategy);
    if (strategy instanceof OAuth2Strategy) {
      refresh.use(strategy);
    }
    providerRouters[providerId] = providerRouter;
  }

  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((user, done) => {
    done(null, user);
  });

  router.use(passport.initialize());
  router.use(passport.session());
  router.use(cookieParser());

  for (const providerId in providerRouters) {
    if (providerRouters.hasOwnProperty(providerId)) {
      const providerRouter = providerRouters[providerId];
      router.use(`/${providerId}`, providerRouter);
    }
  }

  return router;
}
