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

import {
  ApiRegistry,
  alertApiRef,
  errorApiRef,
  AlertApiForwarder,
  ConfigApi,
  ErrorApiForwarder,
  ErrorAlerter,
  featureFlagsApiRef,
  FeatureFlags,
  GoogleAuth,
  GithubAuth,
  oauthRequestApiRef,
  OAuthRequestManager,
  googleAuthApiRef,
  githubAuthApiRef,
  storageApiRef,
  WebStorage,
} from '@backstage/core';

import {
  lighthouseApiRef,
  LighthouseRestApi,
} from '@backstage/plugin-lighthouse';

import { techRadarApiRef, TechRadar } from '@backstage/plugin-tech-radar';

import { CircleCIApi, circleCIApiRef } from '@backstage/plugin-circleci';
import { catalogApiRef, CatalogClient } from '@backstage/plugin-catalog';

import { gitOpsApiRef, GitOpsRestApi } from '@backstage/plugin-gitops-profiles';

export const apis = (config: ConfigApi) => {
  // eslint-disable-next-line no-console
  console.log(`Creating APIs for ${config.getString('app.title')}`);

  const builder = ApiRegistry.builder();

  const alertApi = builder.add(alertApiRef, new AlertApiForwarder());
  const errorApi = builder.add(
    errorApiRef,
    new ErrorAlerter(alertApi, new ErrorApiForwarder()),
  );

  builder.add(storageApiRef, WebStorage.create({ errorApi }));
  builder.add(circleCIApiRef, new CircleCIApi());
  builder.add(featureFlagsApiRef, new FeatureFlags());

  builder.add(lighthouseApiRef, new LighthouseRestApi('http://localhost:3003'));

  const oauthRequestApi = builder.add(
    oauthRequestApiRef,
    new OAuthRequestManager(),
  );

  builder.add(
    googleAuthApiRef,
    GoogleAuth.create({
      apiOrigin: 'http://localhost:7000',
      basePath: '/auth/',
      oauthRequestApi,
    }),
  );

  builder.add(
    githubAuthApiRef,
    GithubAuth.create({
      apiOrigin: 'http://localhost:7000',
      basePath: '/auth/',
      oauthRequestApi,
    }),
  );

  builder.add(
    techRadarApiRef,
    new TechRadar({
      width: 1500,
      height: 800,
    }),
  );

  builder.add(
    catalogApiRef,
    new CatalogClient({
      apiOrigin: 'http://localhost:3000',
      basePath: '/catalog/api',
    }),
  );

  builder.add(gitOpsApiRef, new GitOpsRestApi('http://localhost:3008'));

  return builder.build();
};
