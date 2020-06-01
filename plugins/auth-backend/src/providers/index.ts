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
import { AuthProviderRouteHandlers, AuthProviderConfig } from './types';
import { ProviderFactories } from './factories';

export const defaultRouter = (provider: AuthProviderRouteHandlers) => {
  const router = Router();
  router.get('/start', provider.start.bind(provider));
  router.get('/handler/frame', provider.frameHandler.bind(provider));
  router.get('/logout', provider.logout.bind(provider));
  if (provider.refresh) {
    router.get('/refresh', provider.refresh.bind(provider));
  }
  return router;
};

export const makeProvider = (config: AuthProviderConfig) => {
  const providerId = config.provider;
  const oauthProvider = ProviderFactories.getProviderFactory(config);
  const providerRouter = defaultRouter(oauthProvider);
  return { providerId, providerRouter };
};
