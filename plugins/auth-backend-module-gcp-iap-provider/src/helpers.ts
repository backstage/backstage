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

export function createTokenValidator(
  audience: string,
  providedClient?: OAuth2Client,
): (token: string) => Promise<GcpIapTokenInfo> {
  const client = providedClient ?? new OAuth2Client();

  return async function tokenValidator(token) {
    // TODO(freben): Rate limit the public key reads. It may be sensible to
    // cache these for some reasonable time rather than asking for the public
    // keys on every single sign-in. But since the rate of events here is so
    // slow, I decided to keep it simple for now.
    const response = await client.getIapPublicKeys().catch(error => {
      throw new AuthenticationError(
        `Unable to list Google IAP token verification keys, ${error}`,
      );
    });
    const ticket = await client
      .verifySignedJwtWithCertsAsync(token, response.pubkeys, audience, [
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
