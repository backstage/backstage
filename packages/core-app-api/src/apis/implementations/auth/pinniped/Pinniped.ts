/*
 * Copyright 2024 The Backstage Authors
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
  AuthProviderInfo,
  AuthRequestOptions,
  ConfigApi,
  PinnipedSupervisorApi,
  pinnipedSupervisorApiRef,
  DiscoveryApi,
  OAuthRequestApi,
} from '@backstage/core-plugin-api';
import { OAuth2CreateOptions, OAuth2Session, PopupOptions } from '../oauth2';

import { OAuth2Response } from '../oauth2/OAuth2';
import {
  PinnipedAuthConnector,
  RefreshingAuthSessionManager,
  SessionManager,
} from '../../../../lib';

const PROVIDER_NAME = {
  id: 'pinniped',
  title: 'Pinniped',
  icon: () => null,
};

/**
 *
 *
 * @public
 */
export default class Pinniped implements PinnipedSupervisorApi {
  private audiences: { [aud: string]: SessionManager<OAuth2Session> };
  private configApi: ConfigApi | undefined;
  private environment: string;
  private provider: AuthProviderInfo;
  private discoveryApi: DiscoveryApi;
  private oauthRequestApi: OAuthRequestApi;
  private popupOptions: PopupOptions | undefined;

  static create(
    options: OAuth2CreateOptions,
  ): typeof pinnipedSupervisorApiRef.T {
    return new Pinniped(options);
  }

  private constructor(options: OAuth2CreateOptions) {
    const {
      configApi,
      environment = 'development',
      provider = PROVIDER_NAME,
      discoveryApi,
      oauthRequestApi,
      popupOptions,
    } = options;

    this.configApi = configApi;
    this.environment = environment;
    this.provider = provider;
    this.discoveryApi = discoveryApi;
    this.popupOptions = popupOptions;
    this.oauthRequestApi = oauthRequestApi;

    this.audiences = {};
  }

  async getClusterScopedIdToken(
    audience: string,
    options?: AuthRequestOptions | undefined,
  ): Promise<string> {
    const aud = audience;
    if (!(aud in this.audiences)) {
      const connector = new PinnipedAuthConnector({
        configApi: this.configApi,
        discoveryApi: this.discoveryApi,
        environment: this.environment,
        oauthRequestApi: this.oauthRequestApi,
        provider: this.provider,
        sessionTransform({
          backstageIdentity,
          ...res
        }: OAuth2Response): OAuth2Session {
          const session: OAuth2Session = {
            ...res,
            providerInfo: {
              idToken: res.providerInfo.idToken,
              accessToken: res.providerInfo.accessToken,
              scopes: new Set(),
              expiresAt: res.providerInfo.expiresInSeconds
                ? new Date(
                    Date.now() + res.providerInfo.expiresInSeconds * 1000,
                  )
                : undefined,
            },
          };
          return session;
        },
        popupOptions: this.popupOptions,
        audience: aud,
      });

      const sessionManager = new RefreshingAuthSessionManager({
        connector,
        sessionScopes: (session: OAuth2Session) => session.providerInfo.scopes,
        sessionShouldRefresh: (session: OAuth2Session) => {
          let min = Infinity;
          if (session.providerInfo?.expiresAt) {
            min = Math.min(
              min,
              (session.providerInfo.expiresAt.getTime() - Date.now()) / 1000,
            );
          }
          return min < 60 * 5;
        },
      });

      this.audiences[aud] = sessionManager;
    }

    const session = await this.audiences[aud].getSession({
      ...options,
    });

    return session?.providerInfo.idToken ?? '';
  }
}
