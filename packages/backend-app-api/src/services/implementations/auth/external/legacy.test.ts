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
import { LegacyTokenHandler } from './legacy';

describe('LegacyTokenHandler', () => {
  const tokenHandler = new LegacyTokenHandler();
  const key1 = randomBytes(24);
  const key2 = randomBytes(24);
  const key3 = randomBytes(24);

  tokenHandler.add(
    new ConfigReader({
      secret: key1.toString('base64'),
      subject: 'key1',
    }),
  );
  tokenHandler.add(
    new ConfigReader({
      secret: key2.toString('base64'),
      subject: 'key2',
    }),
  );
  tokenHandler.addOld(
    new ConfigReader({
      secret: key3.toString('base64'),
    }),
  );

  it('should verify valid tokens', async () => {
    const token1 = await new SignJWT({
      sub: 'backstage-server',
      exp: DateTime.now().plus({ minutes: 1 }).toUnixInteger(),
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(key1);

    await expect(tokenHandler.verifyToken(token1)).resolves.toEqual({
      subject: 'key1',
    });

    const token2 = await new SignJWT({
      sub: 'backstage-server',
      exp: DateTime.now().plus({ minutes: 1 }).toUnixInteger(),
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(key2);

    await expect(tokenHandler.verifyToken(token2)).resolves.toEqual({
      subject: 'key2',
    });

    const token3 = await new SignJWT({
      sub: 'backstage-server',
      exp: DateTime.now().plus({ minutes: 1 }).toUnixInteger(),
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(key3);

    await expect(tokenHandler.verifyToken(token3)).resolves.toEqual({
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

    await expect(tokenHandler.verifyToken(validToken)).resolves.toBeUndefined();

    await expect(
      tokenHandler.verifyToken('statickeyblaaa'),
    ).resolves.toBeUndefined();

    const randomToken = await new SignJWT({
      sub: 'backstage-server',
      exp: DateTime.now().plus({ minutes: 1 }).toUnixInteger(),
    })
      .setProtectedHeader({ alg: 'HS256' })
      .sign(randomBytes(24));
    await expect(
      tokenHandler.verifyToken(randomToken),
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
      tokenHandler.verifyToken(keyWithWrongAlg),
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

    await expect(tokenHandler.verifyToken(keyWithWrongExp)).rejects.toThrow(
      /\"exp\" claim must be a number/,
    );
  });

  it('rejects bad config', () => {
    const handler = new LegacyTokenHandler();

    // new style add, bad secrets
    expect(() =>
      handler.add(new ConfigReader({ _missingsecret: true, subject: 'ok' })),
    ).toThrow(/secret/);
    expect(() =>
      handler.add(new ConfigReader({ secret: '', subject: 'ok' })),
    ).toThrow(/secret/);
    expect(() =>
      handler.add(new ConfigReader({ secret: 'has spaces', subject: 'ok' })),
    ).toThrow(/secret/);
    expect(() =>
      handler.add(new ConfigReader({ secret: 'hasnewline\n', subject: 'ok' })),
    ).toThrow(/secret/);
    expect(() =>
      handler.add(new ConfigReader({ secret: 3, subject: 'ok' })),
    ).toThrow(/secret/);

    // new style add, bad subjects
    expect(() =>
      handler.add(new ConfigReader({ secret: 'b2s=', _missingsubject: true })),
    ).toThrow(/subject/);
    expect(() =>
      handler.add(new ConfigReader({ secret: 'b2s=', subject: '' })),
    ).toThrow(/subject/);
    expect(() =>
      handler.add(new ConfigReader({ secret: 'b2s=', subject: 'has spaces' })),
    ).toThrow(/subject/);
    expect(() =>
      handler.add(
        new ConfigReader({ secret: 'b2s=', subject: 'hasnewline\n' }),
      ),
    ).toThrow(/subject/);
    expect(() =>
      handler.add(new ConfigReader({ secret: 'b2s=', subject: 3 })),
    ).toThrow(/subject/);

    // old style add
    expect(() =>
      handler.addOld(new ConfigReader({ secret: 'b2s=' })),
    ).not.toThrow();
    expect(() =>
      handler.addOld(new ConfigReader({ _missingsecret: true })),
    ).toThrow(/secret/);
    expect(() => handler.addOld(new ConfigReader({ secret: '' }))).toThrow(
      /secret/,
    );
    expect(() =>
      handler.addOld(new ConfigReader({ secret: 'has spaces' })),
    ).toThrow(/secret/);
    expect(() =>
      handler.addOld(new ConfigReader({ secret: 'hasnewline\n' })),
    ).toThrow(/secret/);
    expect(() => handler.addOld(new ConfigReader({ secret: 3 }))).toThrow(
      /secret/,
    );
  });
});
