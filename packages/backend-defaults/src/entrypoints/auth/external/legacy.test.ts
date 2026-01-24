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

import { ConfigReader } from '@backstage/config';
import { randomBytes } from 'crypto';
import { SignJWT, importJWK } from 'jose';
import { DateTime } from 'luxon';
import { legacyTokenHandler } from './legacy';

describe('LegacyTokenHandler', () => {
  const key1 = randomBytes(24);
  const key2 = randomBytes(24);
  const key3 = randomBytes(24);

  const tokenHandler = legacyTokenHandler;

  const context1 = tokenHandler.initialize({
    options: new ConfigReader({
      secret: key1.toString('base64'),
      subject: 'key1',
    }),
  });

  const context2 = tokenHandler.initialize({
    options: new ConfigReader({
      secret: key2.toString('base64'),
      subject: 'key2',
    }),
  });

  const contextWithLegacy = tokenHandler.initialize({
    options: new ConfigReader({
      secret: key3.toString('base64'),
    }),
    legacy: true,
  });

  it('should verify valid tokens', async () => {
    const token1 = await new SignJWT({
      sub: 'backstage-server',
      exp: DateTime.now().plus({ minutes: 1 }).toUnixInteger(),
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(key1);

    await expect(tokenHandler.verifyToken(token1, context1)).resolves.toEqual({
      subject: 'key1',
    });

    const token2 = await new SignJWT({
      sub: 'backstage-server',
      exp: DateTime.now().plus({ minutes: 1 }).toUnixInteger(),
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(key2);

    await expect(tokenHandler.verifyToken(token2, context2)).resolves.toEqual({
      subject: 'key2',
    });

    const token3 = await new SignJWT({
      sub: 'backstage-server',
      exp: DateTime.now().plus({ minutes: 1 }).toUnixInteger(),
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(key3);

    await expect(
      tokenHandler.verifyToken(token3, contextWithLegacy),
    ).resolves.toEqual({
      subject: 'external:backstage-plugin',
    });
  });

  it('should return undefined if the token is not a valid legacy token', async () => {
    const validToken = await new SignJWT({
      sub: 'backstage-serverrr',
      exp: DateTime.now().plus({ minutes: 1 }).toUnixInteger(),
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(key1);

    await expect(
      tokenHandler.verifyToken(validToken, context1),
    ).resolves.toBeUndefined();
    await expect(
      tokenHandler.verifyToken(validToken, context2),
    ).resolves.toBeUndefined();

    await expect(
      tokenHandler.verifyToken('statickeyblaaa', context1),
    ).resolves.toBeUndefined();
    await expect(
      tokenHandler.verifyToken('statickeyblaaa', context2),
    ).resolves.toBeUndefined();

    const randomToken = await new SignJWT({
      sub: 'backstage-server',
      exp: DateTime.now().plus({ minutes: 1 }).toUnixInteger(),
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(randomBytes(24));
    await expect(
      tokenHandler.verifyToken(randomToken, context1),
    ).resolves.toBeUndefined();
    await expect(
      tokenHandler.verifyToken(randomToken, context2),
    ).resolves.toBeUndefined();

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

    const keyWithWrongAlg = await new SignJWT({
      sub: 'backstage-server',
      exp: DateTime.now().plus({ minutes: 1 }).toUnixInteger(),
    })
      .setProtectedHeader({ alg: 'ES256' })
      .sign(await importJWK(mockPrivateKey));

    await expect(
      tokenHandler.verifyToken(keyWithWrongAlg, context1),
    ).resolves.toBeUndefined();
    await expect(
      tokenHandler.verifyToken(keyWithWrongAlg, context2),
    ).resolves.toBeUndefined();
  });

  it('should throw in case key uses a different payload', async () => {
    const keyWithWrongExp = await new SignJWT({
      sub: 'backstage-server',
      // @ts-expect-error
      exp: 'blaaah',
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(key1);

    await expect(
      tokenHandler.verifyToken(keyWithWrongExp, context1),
    ).rejects.toThrow(/\"exp\" claim must be a number/);
  });

  it('rejects bad config', () => {
    const handler = legacyTokenHandler;

    // new style add, bad secrets
    expect(() =>
      handler.initialize({
        options: new ConfigReader({
          _missingsecret: true,
          subject: 'ok',
        }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Missing required config value at 'secret' in 'mock-config'"`,
    );
    expect(() =>
      handler.initialize({
        options: new ConfigReader({ secret: '', subject: 'ok' }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'secret' in 'mock-config', got empty-string, wanted string"`,
    );
    expect(() =>
      handler.initialize({
        options: new ConfigReader({
          secret: 'has spaces',
          subject: 'ok',
        }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Illegal secret, must be a valid base64 string"`,
    );
    expect(() =>
      handler.initialize({
        options: new ConfigReader({
          secret: 'hasnewline\n',
          subject: 'ok',
        }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Illegal secret, must be a valid base64 string"`,
    );
    expect(() =>
      handler.initialize({
        options: new ConfigReader({ secret: 3, subject: 'ok' }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'secret' in 'mock-config', got number, wanted string"`,
    );

    // new style add, bad subjects
    expect(() =>
      handler.initialize({
        options: new ConfigReader({
          secret: 'b2s=',
          _missingsubject: true,
        }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Missing required config value at 'subject' in 'mock-config'"`,
    );
    expect(() =>
      handler.initialize({
        options: new ConfigReader({ secret: 'b2s=', subject: '' }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'subject' in 'mock-config', got empty-string, wanted string"`,
    );
    expect(() =>
      handler.initialize({
        options: new ConfigReader({
          secret: 'b2s=',
          subject: 'has spaces',
        }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Illegal subject, must be a set of non-space characters"`,
    );
    expect(() =>
      handler.initialize({
        options: new ConfigReader({
          secret: 'b2s=',
          subject: 'hasnewline\n',
        }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Illegal subject, must be a set of non-space characters"`,
    );
    expect(() =>
      handler.initialize({
        options: new ConfigReader({ secret: 'b2s=', subject: 3 }),
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'subject' in 'mock-config', got number, wanted string"`,
    );

    // old style add
    expect(() =>
      handler.initialize({
        options: new ConfigReader({ secret: 'b2s=' }),
        legacy: true,
      }),
    ).not.toThrow();

    expect(() =>
      handler.initialize({
        options: new ConfigReader({ _missingsecret: true }),
        legacy: true,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Missing required config value at 'secret' in 'mock-config'"`,
    );
    expect(() =>
      handler.initialize({
        options: new ConfigReader({ secret: '' }),
        legacy: true,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'secret' in 'mock-config', got empty-string, wanted string"`,
    );
    expect(() =>
      handler.initialize({
        options: new ConfigReader({ secret: 'has spaces' }),
        legacy: true,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Illegal secret, must be a valid base64 string"`,
    );
    expect(() =>
      handler.initialize({
        options: new ConfigReader({ secret: 'hasnewline\n' }),
        legacy: true,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Illegal secret, must be a valid base64 string"`,
    );
    expect(() =>
      handler.initialize({
        options: new ConfigReader({ secret: 3 }),
        legacy: true,
      }),
    ).toThrowErrorMatchingInlineSnapshot(
      `"Invalid type in config for key 'secret' in 'mock-config', got number, wanted string"`,
    );
  });
});
