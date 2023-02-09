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
  microsoftAuthApiRef,
  AuthRequestOptions,
  AuthProviderInfo,
  ConfigApi,
  DiscoveryApi,
  OAuthRequestApi,
} from '@backstage/core-plugin-api';
import { OAuth2 } from '../oauth2';
import { OAuthApiCreateOptions } from '../types';

const DEFAULT_PROVIDER = {
  id: 'microsoft',
  title: 'Microsoft',
  icon: () => null,
};

/**
 * Implements the OAuth flow to Microsoft products.
 *
 * @public
 */
export default class MicrosoftAuth {
  private oauth2: { [aud: string]: OAuth2 };
  private configApi: ConfigApi | undefined;
  private environment: string;
  private provider: AuthProviderInfo;
  private oauthRequestApi: OAuthRequestApi;
  private discoveryApi: DiscoveryApi;

  private static MicrosoftGraphID = '00000003-0000-0000-c000-000000000000';

  static create(options: OAuthApiCreateOptions): typeof microsoftAuthApiRef.T {
    return new MicrosoftAuth(options);
  }
  private constructor(options: OAuthApiCreateOptions) {
    const {
      configApi,
      environment = 'development',
      provider = DEFAULT_PROVIDER,
      oauthRequestApi,
      discoveryApi,
      defaultScopes = [
        'openid',
        'offline_access',
        'profile',
        'email',
        'User.Read',
      ],
    } = options;

    this.configApi = configApi;
    this.environment = environment;
    this.provider = provider;
    this.oauthRequestApi = oauthRequestApi;
    this.discoveryApi = discoveryApi;

    this.oauth2 = {
      [MicrosoftAuth.MicrosoftGraphID]: OAuth2.create({
        configApi: this.configApi,
        discoveryApi: this.discoveryApi,
        oauthRequestApi: this.oauthRequestApi,
        provider: this.provider,
        environment: this.environment,
        defaultScopes,
      }),
    };
  }

  private microsoftGraph(): OAuth2 {
    return this.oauth2[MicrosoftAuth.MicrosoftGraphID];
  }

  private static resourceForScopes(scope: string): Promise<string> {
    const audience =
      scope
        .split(' ')
        .map(MicrosoftAuth.resourceForScope)
        .find(aud => aud !== 'openid') ?? MicrosoftAuth.MicrosoftGraphID;
    return Promise.resolve(audience);
  }

  private static resourceForScope(scope: string): string {
    const groups = scope.match(/^(?<resourceURI>.*)\/(?<scp>[^\/]*)$/)?.groups;
    if (groups) {
      const { resourceURI } = groups;
      const aud = resourceURI.replace(/^api:\/\//, '');
      return aud;
    }
    switch (scope) {
      case 'email':
      case 'openid':
      case 'offline_access':
      case 'profile': {
        return 'openid';
      }
      default:
        return MicrosoftAuth.MicrosoftGraphID;
    }
  }

  async getAccessToken(
    scope?: string | string[],
    options?: AuthRequestOptions,
  ): Promise<string> {
    const aud =
      scope === undefined
        ? MicrosoftAuth.MicrosoftGraphID
        : await MicrosoftAuth.resourceForScopes(
            Array.isArray(scope) ? scope.join(' ') : scope,
          );
    if (!(aud in this.oauth2)) {
      this.oauth2[aud] = OAuth2.create({
        configApi: this.configApi,
        discoveryApi: this.discoveryApi,
        oauthRequestApi: this.oauthRequestApi,
        provider: this.provider,
        environment: this.environment,
      });
    }
    return this.oauth2[aud].getAccessToken(scope, options);
  }

  getIdToken(options?: AuthRequestOptions) {
    return this.microsoftGraph().getIdToken(options);
  }

  getProfile(options?: AuthRequestOptions) {
    return this.microsoftGraph().getProfile(options);
  }

  getBackstageIdentity(options?: AuthRequestOptions) {
    return this.microsoftGraph().getBackstageIdentity(options);
  }

  signIn() {
    return this.microsoftGraph().signIn();
  }

  signOut() {
    return this.microsoftGraph().signOut();
  }

  sessionState$() {
    return this.microsoftGraph().sessionState$();
  }
}
