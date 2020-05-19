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

import GoogleScopes from './GoogleScopes';

const PREFIX = 'https://www.googleapis.com/auth/';

describe('GoogleScopes', () => {
  it('should be created from scopes', () => {
    const scopes = GoogleScopes.from('a openid b profile');
    expect(scopes.toString()).toBe(
      `${PREFIX}a openid ${PREFIX}b ${PREFIX}userinfo.profile`,
    );
  });

  it('should be created with default scopes', () => {
    expect(GoogleScopes.default().toString()).toBe(
      `openid ${PREFIX}userinfo.email ${PREFIX}userinfo.profile`,
    );
  });

  it('should have or not have scopes', () => {
    const scopes = GoogleScopes.from(`a b ${PREFIX}c`);
    expect(scopes.hasScopes('a')).toBe(true);
    expect(scopes.hasScopes('a b')).toBe(true);
    expect(scopes.hasScopes('b')).toBe(true);
    expect(scopes.hasScopes('b c')).toBe(true);
    expect(scopes.hasScopes('a b c')).toBe(true);
    expect(scopes.hasScopes(`a b ${PREFIX}c`)).toBe(true);
    expect(scopes.hasScopes(`a ${PREFIX}b c`)).toBe(true);
    expect(scopes.hasScopes('a b c d')).toBe(false);
    expect(scopes.hasScopes('d')).toBe(false);
    expect(scopes.hasScopes('')).toBe(true);
    expect(scopes.hasScopes('abc')).toBe(false);
    expect(scopes.hasScopes(`${PREFIX}a`)).toBe(true);
  });

  it('should handle scope shorthands correctly', () => {
    const scopes = GoogleScopes.default();
    expect(scopes.hasScopes('email')).toBe(true);
    expect(scopes.hasScopes('profile')).toBe(true);
    expect(scopes.hasScopes('openid')).toBe(true);
    expect(scopes.hasScopes('userinfo.email')).toBe(true);
    expect(scopes.hasScopes('userinfo.profile')).toBe(true);
    expect(scopes.hasScopes('userinfo.openid')).toBe(false);
    expect(scopes.hasScopes(`${PREFIX}userinfo.email`)).toBe(true);
    expect(scopes.hasScopes(`${PREFIX}userinfo.profile`)).toBe(true);
    expect(scopes.hasScopes(`${PREFIX}userinfo.openid`)).toBe(false);
    expect(scopes.hasScopes(`${PREFIX}email`)).toBe(false);
    expect(scopes.hasScopes(`${PREFIX}profile`)).toBe(false);
    expect(scopes.hasScopes(`${PREFIX}openid`)).toBe(false);
  });

  it('should be extended', () => {
    const scopes = GoogleScopes.from('a b');
    expect(scopes.extend('')).not.toBe(scopes);
    expect(scopes.extend('d').toString()).toBe(
      `${PREFIX}a ${PREFIX}b ${PREFIX}d`,
    );
    expect(scopes.extend('profile').toString()).toBe(
      `${PREFIX}a ${PREFIX}b ${PREFIX}userinfo.profile`,
    );
    expect(scopes.extend('d profile').toString()).toBe(
      `${PREFIX}a ${PREFIX}b ${PREFIX}d ${PREFIX}userinfo.profile`,
    );
    expect(scopes.extend(`${PREFIX}d profile`).toString()).toBe(
      `${PREFIX}a ${PREFIX}b ${PREFIX}d ${PREFIX}userinfo.profile`,
    );
    expect(scopes.extend('a').toString()).toBe(scopes.toString());
    expect(scopes.extend('').toString()).toBe(scopes.toString());
    expect(scopes.extend('b').toString()).toBe(scopes.toString());
    expect(scopes.extend('b a').toString()).toBe(scopes.toString());
    expect(scopes.extend('b a b a a').toString()).toBe(scopes.toString());
  });
});
