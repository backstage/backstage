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

import {
  azureEasyAuthAuthenticator,
  ID_TOKEN_HEADER,
  ACCESS_TOKEN_HEADER,
} from './authenticator';
import { mockServices } from '@backstage/backend-test-utils';
import { Request } from 'express';
import { SignJWT, JWTPayload, errors as JoseErrors } from 'jose';
import { randomBytes } from 'crypto';

const jwtSecret = randomBytes(48);

async function buildJwt(claims: JWTPayload) {
  return await new SignJWT(claims)
    .setProtectedHeader({ alg: 'HS256' })
    .sign(jwtSecret);
}

function mockRequest(headers?: Record<string, string>) {
  return {
    header: (name: string) => headers?.[name],
  } as unknown as Request;
}

describe('EasyAuthAuthProvider', () => {
  const ctx = azureEasyAuthAuthenticator.initialize({
    config: mockServices.rootConfig(),
  });

  describe('should succeed when', () => {
    const claims = {
      ver: '2.0',
      oid: 'c43063d4-0650-4f3e-ba6b-307473d24dfd',
      name: 'Alice Bob',
      email: 'alice@bob.com',
      preferred_username: 'Another name',
    };

    it('valid id_token provided', async () => {
      const request = mockRequest({
        [ID_TOKEN_HEADER]: await buildJwt(claims),
      });
      await expect(
        azureEasyAuthAuthenticator.authenticate({ req: request }, ctx),
      ).resolves.toEqual({
        result: {
          fullProfile: {
            provider: 'easyauth',
            id: 'c43063d4-0650-4f3e-ba6b-307473d24dfd',
            displayName: 'Alice Bob',
            emails: [{ value: 'alice@bob.com' }],
            username: 'Another name',
          },
          accessToken: undefined,
        },
        providerInfo: {
          accessToken: undefined,
        },
      });
    });

    it('valid id_token and access_token provided', async () => {
      const request = mockRequest({
        [ID_TOKEN_HEADER]: await buildJwt(claims),
        [ACCESS_TOKEN_HEADER]: 'ACCESS_TOKEN',
      });
      await expect(
        azureEasyAuthAuthenticator.authenticate({ req: request }, ctx),
      ).resolves.toMatchObject({
        result: { accessToken: 'ACCESS_TOKEN' },
        providerInfo: { accessToken: 'ACCESS_TOKEN' },
      });
    });
  });

  describe('should fail when', () => {
    it('id token is missing', async () => {
      const request = mockRequest();
      await expect(
        azureEasyAuthAuthenticator.authenticate({ req: request }, ctx),
      ).rejects.toThrow('Missing x-ms-token-aad-id-token header');
    });

    it('id token is invalid', async () => {
      const request = mockRequest({ [ID_TOKEN_HEADER]: 'not-a-jwt' });
      await expect(
        azureEasyAuthAuthenticator.authenticate({ req: request }, ctx),
      ).rejects.toThrow(JoseErrors.JWTInvalid);
    });

    it('id token is v1', async () => {
      const request = mockRequest({
        [ID_TOKEN_HEADER]: await buildJwt({ ver: '1.0' }),
      });
      await expect(
        azureEasyAuthAuthenticator.authenticate({ req: request }, ctx),
      ).rejects.toThrow('id_token is not version 2.0');
    });
  });
});
