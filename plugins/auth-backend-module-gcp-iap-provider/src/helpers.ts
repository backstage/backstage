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

import { AuthenticationError } from '@backstage/errors';
import { OAuth2Client } from 'google-auth-library';
import { GcpIapTokenInfo } from './types';

const IAP_PUBLIC_KEYS_CACHE_TTL_MS = 60 * 60 * 1000;

export function createTokenValidator(
  audience: string,
  providedClient?: OAuth2Client,
): (token: string) => Promise<GcpIapTokenInfo> {
  const client = providedClient ?? new OAuth2Client();
  let cachedPublicKeys: Record<string, string> | undefined;
  let publicKeysExpiresAt = 0;
  let pendingPublicKeys: Promise<Record<string, string>> | undefined;

  const getPublicKeys = async () => {
    if (cachedPublicKeys && Date.now() < publicKeysExpiresAt) {
      return cachedPublicKeys;
    }

    if (!pendingPublicKeys) {
      pendingPublicKeys = client
        .getIapPublicKeys()
        .then(response => {
          cachedPublicKeys = response.pubkeys;
          publicKeysExpiresAt = Date.now() + IAP_PUBLIC_KEYS_CACHE_TTL_MS;
          return cachedPublicKeys;
        })
        .catch(error => {
          throw new AuthenticationError(
            `Unable to list Google IAP token verification keys, ${error}`,
          );
        })
        .finally(() => {
          pendingPublicKeys = undefined;
        });
    }

    return pendingPublicKeys;
  };

  return async function tokenValidator(token) {
    const publicKeys = await getPublicKeys();
    const ticket = await client
      .verifySignedJwtWithCertsAsync(token, publicKeys, audience, [
        'https://cloud.google.com/iap',
      ])
      .catch(error => {
        throw new AuthenticationError(
          `Google IAP token verification failed, ${error}`,
        );
      });

    const payload = ticket.getPayload();
    if (!payload) {
      throw new AuthenticationError(
        'Google IAP token verification failed, token had no payload',
      );
    }

    if (!payload.sub) {
      throw new AuthenticationError(
        'Google IAP token payload is missing subject claim',
      );
    }
    if (!payload.email) {
      throw new AuthenticationError(
        'Google IAP token payload is missing email claim',
      );
    }

    return payload as unknown as GcpIapTokenInfo;
  };
}
