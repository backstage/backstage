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
import { DiscoveryService } from '@backstage/backend-plugin-api';
import { AuthenticationError } from '@backstage/errors';
import { TokenTypes } from '@backstage/plugin-auth-node';
import {
  base64url,
  createRemoteJWKSet,
  decodeJwt,
  decodeProtectedHeader,
  FlattenedJWSInput,
  JWSHeaderParameters,
  jwtVerify,
  JWTVerifyOptions,
} from 'jose';
import { GetKeyFunction } from 'jose/dist/types/types';

const CLOCK_MARGIN_S = 10;

/**
 * An identity client to interact with auth-backend and authenticate Backstage
 * tokens
 *
 * @internal
 */
export class UserTokenHandler {
  readonly #discovery: PluginEndpointDiscovery;
  readonly #algorithms?: string[];

  #keyStore?: GetKeyFunction<JWSHeaderParameters, FlattenedJWSInput>;
  #keyStoreUpdated: number = 0;

  constructor(options: { discovery: DiscoveryService }) {
    this.#discovery = options.discovery;
    this.#algorithms = ['ES256']; // TODO: configurable?
  }

  async verifyToken(token: string) {
    const verifyOpts = this.#getTokenVerificationOptions(token);
    if (!verifyOpts) {
      return undefined;
    }

    await this.refreshKeyStore(token);
    if (!this.#keyStore) {
      throw new AuthenticationError('No keystore exists');
    }

    // Verify a limited token, ensuring the necessarily claims are present and token type is correct
    const { payload } = await jwtVerify(
      token,
      this.#keyStore,
      verifyOpts,
    ).catch(e => {
      throw new AuthenticationError('invalid token', e);
    });

    const userEntityRef = payload.sub;

    if (!userEntityRef) {
      throw new AuthenticationError('No user sub found in token');
    }

    return { userEntityRef };
  }

  #getTokenVerificationOptions(token: string): JWTVerifyOptions | undefined {
    const { typ } = decodeProtectedHeader(token);

    if (typ === TokenTypes.user.typParam) {
      return {
        algorithms: this.#algorithms,
        typ: TokenTypes.user.typParam,
      };
    }

    if (typ === TokenTypes.limitedUser.typParam) {
      return {
        algorithms: this.#algorithms,
        requiredClaims: ['iat', 'exp', 'sub'],
        typ: TokenTypes.limitedUser.typParam,
      };
    }

    return {
      algorithms: this.#algorithms,
      audience: 'backstage',
    };
  }

  createLimitedUserToken(backstageToken: string) {
    const [headerRaw, payloadRaw] = backstageToken.split('.');
    const header = JSON.parse(
      new TextDecoder().decode(base64url.decode(headerRaw)),
    );
    const payload = JSON.parse(
      new TextDecoder().decode(base64url.decode(payloadRaw)),
    );

    const limitedUserToken = [
      base64url.encode(
        JSON.stringify({
          typ: 'vnd.backstage.limited-user',
          alg: header.alg,
          kid: header.kid,
        }),
      ),
      base64url.encode(
        JSON.stringify({
          sub: payload.sub,
          ent: payload.ent,
          iat: payload.iat,
          exp: payload.exp,
        }),
      ),
      payload.uip,
    ].join('.');

    return { token: limitedUserToken, expiresAt: new Date(payload.exp * 1000) };
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
      if (this.#keyStore) {
        // Check if the key is present in the keystore
        const [_, rawPayload, rawSignature] = rawJwtToken.split('.');
        keyStoreHasKey = await this.#keyStore(header, {
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
      payload?.iat && payload.iat > this.#keyStoreUpdated - CLOCK_MARGIN_S;
    if (!this.#keyStore || (!keyStoreHasKey && issuedAfterLastRefresh)) {
      const url = await this.#discovery.getBaseUrl('auth');
      const endpoint = new URL(`${url}/.well-known/jwks.json`);
      this.#keyStore = createRemoteJWKSet(endpoint);
      this.#keyStoreUpdated = Date.now() / 1000;
    }
  }
}
