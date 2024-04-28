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
// We need the HttpServerOptions during runtime, not as a dev dependency.
// eslint-disable-next-line @backstage/no-undeclared-imports
import { readHttpServerOptions } from '@backstage/backend-app-api';
import {
  DiscoveryService,
  RootConfigService,
} from '@backstage/backend-plugin-api';

export class LocalDiscoveryService implements DiscoveryService {
  static fromConfig(config: RootConfigService) {
    const externalBaseUrl = config
      .getString('backend.baseUrl')
      .replace(/\/+$/, '');

    const {
      listen: { host: listenHost = '::', port: listenPort },
    } = readHttpServerOptions(config.getConfig('backend'));
    const protocol = config.has('backend.https') ? 'https' : 'http';

    // Translate bind-all to localhost, and support IPv6
    let host = listenHost;
    if (host === '::' || host === '') {
      // We use localhost instead of ::1, since IPv6-compatible systems should default
      // to using IPv6 when they see localhost, but if the system doesn't support IPv6
      // things will still work.
      host = 'localhost';
    } else if (host === '0.0.0.0') {
      host = '127.0.0.1';
    }
    if (host.includes(':')) {
      host = `[${host}]`;
    }

    const internalBaseUrl = `${protocol}://${host}:${listenPort}`;

    return new LocalDiscoveryService(
      `${internalBaseUrl}/api`,
      `${externalBaseUrl}/api`,
    );
  }
  constructor(public internalBaseUrl: string, public externalBaseUrl: string) {}

  async getBaseUrl(pluginId: string): Promise<string> {
    return `${this.internalBaseUrl}/${pluginId}`;
  }
  async getExternalBaseUrl(pluginId: string): Promise<string> {
    return `${this.externalBaseUrl}/${pluginId}`;
  }
}
