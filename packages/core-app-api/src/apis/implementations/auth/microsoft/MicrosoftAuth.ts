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

    this.environment = environment;
    this.provider = provider;
    this.oauthRequestApi = oauthRequestApi;
    this.discoveryApi = discoveryApi;

    this.oauth2 = {
      [MicrosoftAuth.MicrosoftGraphID]: OAuth2.create({
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

  static expectedClaims(scope: string): { aud: string; scp: string } {
    const scopes = scope.split(' ').map(MicrosoftAuth.parseScope);
    const firstAudience =
      scopes.map(({ aud }) => aud).find(aud => aud !== 'openid') ??
      MicrosoftAuth.MicrosoftGraphID;
    return {
      aud: firstAudience,
      scp: scopes
        .filter(
          ({ aud, scp }) =>
            (aud === 'openid' && scp !== 'offline_access') ||
            aud === firstAudience,
        )
        .map(({ scp }) => scp)
        .join(' '),
    };
  }

  private static parseScope(scope: string): { aud: string; scp: string } {
    const groups = scope.match(/^(?<resourceURI>.*)\/(?<scp>[^\/]*)$/)?.groups;
    if (groups) {
      const { resourceURI, scp } = groups;
      const aud = resourceURI.replace(/^api:\/\//, '');
      return { aud, scp };
    }
    switch (scope) {
      case 'email':
      case 'openid':
      case 'offline_access':
      case 'profile': {
        return { aud: 'openid', scp: scope };
      }
      default:
        return { aud: MicrosoftAuth.MicrosoftGraphID, scp: scope };
    }
  }

  getAccessToken(scope?: string | string[], options?: AuthRequestOptions) {
    const { aud } =
      scope === undefined
        ? { aud: MicrosoftAuth.MicrosoftGraphID }
        : MicrosoftAuth.expectedClaims(
            Array.isArray(scope) ? scope.join(' ') : scope,
          );
    if (!(aud in this.oauth2)) {
      this.oauth2[aud] = OAuth2.create({
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
