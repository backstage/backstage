/*
 * Copyright 2021 The Backstage Authors
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

import { TokenManager } from './types';
import { IdentityClient } from '../identity';
import { PluginEndpointDiscovery } from '../discovery';

export class AuthIdentityTokenManager implements TokenManager {
  // TODO: (b2b-auth) replace this in favor of actual server token in config likely
  private readonly SERVER_TOKEN = 'server-token';
  private identityClient: IdentityClient;

  constructor(discovery: PluginEndpointDiscovery) {
    this.identityClient = new IdentityClient({
      discovery,
      issuer: 'auth-identity-token-manager',
    });
  }

  async getServerToken(): Promise<{ token: string }> {
    return { token: this.SERVER_TOKEN };
  }

  // TODO: (b2b-auth) authenticate returns a Backstage Identity
  // need to figure out what to return after validating a server token
  async validateToken(token: string): Promise<void> {
    if (token !== this.SERVER_TOKEN) {
      try {
        await this.identityClient.authenticate(token);
        return;
      } catch (error) {
        throw new Error(`Invalid token, ${error}`);
      }
    }
  }
}
