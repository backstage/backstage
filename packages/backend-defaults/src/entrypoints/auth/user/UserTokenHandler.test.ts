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

import { JsonObject } from '@backstage/types';
import { UserTokenHandler } from './UserTokenHandler';
import {
  mockServices,
  registerMswTestHooks,
} from '@backstage/backend-test-utils';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { AuthenticationError } from '@backstage/errors';
import { SignJWT, GeneralSign, importJWK, base64url } from 'jose';

const mockPublicKey = {
  kty: 'EC',
  x: 'GHlwg744e8JekzukPTdtix6R868D6fcWy0ooOx-NEZI',
  y: 'Lyujcm0M6X9_yQi3l1eH09z0brU8K9cwrLml_fRFKro',
  crv: 'P-256',
  kid: 'mock',
  alg: 'ES256',
};
const mockPrivateKey = {
  ...mockPublicKey,
  d: 'KEn_mDqXYbZdRHb-JnCrW53LDOv5x4NL1FnlKcqBsFI',
};

const server = setupServer();

function encodeData(data: JsonObject) {
  return base64url.encode(JSON.stringify(data));
}

async function createToken(options: {
  header: JsonObject;
  payload: JsonObject;
  signature?: string;
}) {
  if (options.signature) {
    const header = encodeData(options.header);
    const payload = encodeData(options.payload);

    return `${header}.${payload}.${options.signature}`;
  }

  return await new SignJWT(options.payload)
    .setProtectedHeader({ ...options.header, alg: 'ES256' })
    .sign(await importJWK(mockPrivateKey));
}

