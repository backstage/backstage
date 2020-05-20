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

import Router from 'express-promise-router';
import {
  AuthProviderRouteHandlers,
  AuthProviderFactories,
  AuthProviderConfig,
} from './types';

export const defaultRouter = (provider: AuthProviderRouteHandlers) => {
  const router = Router();
  router.get('/start', provider.start);
  router.get('/handler/frame', provider.frameHandler);
  router.get('/logout', provider.logout);
  if (provider.refresh) {
    router.get('/refreshToken', provider.refresh);
  }
  return router;
};

export const makeProvider = (
  providerFactories: AuthProviderFactories,
  config: any,
) => {
  const providerId = config.provider;
  const ProviderImpl = providerFactories[providerId];
  if (!ProviderImpl) {
    throw Error(
      `Provider Implementation missing for : ${providerId} auth provider`,
    );
  }
  const providerInstance = new ProviderImpl(config);
  const strategy = providerInstance.strategy();
  const providerRouter = defaultRouter(providerInstance);
  return { providerId, strategy, providerRouter };
};
