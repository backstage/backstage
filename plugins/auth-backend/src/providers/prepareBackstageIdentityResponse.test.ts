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
  it('parses a complete token to determine the identity', () => {
    const token = mkToken({ sub: 'k:ns/n', ent: ['k:ns/o'] });
    expect(
      prepareBackstageIdentityResponse({
        id: 'x',
        token,
      }),
    ).toEqual({
      id: 'x',
      token,
      idToken: token,
      identity: {
        type: 'user',
        userEntityRef: 'k:ns/n',
        ownershipEntityRefs: ['k:ns/o'],
      },
    });
  });

  it('populates incomplete identities', () => {
    expect(
      prepareBackstageIdentityResponse({
        id: 'x',
        token: mkToken({ sub: 'n' }),
      }),
    ).toEqual({
      id: 'x',
      token: expect.any(String),
      idToken: expect.any(String),
      identity: {
        type: 'user',
        userEntityRef: 'user:default/n',
        ownershipEntityRefs: [],
      },
    });
    expect(
      prepareBackstageIdentityResponse({
        id: 'x',
        token: mkToken({ sub: 'k:n' }),
      }),
    ).toEqual({
      id: 'x',
      token: expect.any(String),
      idToken: expect.any(String),
      identity: {
        type: 'user',
        userEntityRef: 'k:default/n',
        ownershipEntityRefs: [],
      },
    });
    expect(
      prepareBackstageIdentityResponse({
        id: 'x',
        token: mkToken({ sub: 'ns/n' }),
      }),
    ).toEqual({
      id: 'x',
      token: expect.any(String),
      idToken: expect.any(String),
      identity: {
        type: 'user',
        userEntityRef: 'user:ns/n',
        ownershipEntityRefs: [],
      },
    });
    expect(
      prepareBackstageIdentityResponse({
        id: 'x',
        token: mkToken({ sub: 'n', ent: ['k:ns/o'] }),
      }),
    ).toEqual({
      id: 'x',
      token: expect.any(String),
      idToken: expect.any(String),
      identity: {
        type: 'user',
        userEntityRef: 'user:default/n',
        ownershipEntityRefs: ['k:ns/o'],
      },
    });
  });
});
