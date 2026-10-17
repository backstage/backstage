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
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { AuthenticationError } from '@backstage/errors';
import { SignJWT, GeneralSign, importJWK, base64url } from 'jose';
import { BackstageUserIdentityContext } from '@backstage/backend-plugin-api';
import { tokenTypes } from '@backstage/plugin-auth-node';

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

async function createIdentityContextUserToken(options: {
  identityContext?: BackstageUserIdentityContext;
  proofIdentityContext: BackstageUserIdentityContext;
  iat?: number;
  exp?: number;
}) {
  const iat = options.iat ?? 1712071714;
  const exp = options.exp ?? 1712075314;
  const sub = 'user:development/guest';
  const proofPayload = {
    sub,
    iat,
    exp,
    [tokenTypes.user.identityContextClaim]: options.proofIdentityContext,
  };
  const {
    signatures: [{ signature }],
  } = await new GeneralSign(
    new TextEncoder().encode(JSON.stringify(proofPayload)),
  )
    .addSignature(await importJWK(mockPrivateKey))
    .setProtectedHeader({
      typ: tokenTypes.limitedUser.typParam,
      alg: 'ES256',
      kid: mockPublicKey.kid,
    })
    .done()
    .sign();

  return createToken({
    header: {
      typ: tokenTypes.user.typParam,
      alg: 'ES256',
      kid: mockPublicKey.kid,
    },
    payload: {
      iss: 'http://localhost:7007/api/auth',
      sub,
      ent: [sub],
      aud: tokenTypes.user.audClaim,
      iat,
      exp,
      ...(options.identityContext && {
        [tokenTypes.user.identityContextClaim]: options.identityContext,
      }),
      uip: signature,
    },
  });
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
      http.get('http://localhost:0/api/auth/.well-known/jwks.json', () =>
        HttpResponse.json({
          keys: [mockPublicKey],
        }),
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

    it('should verify identity context that is bound to the user proof', async () => {
      jest.useFakeTimers({ now: 1712072314 * 1000 });
      const organizationIdentityContext: BackstageUserIdentityContext = {
        issuer: 'https://portal.example.com/',
        attributes: {
          profile: 'organization',
          profileId: 'org_a',
          region: 'eu',
        },
      };
      const token = await createIdentityContextUserToken({
        identityContext: organizationIdentityContext,
        proofIdentityContext: organizationIdentityContext,
      });

      await expect(userTokenHandler.verifyToken(token)).resolves.toEqual({
        userEntityRef: 'user:development/guest',
        identityContext: organizationIdentityContext,
      });
    });

    it('should reject changed identity context', async () => {
      jest.useFakeTimers({ now: 1712072314 * 1000 });
      const proofIdentityContext: BackstageUserIdentityContext = {
        issuer: 'https://portal.example.com/',
        attributes: { profile: 'organization', profileId: 'org_a' },
      };

      const changedToken = await createIdentityContextUserToken({
        identityContext: {
          ...proofIdentityContext,
          attributes: {
            ...proofIdentityContext.attributes,
            profileId: 'org_b',
          },
        },
        proofIdentityContext,
      });
      await expect(userTokenHandler.verifyToken(changedToken)).rejects.toThrow(
        'Failed user identity proof verification',
      );
    });

    it('should reject identity context that is only an outer claim', async () => {
      jest.useFakeTimers({ now: 1712072314 * 1000 });
      const token = await createToken({
        header: {
          typ: tokenTypes.user.typParam,
          kid: mockPublicKey.kid,
        },
        payload: {
          sub: 'user:development/guest',
          aud: tokenTypes.user.audClaim,
          iat: 1712071714,
          exp: 1712075314,
          uip: 'legacy-proof',
          [tokenTypes.user.identityContextClaim]: {
            issuer: 'https://portal.example.com/',
            attributes: { profileId: 'org_a' },
          },
        },
      });

      await expect(userTokenHandler.verifyToken(token)).rejects.toThrow(
        'Failed user identity proof verification',
      );
    });

    it('should reject malformed and oversized identity context', async () => {
      jest.useFakeTimers({ now: 1712072314 * 1000 });
      const basePayload = {
        sub: 'user:development/guest',
        iat: 1712071714,
        exp: 1712075314,
      };

      for (const identityContext of [
        { issuer: '', attributes: { profileId: 'user_a' } },
        {
          issuer: 'https://portal.example.com/',
          attributes: { profileId: 1 },
        },
        {
          issuer: 'https://portal.example.com/',
          attributes: { profileId: 'a'.repeat(2048) },
        },
      ]) {
        const token = await createToken({
          header: {
            typ: tokenTypes.limitedUser.typParam,
            kid: mockPublicKey.kid,
          },
          payload: {
            ...basePayload,
            [tokenTypes.user.identityContextClaim]: identityContext,
          },
        });
        await expect(userTokenHandler.verifyToken(token)).rejects.toThrow(
          /identity context/i,
        );
      }
    });

    it('should reject expired identity context credentials', async () => {
      jest.useFakeTimers({ now: 1712075315 * 1000 });
      const identityContext: BackstageUserIdentityContext = {
        issuer: 'https://portal.example.com/',
        attributes: { profile: 'personal', profileId: 'auth0|user-a' },
      };
      const token = await createIdentityContextUserToken({
        identityContext,
        proofIdentityContext: identityContext,
      });

      await expect(userTokenHandler.verifyToken(token)).rejects.toThrow(
        'Failed user token verification',
      );
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

    it('should throw if payload.uip is missing', async () => {
      const backstageToken = await createToken({
        header: { typ: 'vnd.backstage.user', alg: 'ES256' },
        payload: {
          aud: 'backstage',
          sub: 'mock',
          ent: ['mock'],
          iat: 1,
          exp: 2,
        },
      });

      expect(() =>
        userTokenHandler.createLimitedUserToken(backstageToken),
      ).toThrow(
        new AuthenticationError(
          'Failed to create limited user token, missing user identity proof',
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

    it('should create a verifiable context-bound limited token', async () => {
      jest.useFakeTimers({ now: 1712072314 * 1000 });
      const identityContext: BackstageUserIdentityContext = {
        issuer: 'https://portal.example.com/',
        attributes: { profile: 'personal', profileId: 'auth0|user-a' },
      };
      const userToken = await createIdentityContextUserToken({
        identityContext,
        proofIdentityContext: identityContext,
      });

      const result = userTokenHandler.createLimitedUserToken(userToken);
      await expect(userTokenHandler.verifyToken(result.token)).resolves.toEqual(
        {
          userEntityRef: 'user:development/guest',
          identityContext,
        },
      );
      expect(result.expiresAt).toEqual(new Date(1712075314 * 1000));
    });

    it('should reject a context proof reconstructed by a legacy delegator', async () => {
      jest.useFakeTimers({ now: 1712072314 * 1000 });
      const identityContext: BackstageUserIdentityContext = {
        issuer: 'https://portal.example.com/',
        attributes: { profile: 'organization', profileId: 'org_a' },
      };
      const userToken = await createIdentityContextUserToken({
        identityContext,
        proofIdentityContext: identityContext,
      });
      const [headerRaw, payloadRaw] = userToken.split('.');
      const header = JSON.parse(
        new TextDecoder().decode(base64url.decode(headerRaw)),
      );
      const payload = JSON.parse(
        new TextDecoder().decode(base64url.decode(payloadRaw)),
      );

      const legacyLimitedToken = [
        base64url.encode(
          JSON.stringify({
            typ: tokenTypes.limitedUser.typParam,
            alg: header.alg,
            kid: header.kid,
          }),
        ),
        base64url.encode(
          JSON.stringify({
            sub: payload.sub,
            iat: payload.iat,
            exp: payload.exp,
          }),
        ),
        String(payload.uip),
      ].join('.');

      await expect(
        userTokenHandler.verifyToken(legacyLimitedToken),
      ).rejects.toThrow('Failed user token verification');
    });

    it('should reject a non-string user identity proof', async () => {
      const token = await createToken({
        header: { typ: tokenTypes.user.typParam },
        payload: {
          sub: 'user:development/guest',
          iat: 1,
          exp: 2,
          uip: { signature: 'proof' },
        },
        signature: 'outer-signature',
      });
      expect(() => userTokenHandler.createLimitedUserToken(token)).toThrow(
        'invalid user identity proof',
      );
    });
  });
});
