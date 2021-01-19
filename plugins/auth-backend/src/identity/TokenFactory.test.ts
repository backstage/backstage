/*
 * Copyright 2020 Spotify AB
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
import { TextDecoder, TextEncoder } from 'util';

// These two statements are structured like this because Jest doesn't include these in the default
// test environment, even though they exist in Node.
global.TextEncoder = TextEncoder;
// @ts-ignore
global.TextDecoder = TextDecoder;

import { utc } from 'moment';
import { TokenFactory } from './TokenFactory';
import { getVoidLogger } from '@backstage/backend-common';
import { AnyJWK, KeyStore, StoredKey } from './types';
import jwtVerify from 'jose/jwt/verify';
import parseJwk from 'jose/jwk/parse';
import decodeProtectedHeader, {
  ProtectedHeaderParameters,
} from 'jose/util/decode_protected_header';

const logger = getVoidLogger();

class MemoryKeyStore implements KeyStore {
  private readonly keys = new Map<
    string,
    { createdAt: moment.Moment; key: string }
  >();

  async addKey(key: AnyJWK): Promise<void> {
    this.keys.set(key.kid, {
      createdAt: utc(),
      key: JSON.stringify(key),
    });
  }

  async removeKeys(kids: string[]): Promise<void> {
    for (const kid of kids) {
      this.keys.delete(kid);
    }
  }

  async listKeys(): Promise<{ items: StoredKey[] }> {
    return {
      items: Array.from(this.keys).map(([, { createdAt, key: keyStr }]) => ({
        createdAt,
        key: JSON.parse(keyStr),
      })),
    };
  }
}

function jwtKid(jwt: string): string {
  const header = decodeProtectedHeader(jwt) as ProtectedHeaderParameters;
  return header.kid as string;
}

describe('TokenFactory', () => {
  it('should issue valid tokens signed by a listed key', async () => {
    const keyDurationSeconds = 5;
    const factory = new TokenFactory({
      issuer: 'my-issuer',
      keyStore: new MemoryKeyStore(),
      keyDurationSeconds,
      logger,
    });

    await expect(factory.listPublicKeys()).resolves.toEqual({ keys: [] });
    const token = await factory.issueToken({ claims: { sub: 'foo' } });

    const { keys } = await factory.listPublicKeys();
    const keyMap = Object.fromEntries(keys.map(key => [key.kid, key]));

    const payload = (
      await jwtVerify(token, async header => {
        const kid = header.kid as string;
        return await parseJwk(keyMap[kid]);
      })
    ).payload;
    expect(payload).toEqual({
      iss: 'my-issuer',
      aud: 'backstage',
      sub: 'foo',
      iat: expect.any(Number),
      exp: expect.any(Number),
    });
    expect(payload.exp).toBe(Number(payload.iat) + keyDurationSeconds);
  });

  it('should generate new signing keys when the current one expires', async () => {
    const fixedTime = Date.now();
    jest.spyOn(Date, 'now').mockImplementation(() => fixedTime);

    const factory = new TokenFactory({
      issuer: 'my-issuer',
      keyStore: new MemoryKeyStore(),
      keyDurationSeconds: 5,
      logger,
    });

    const token1 = await factory.issueToken({ claims: { sub: 'foo' } });
    const token2 = await factory.issueToken({ claims: { sub: 'foo' } });
    expect(jwtKid(token1)).toBe(jwtKid(token2));

    await expect(factory.listPublicKeys()).resolves.toEqual({
      keys: [
        expect.objectContaining({
          kid: jwtKid(token1),
        }),
      ],
    });

    jest.spyOn(Date, 'now').mockImplementation(() => fixedTime + 60000);

    await expect(factory.listPublicKeys()).resolves.toEqual({
      keys: [],
    });

    const token3 = await factory.issueToken({ claims: { sub: 'foo' } });
    expect(jwtKid(token3)).not.toBe(jwtKid(token2));

    await expect(factory.listPublicKeys()).resolves.toEqual({
      keys: [
        expect.objectContaining({
          kid: jwtKid(token3),
        }),
      ],
    });
  });
});
