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

import { LoggerService } from '@backstage/backend-plugin-api';
import { AuthenticationError } from '@backstage/errors';
import { JWK, KeyLike, importJWK, jwtVerify } from 'jose';
import fetch from 'node-fetch';
import { IDTokenInfo } from './types';

export function createTokenValidator(
  logger: LoggerService,
  iss: string,
  aud: string,
  providedJwks?: (KeyLike | Uint8Array)[],
): (token: string) => Promise<IDTokenInfo> {
  let jwksUri: string = '';

  return async function tokenValidator(token) {
    // Perform discovery once to avoid two round trips on every authentication request.
    if (jwksUri === '' && providedJwks === undefined) {
      jwksUri = await discoverJwksUri(iss);
    }

    logger.info(`jwksUri: ${jwksUri}`);
    // Verify the token was signed by the issuer.  Performs one round trip to
    // the jwks uri every authentication request to fetch the current key set
    // from the issuer.  May be optimized in the future, but this happens only
    // at sign-in, not for every request to the backend.
    //
    // Refer to https://github.com/panva/jose/blob/v5.4.0/docs/functions/jwks_remote.createRemoteJWKSet.md#returns-1
    const jwks = providedJwks ?? (await loadJwksUri(logger, jwksUri));

    for (const key of jwks) {
      try {
        const { payload } = await jwtVerify(token, key, {
          issuer: iss,
          audience: aud,
          requiredClaims: ['sub', 'email'],
        });

        return payload as unknown as IDTokenInfo;
      } catch (error) {
        if (!`${error}`.includes('signature verification failed')) {
          throw new AuthenticationError(
            `could not validate id token: ${error}`,
          );
        }
      }
    }
    throw new AuthenticationError(
      'could not validate id token: signature verification failed',
    );
  };
}

async function discoverJwksUri(iss: string): Promise<string> {
  const resp = await fetch(`${iss}/.well-known/openid-configuration`);
  if (!resp.ok) {
    throw new Error(`could not fetch discovery document: ${resp.statusText}`);
  }
  return resp.json().then(discoveryDocument => {
    if (!discoveryDocument.jwks_uri) {
      throw new Error(
        `missing jwks_uri from ${iss}/.well-known-openid-configuration`,
      );
    }
    return discoveryDocument.jwks_uri;
  });
}

async function loadJwksUri(
  logger: LoggerService,
  jwksUri: string,
): Promise<KeyLike[]> {
  try {
    const response = await fetch(jwksUri);
    if (!response.ok) {
      throw new Error(`could not fetch jwks: ${response.statusText}`);
    }
    const jwks = await response.json();
    if (!Array.isArray(jwks.keys)) {
      throw new Error('could not load jwks: missing keys field');
    }

    const keys: KeyLike[] = await Promise.all(
      jwks.keys.map(async (jwk: JWK) => {
        try {
          return await importJWK(jwk);
        } catch (error) {
          throw new Error(`could not import jwk: ${error}`);
        }
      }),
    );

    return keys;
  } catch (error) {
    logger.error(`could not load jwks uri ${jwksUri}: ${error}`);
    throw error;
  }
}
