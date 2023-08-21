/*
 * Copyright 2020 The Backstage Authors
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

import { prepareBackstageIdentityResponse } from './prepareBackstageIdentityResponse';

function mkToken(payload: unknown) {
  return `a.${Buffer.from(JSON.stringify(payload), 'utf8').toString(
    'base64',
  )}.z`;
}

describe('prepareBackstageIdentityResponse', () => {
  afterEach(jest.resetAllMocks);

  it('parses a complete token to determine the identity', () => {
    jest.spyOn(Date, 'now').mockReturnValue(5000);

    const token = mkToken({ sub: 'k:ns/n', ent: ['k:ns/o'], exp: 1005 });
    expect(
      prepareBackstageIdentityResponse({
        token,
      }),
    ).toEqual({
      token,
      expiresInSeconds: 1000,
      identity: {
        type: 'user',
        userEntityRef: 'k:ns/n',
        ownershipEntityRefs: ['k:ns/o'],
      },
    });
  });

  it('should reject tokens without subject', () => {
    const token = mkToken({});
    expect(() =>
      prepareBackstageIdentityResponse({
        token,
      }),
    ).toThrow('Identity response must return a token with subject claim');
  });

  it('should treat expiration as optional', () => {
    const token = mkToken({ sub: 'k:ns/n', ent: ['k:ns/o'] });
    expect(
      prepareBackstageIdentityResponse({
        token,
      }),
    ).toEqual({
      token,
      identity: {
        type: 'user',
        userEntityRef: 'k:ns/n',
        ownershipEntityRefs: ['k:ns/o'],
      },
    });
  });

  it('should reject tokens with negative expiration', () => {
    jest.spyOn(Date, 'now').mockReturnValue(5000);

    const token = mkToken({ sub: 'k:ns/n', ent: ['k:ns/o'], exp: 1 });
    expect(() =>
      prepareBackstageIdentityResponse({
        token,
      }),
    ).toThrow('Identity response must not return an expired token');
  });
});
