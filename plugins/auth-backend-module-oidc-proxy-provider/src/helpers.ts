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

import { AuthenticationError } from '@backstage/errors';
import { IDTokenInfo } from './types';
import { KeyStoreClient } from './JwksClient';
import { LoggerService } from '@backstage/backend-plugin-api';
import { jwtVerify } from 'jose';

export function createTokenValidator(
  logger: LoggerService,
  iss: string,
  aud: string,
  jwksClient: KeyStoreClient,
): (token: string) => Promise<IDTokenInfo> {
  const verifyOpts = {
    issuer: iss,
    audience: aud,
    requiredClaims: ['iat', 'exp', 'sub', 'email'],
  };

  return async function tokenValidator(token) {
    await jwksClient.refreshKeyStore(token);

    // Verify the token and required claims.
    const { payload } = await jwtVerify(
      token,
      jwksClient.getKey,
      verifyOpts,
    ).catch(e => {
      logger.error(`invalid token: ${e}`);
      throw new AuthenticationError('Invalid token', e);
    });

    return payload as unknown as IDTokenInfo;
  };
}
