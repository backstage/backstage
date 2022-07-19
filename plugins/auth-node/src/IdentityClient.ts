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
  decodeJwt,
  decodeProtectedHeader,
  FlattenedJWSInput,
  JWSHeaderParameters,
  jwtVerify,
} from 'jose';
import { GetKeyFunction } from 'jose/dist/types/types';

import { BackstageIdentityResponse } from './types';

const CLOCK_MARGIN_S = 10;

/**
 * An identity client options object which allows extra configurations
 *
 * @experimental This is not a stable API yet
 * @public
 */
export type IdentityClientOptions = {
  discovery: PluginEndpointDiscovery;
  issuer: string;

  /** JWS "alg" (Algorithm) Header Parameter values. Defaults to an array containing just ES256.
   * More info on supported algorithms: https://github.com/panva/jose */
  algorithms?: string[];
};

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
  private readonly algorithms: string[];
  private keyStore?: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;
  private keyStoreUpdated: number = 0;

  /**
   * Create a new {@link IdentityClient} instance.
   */
  static create(options: IdentityClientOptions): IdentityClient {
    return new IdentityClient(options);
  }

  private constructor(options: IdentityClientOptions) {
    this.discovery = options.discovery;
    this.issuer = options.issuer;
    this.algorithms = options.algorithms ?? ['ES256'];
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
    // Check if the keystore needs to be updated
    await this.refreshKeyStore(token);
    if (!this.keyStore) {
      throw new AuthenticationError('No keystore exists');
    }
    const decoded = await jwtVerify(token, this.keyStore, {
      algorithms: this.algorithms,
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

  /**
   * If the last keystore refresh is stale, update the keystore URL to the latest
   */
  private async refreshKeyStore(rawJwtToken: string): Promise<void> {
    const payload = await decodeJwt(rawJwtToken);
    const header = await decodeProtectedHeader(rawJwtToken);

    // Refresh public keys if needed
    let keyStoreHasKey;
    try {
      if (this.keyStore) {
        // Check if the key is present in the keystore
        const [_, rawPayload, rawSignature] = rawJwtToken.split('.');
        keyStoreHasKey = await this.keyStore(header, {
          payload: rawPayload,
          signature: rawSignature,
        });
      }
    } catch (error) {
      keyStoreHasKey = false;
    }
    // Refresh public key URL if needed
    // Add a small margin in case clocks are out of sync
    const issuedAfterLastRefresh =
      payload?.iat && payload.iat > this.keyStoreUpdated - CLOCK_MARGIN_S;
    if (!this.keyStore || (!keyStoreHasKey && issuedAfterLastRefresh)) {
      const url = await this.discovery.getBaseUrl('auth');
      const endpoint = new URL(`${url}/.well-known/jwks.json`);
      this.keyStore = createRemoteJWKSet(endpoint);
      this.keyStoreUpdated = Date.now() / 1000;
    }
  }
}
