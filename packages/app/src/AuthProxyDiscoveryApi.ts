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

import { Config } from '@backstage/config';
import { UrlPatternDiscovery } from '@backstage/core-app-api';
import { DiscoveryApi } from '@backstage/core-plugin-api';

export class AuthProxyDiscoveryApi implements DiscoveryApi {
  private urlPatternDiscovery: UrlPatternDiscovery;

  constructor(
    baseUrl: string,
    private readonly isAuthProxyingEnabled?: boolean,
    private readonly authProxyUrl?: string,
  ) {
    this.urlPatternDiscovery = UrlPatternDiscovery.compile(
      `${baseUrl}/api/{{ pluginId }}`,
    );
  }

  async getBaseUrl(pluginId: string) {
    if (
      pluginId === 'auth' &&
      this.isAuthProxyingEnabled &&
      this.authProxyUrl
    ) {
      return this.authProxyUrl;
    }

    return this.urlPatternDiscovery.getBaseUrl(pluginId);
  }

  static fromConfig(config: Config) {
    return new AuthProxyDiscoveryApi(
      config.getString('backend.baseUrl'),
      config.getOptionalBoolean('auth.proxy.enabled'),
      config.getOptionalString('auth.proxy.url'),
    );
  }
}
