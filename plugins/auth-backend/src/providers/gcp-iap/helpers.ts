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
import { OAuth2Client, TokenPayload } from 'google-auth-library';
import { AuthHandler } from '../types';
import { GcpIapResult, IAP_JWT_HEADER } from './types';

export function createTokenValidator(
  audience: string,
  mockClient?: OAuth2Client,
): (token: string) => Promise<TokenPayload> {
  const client = mockClient ?? new OAuth2Client();

  return async function tokenValidator(token) {
    // TODO(freben): Rate limit the public key reads. It may be sensible to
    // cache these for some reasonable time rather than asking for the public
    // keys on every single sign-in. But since the rate of events here is so
    // slow, I decided to keep it simple for now.
    const response = await client.getIapPublicKeys();
    const ticket = await client.verifySignedJwtWithCertsAsync(
      token,
      response.pubkeys,
      audience,
      ['https://cloud.google.com/iap'],
    );

    const payload = ticket.getPayload();
    if (!payload) {
      throw new TypeError('Token had no payload');
    }

    return payload;
  };
}

export async function parseRequestToken(
  jwtToken: unknown,
  tokenValidator: (token: string) => Promise<TokenPayload>,
): Promise<GcpIapResult> {
  if (typeof jwtToken !== 'string' || !jwtToken) {
    throw new AuthenticationError(
      `Missing Google IAP header: ${IAP_JWT_HEADER}`,
    );
  }

  let payload: TokenPayload;
  try {
    payload = await tokenValidator(jwtToken);
  } catch (e) {
    throw new AuthenticationError(`Google IAP token verification failed, ${e}`);
  }

  if (!payload.sub || !payload.email) {
    throw new AuthenticationError(
      'Google IAP token payload is missing sub and/or email claim',
    );
  }

  return {
    iapToken: {
      ...payload,
      sub: payload.sub,
      email: payload.email,
    },
  };
}

export const defaultAuthHandler: AuthHandler<GcpIapResult> = async ({
  iapToken,
}) => ({ profile: { email: iapToken.email } });
