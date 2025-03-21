/*
 * Copyright 2020 The Backstage Authors
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
  BackstageIdentityResponse,
  bitbucketAuthApiRef,
  ProfileInfo,
} from '@backstage/core-plugin-api';

import { OAuthApiCreateOptions } from '../types';
import { OAuth2 } from '../oauth2';

export type BitbucketAuthResponse = {
  providerInfo: {
    accessToken: string;
    scope: string;
    expiresInSeconds: number;
  };
  profile: ProfileInfo;
  backstageIdentity: BackstageIdentityResponse;
};

const DEFAULT_PROVIDER = {
  id: 'bitbucket',
  title: 'Bitbucket',
  icon: () => null,
};

/**
 * Implements the OAuth flow to Bitbucket products.
 *
 * @public
 */
export default class BitbucketAuth {
  static create(options: OAuthApiCreateOptions): typeof bitbucketAuthApiRef.T {
    const {
      configApi,
      discoveryApi,
      environment = 'development',
      provider = DEFAULT_PROVIDER,
      oauthRequestApi,
      defaultScopes = ['account'],
    } = options;

    return OAuth2.create({
      configApi,
      discoveryApi,
      oauthRequestApi,
      provider,
      environment,
      defaultScopes,
    });
  }
}
