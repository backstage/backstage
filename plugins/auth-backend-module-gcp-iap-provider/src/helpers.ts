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

const FALLBACK_IAP_PUBLIC_KEYS_CACHE_TTL_MS = 5 * 60 * 1000;
const IAP_PUBLIC_KEYS_CACHE_SAFETY_MARGIN_MS = 5 * 60 * 1000;

function getResponseHeader(headers: unknown, name: string): string | undefined {
  if (!headers || typeof headers !== 'object') {
    return undefined;
  }

  const value = (headers as Record<string, unknown>)[name];
  if (typeof value === 'string') {
    return value;
  }
  if (Array.isArray(value) && value.every(item => typeof item === 'string')) {
    return value.join(', ');
  }
  return undefined;
}

function getResponseAgeMs(headers: unknown): number {
  const age = getResponseHeader(headers, 'age');
  if (!age || !/^\d+$/.test(age)) {
    return 0;
  }

  const ageMs = Number(age) * 1000;
  return Number.isSafeInteger(ageMs) ? ageMs : 0;
}

function getPublicKeysCacheTtl(headers: unknown, now: number): number {
  const cacheControl = getResponseHeader(headers, 'cache-control');
  if (/(?:^|,)\s*no-(?:cache|store)\s*(?:,|$)/i.test(cacheControl ?? '')) {
    return 0;
  }

  const maxAge = /(?:^|,)\s*max-age\s*=\s*"?(?<seconds>\d+)"?/i.exec(
    cacheControl ?? '',
  )?.groups?.seconds;

  if (maxAge !== undefined) {
    const ttl = Number(maxAge) * 1000;
    if (Number.isSafeInteger(ttl)) {
      return Math.max(
        0,
        ttl -
          getResponseAgeMs(headers) -
          IAP_PUBLIC_KEYS_CACHE_SAFETY_MARGIN_MS,
      );
    }
  }

  const expires = getResponseHeader(headers, 'expires');
  if (expires) {
    const expiresAt = Date.parse(expires);
    if (Number.isFinite(expiresAt)) {
      return Math.max(
        0,
        expiresAt - now - IAP_PUBLIC_KEYS_CACHE_SAFETY_MARGIN_MS,
      );
    }
  }

  return FALLBACK_IAP_PUBLIC_KEYS_CACHE_TTL_MS;
}

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
          const now = Date.now();
          publicKeysExpiresAt =
            now + getPublicKeysCacheTtl(response.res?.headers, now);
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