describe('UserTokenHandler', () => {
  let userTokenHandler: UserTokenHandler;

  const logger = mockServices.logger.mock();

  registerMswTestHooks(server);

  beforeEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();

    userTokenHandler = UserTokenHandler.create({
      discovery: mockServices.discovery(),
      logger,
    });

    server.use(
      rest.get(
        'http://localhost:0/api/auth/.well-known/jwks.json',
        (_req, res, ctx) =>
          res(
            ctx.json({
              keys: [mockPublicKey],
            }),
          ),
      ),
    );
  });

  describe('verifyToken', () => {
    it('should return undefined if token format or type is unknown', async () => {
      await expect(
        userTokenHandler.verifyToken('invalid-token'),
      ).resolves.toBeUndefined();

      await expect(
        userTokenHandler.verifyToken('a.b.c'),
      ).resolves.toBeUndefined();

      await expect(
        userTokenHandler.verifyToken(
          await createToken({
            header: { typ: 'unknown' },
            payload: { sub: 'mock' },
            signature: 'sig',
          }),
        ),
      ).resolves.toBeUndefined();
    });

    it('should fail to verify tokens with invalid signatures', async () => {
      await expect(
        userTokenHandler.verifyToken(
          await createToken({
            header: {
              typ: 'vnd.backstage.user',
              alg: 'ES256',
              kid: mockPublicKey.kid,
            },
            payload: { sub: 'mock' },
            signature: 'sig',
          }),
        ),
      ).rejects.toThrow('Failed user token verification');

      await expect(
        userTokenHandler.verifyToken(
          await createToken({
            header: { alg: 'ES256', kid: mockPublicKey.kid },
            payload: { aud: 'backstage', sub: 'mock' },
            signature: 'sig',
          }),
        ),
      ).rejects.toThrow('Failed user token verification');
    });

    it('should fail to verify tokens that have a bad alg', async () => {
      const expectedIssuedAt = 1712071714;
      const expectedExpiresAt = 1712075314;

      jest.useFakeTimers({
        now: expectedIssuedAt * 1000 + 600_000,
      });

      const header = encodeData({
        typ: 'vnd.backstage.user',
        alg: 'none',
      });
      const payload = encodeData({
        iss: 'http://localhost:7007/api/auth',
        sub: 'user:development/guest',
        ent: ['user:development/guest', 'group:default/team-a'],
        aud: 'backstage',
        iat: expectedIssuedAt,
        exp: expectedExpiresAt,
        uip: 'proof',
      });
      const token = `${header}.${payload}.`;

      expect(logger.warn).not.toHaveBeenCalled();
      await expect(userTokenHandler.verifyToken(token)).rejects.toThrow(
        'Failed user token verification',
      );
      expect(logger.warn).toHaveBeenCalledWith(
        'Failed to verify incoming user token',
        expect.any(Error),
      );
    });

    it('should verify a valid legacy backstage token', async () => {
      const expectedIssuedAt = 1712071714;
      const expectedExpiresAt = 1712075314;

      jest.useFakeTimers({
        now: expectedIssuedAt * 1000 + 600_000,
      });

      const parts = {
        header: {
          alg: 'ES256',
          kid: mockPublicKey.kid,
        },
        payload: {
          iss: 'http://localhost:7007/api/auth',
          sub: 'user:development/guest',
          ent: ['user:development/guest', 'group:default/team-a'],
          aud: 'backstage',
          iat: expectedIssuedAt,
          exp: expectedExpiresAt,
        },
      };

      const token = await createToken(parts);
      await expect(userTokenHandler.verifyToken(token)).resolves.toEqual({
        userEntityRef: parts.payload.sub,
      });
    });

    it('should fail to verify when the sub claim is missing', async () => {
      const expectedIssuedAt = 1712071714;
      const expectedExpiresAt = 1712075314;

      jest.useFakeTimers({
        now: expectedIssuedAt * 1000 + 600_000,
      });

      const parts = {
        header: {
          alg: 'ES256',
          kid: mockPublicKey.kid,
        },
        payload: {
          iss: 'http://localhost:7007/api/auth',
          ent: ['user:development/guest', 'group:default/team-a'],
          aud: 'backstage',
          iat: expectedIssuedAt,
          exp: expectedExpiresAt,
        },
      };

      const token = await createToken(parts);
      await expect(userTokenHandler.verifyToken(token)).rejects.toThrow(
        'No user sub found in token',
      );
    });

    it('should verify a valid user token', async () => {
      const expectedIssuedAt = 1712071714;
      const expectedExpiresAt = 1712075314;

      jest.useFakeTimers({
        now: expectedIssuedAt * 1000 + 600_000,
      });

      const parts = {
        header: {
          typ: 'vnd.backstage.user',
          alg: 'ES256',
          kid: mockPublicKey.kid,
        },
        payload: {
          iss: 'http://localhost:7007/api/auth',
          sub: 'user:development/guest',
          ent: ['user:development/guest', 'group:default/team-a'],
          aud: 'backstage',
          iat: expectedIssuedAt,
          exp: expectedExpiresAt,
          uip: 'proof',
        },
      };

      const token = await createToken(parts);

      await expect(userTokenHandler.verifyToken(token)).resolves.toEqual({
        userEntityRef: parts.payload.sub,
      });
    });

    it('should verify a valid limited user token', async () => {
      const expectedIssuedAt = 1712071714;
      const expectedExpiresAt = 1712075314;

      jest.useFakeTimers({
        now: expectedIssuedAt * 1000 + 600_000,
      });

      const parts = {
        header: {
          typ: 'vnd.backstage.limited-user',
          alg: 'ES256',
          kid: mockPublicKey.kid,
        },
        payload: {
          sub: 'user:development/guest',
          ent: ['user:development/guest', 'group:default/team-a'],
          iat: expectedIssuedAt,
          exp: expectedExpiresAt,
        },
      };

      const token = await createToken(parts);

      await expect(userTokenHandler.verifyToken(token)).resolves.toEqual({
        userEntityRef: parts.payload.sub,
      });
    });
  });

  describe('createLimitedUserToken', () => {
    it('should return the original token if it a legacy backstage token', async () => {
      const backstageToken = await createToken({
        // Without header.typ param
        header: { alg: 'ES256' },
        payload: {},
      });
      const result = userTokenHandler.createLimitedUserToken(backstageToken);
      expect(result).toEqual({
        token: backstageToken,
        expiresAt: expect.any(Date),
      });
    });

    it('should return the original token if it is already a limited user token', async () => {
      const backstageToken = await createToken({
        header: { typ: 'vnd.backstage.user', alg: 'ES256' },
        payload: { sub: 'mock', uip: 'proof' },
        signature: 'some-signature',
      });
      const result = userTokenHandler.createLimitedUserToken(backstageToken);
      expect(result).toEqual({
        token: await createToken({
          header: { typ: 'vnd.backstage.limited-user', alg: 'ES256' },
          payload: { sub: 'mock' },
          signature: 'proof',
        }),
        expiresAt: expect.any(Date),
      });
    });

    it('should throw an AuthenticationError if the token type is invalid', async () => {
      const backstageToken = await createToken({
        header: { typ: 'invalid' },
        payload: {},
      });

      expect(() => {
        userTokenHandler.createLimitedUserToken(backstageToken);
      }).toThrow(
        new AuthenticationError(
          'Failed to create limited user token, invalid token type',
        ),
      );
    });

    it('should create a limited user token from a user token', async () => {
      const backstageToken = await createToken({
        header: { typ: 'vnd.backstage.user', alg: 'ES256' },
        payload: {
          aud: 'backstage',
          sub: 'mock',
          ent: ['mock'],
          iat: 1,
          exp: 2,
          uip: 'proof',
        },
        signature: 'sig',
      });

      const result = userTokenHandler.createLimitedUserToken(backstageToken);
      expect(result).toEqual({
        token: await createToken({
          header: { typ: 'vnd.backstage.limited-user', alg: 'ES256' },
          payload: {
            sub: 'mock',
            iat: 1,
            exp: 2,
          },
          signature: 'proof',
        }),
        expiresAt: expect.any(Date),
      });
    });

    it('should create limited token that can be verified', async () => {
      jest.useFakeTimers({
        now: 1712071714 * 1000 + 600_000,
      });
      const parts = {
        header: {
          typ: 'vnd.backstage.user',
          alg: 'ES256',
          kid: mockPublicKey.kid,
        },
        payload: {
          iss: 'http://localhost:7007/api/auth',
          sub: 'user:development/guest',
          ent: ['user:development/guest', 'group:default/team-a'],
          aud: 'backstage',
          iat: 1712071714,
          exp: 1712075314,
          uip: '01AQB_IjGMtVsh2Zh3dH55xN_oiIYaCQw82cx6y3PP1yiN38xc31ZLKe4aSCBRSO-tr1sdU3OoD-LIa_-5_QUA',
        },
        signature: 'sig',
      };

      const {
        signatures: [{ signature: uip }],
      } = await new GeneralSign(
        new TextEncoder().encode(
          JSON.stringify({
            sub: parts.payload.sub,
            iat: parts.payload.iat,
            exp: parts.payload.exp,
          }),
        ),
      )
        .addSignature(await importJWK(mockPrivateKey))
        .setProtectedHeader({
          ...parts.header,
          typ: 'vnd.backstage.limited-user',
        })
        .done()
        .sign();

      parts.payload.uip = uip;
      const token = await createToken(parts);

      const result = userTokenHandler.createLimitedUserToken(token);
      await expect(userTokenHandler.verifyToken(result.token)).resolves.toEqual(
        {
          userEntityRef: 'user:development/guest',
        },
      );
    });
  });
});
