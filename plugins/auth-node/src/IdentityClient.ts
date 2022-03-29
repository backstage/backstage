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

import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { AuthenticationError } from '@backstage/errors';
import {
  createRemoteJWKSet,
  jwtVerify,
  FlattenedJWSInput,
  JWSHeaderParameters,
} from 'jose';
import { GetKeyFunction } from 'jose/dist/types/types';
import { BackstageIdentityResponse } from './types';

/**
 * An identity client to interact with auth-backend and authenticate Backstage
 * tokens
 *
 * @experimental This is not a stable API yet
 * @public
 */
export class IdentityClient {
  private readonly discovery: PluginEndpointDiscovery;
  private readonly issuer: string;
  private keyStore?: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;
  private endpoint?: URL;

  /**
   * Create a new {@link IdentityClient} instance.
   */
  static create(options: {
    discovery: PluginEndpointDiscovery;
    issuer: string;
  }): IdentityClient {
    return new IdentityClient(options);
  }

  private constructor(options: {
    discovery: PluginEndpointDiscovery;
    issuer: string;
  }) {
    this.discovery = options.discovery;
    this.issuer = options.issuer;
    this.discovery.getBaseUrl('auth').then(url => {
      this.endpoint = new URL(`${url}/.well-known/jwks.json`);
      this.keyStore = createRemoteJWKSet(this.endpoint);
    });
  }

  /**
   * Verifies the given backstage identity token
   * Returns a BackstageIdentity (user) matching the token.
   * The method throws an error if verification fails.
   */
  async authenticate(
    token: string | undefined,
  ): Promise<BackstageIdentityResponse> {
    // Extract token from header
    if (!token) {
      throw new AuthenticationError('No token specified');
    }
    // Verify token claims and signature
    // Note: Claims must match those set by TokenFactory when issuing tokens
    // Note: verify throws if verification fails
    if (!this.keyStore) {
      throw new AuthenticationError('No keystore exists');
    }
    const decoded = await jwtVerify(token, this.keyStore, {
      algorithms: ['ES256'],
      audience: 'backstage',
      issuer: this.issuer,
    });
    // Verified, return the matching user as BackstageIdentity
    // TODO: Settle internal user format/properties
    if (!decoded.payload.sub) {
      throw new AuthenticationError('No user sub found in token');
    }

    const user: BackstageIdentityResponse = {
      token,
      identity: {
        type: 'user',
        userEntityRef: decoded.payload.sub,
        ownershipEntityRefs: decoded.payload.ent
          ? (decoded.payload.ent as string[])
          : [],
      },
    };
    return user;
  }
}
