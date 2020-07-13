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
import { Logger } from 'winston';
import { TokenIssuer } from '../identity';
import { createGithubProvider } from './github';
import { createGitlabProvider } from './gitlab';
import { createGoogleProvider } from './google';
import { createOAuth2Provider } from './oauth2';
import { createOktaProvider } from './okta';
import { createSamlProvider } from './saml';
import { createAuth0Provider } from './auth0'
import { AuthProviderConfig, AuthProviderFactory } from './types';

const factories: { [providerId: string]: AuthProviderFactory } = {
  google: createGoogleProvider,
  github: createGithubProvider,
  gitlab: createGitlabProvider,
  saml: createSamlProvider,
  okta: createOktaProvider,
  auth0: createAuth0Provider,
  oauth2: createOAuth2Provider,
};

export const createAuthProviderRouter = (
  providerId: string,
  globalConfig: AuthProviderConfig,
  providerConfig: any, // TODO: make this a config reader object of sorts
  logger: Logger,
  issuer: TokenIssuer,
) => {
  const factory = factories[providerId];
  if (!factory) {
    throw Error(`No auth provider available for '${providerId}'`);
  }

  const provider = factory(globalConfig, providerConfig, logger, issuer);

  const router = Router();
  router.get('/start', provider.start.bind(provider));
  router.get('/handler/frame', provider.frameHandler.bind(provider));
  router.post('/handler/frame', provider.frameHandler.bind(provider));
  if (provider.logout) {
    router.post('/logout', provider.logout.bind(provider));
  }
  if (provider.refresh) {
    router.get('/refresh', provider.refresh.bind(provider));
  }

  return router;
};
