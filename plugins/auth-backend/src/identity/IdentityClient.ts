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

import fetch from 'cross-fetch';
import { JWKECKey } from 'jose';
import { PluginEndpointDiscovery } from '@backstage/backend-common';

/**
 * A identity client to interact with auth-backend.
 */
export class IdentityClient {
  private readonly discovery: PluginEndpointDiscovery;

  constructor(options: { discovery: PluginEndpointDiscovery }) {
    this.discovery = options.discovery;
  }

  /**
   * Lists public part of keys used to sign Backstage Identity tokens
   */
  async listPublicKeys(): Promise<{
    keys: JWKECKey[];
  }> {
    const url = `${await this.discovery.getBaseUrl(
      'auth',
    )}/.well-known/jwks.json`;
    const response = await fetch(url);

    if (!response.ok) {
      const payload = await response.text();
      const message = `Request failed with ${response.status} ${response.statusText}, ${payload}`;
      throw new Error(message);
    }

    const publicKeys: { keys: JWKECKey[] } = await response.json();

    return publicKeys;
  }
}
