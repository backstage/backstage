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

import GithubIcon from '@material-ui/icons/AcUnit';
import { githubAuthApiRef } from '../../../definitions/auth';
import {
  OAuthRequestApi,
  AuthProvider,
  DiscoveryApi,
} from '../../../definitions';
import { OAuth2 } from '../oauth2';

type CreateOptions = {
  discoveryApi: DiscoveryApi;
  oauthRequestApi: OAuthRequestApi;

  defaultScopes?: string[];
  environment?: string;
  provider?: AuthProvider & { id: string };
};

const DEFAULT_PROVIDER = {
  id: 'github',
  title: 'Github',
  icon: GithubIcon,
};

class GithubAuth {
  static create({
    discoveryApi,
    oauthRequestApi,
    environment = 'development',
    provider = DEFAULT_PROVIDER,
  }: CreateOptions): typeof githubAuthApiRef.T {
    return OAuth2.create({
      discoveryApi,
      oauthRequestApi,
      provider,
      environment,
      defaultScopes: ['user', 'repo'],
      scopeTransform(scopes: string[]) {
        return scopes.map(scope => {
          return `${scope}`;
        });
      },
    });
  }
}
export default GithubAuth;
