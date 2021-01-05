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

import { Request } from 'express';
import { JWK, JWT, JWKS } from 'jose';
import { BackstageIdentity } from '../../providers';
import { IdentityClient } from '../../identity';
import { PluginEndpointDiscovery } from '@backstage/backend-common';

const Strategy = require('passport-strategy');
// Using singleton keyStore instead of membership due to Passport wtf
let keyStore: JWKS.KeyStore;
let keyStoreUpdated: number;

export class BackstageIdentityStrategy extends Strategy {
  private readonly client: IdentityClient;
  private readonly discovery: PluginEndpointDiscovery;

  constructor(options: { discovery: PluginEndpointDiscovery }) {
    super();
    this.client = new IdentityClient({ discovery: options.discovery });
    this.discovery = options.discovery;
    this.name = 'backstage';
  }

  private async refreshKeyStore(rawJwtToken: string) {
    const { header, payload } = JWT.decode(rawJwtToken, {
      complete: true,
    }) as {
      header: { kid: string };
      payload: { iat: number };
    };
    // Refresh public keys from identity if needed
    if (
      !keyStore ||
      (!keyStore.get({ kid: header.kid }) &&
        payload?.iat &&
        payload.iat > keyStoreUpdated)
    ) {
      const now = Date.now() / 1000;
      const publicKeys = await this.client.listPublicKeys();
      keyStore = new JWKS.KeyStore(publicKeys.keys.map(key => JWK.asKey(key)));
      keyStoreUpdated = now;
    }
  }

  async authenticate(req: Request) {
    if (
      !req.headers.authorization ||
      !req.headers.authorization.startsWith('Bearer ')
    ) {
      this.fail(new Error('No bearer token found in authorization header'));
    }

    try {
      const token = req!.headers!.authorization!.substring(7);
      const issuer = await this.discovery.getExternalBaseUrl('auth');
      await this.refreshKeyStore(token);
      const decoded = JWT.IdToken.verify(token, keyStore, {
        algorithms: ['ES256'],
        audience: 'backstage',
        issuer,
      }) as { sub: string };
      // Verified, forward BackstageIdentity to req.user
      const user: BackstageIdentity = {
        id: decoded.sub,
        idToken: token,
      };
      this.success(user);
    } catch (error) {
      // JWT verification failed
      this.fail(error);
    }
  }
}
