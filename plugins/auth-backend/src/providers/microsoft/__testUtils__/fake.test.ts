/*
 * Copyright 2023 The Backstage Authors
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
import { FakeMicrosoftAPI } from './fake';

describe('FakeMicrosoftAPI', () => {
  const api = new FakeMicrosoftAPI();

  describe('#token', () => {
    it('exchanges auth codes', () => {
      const { access_token } = api.token(
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: api.generateAuthCode('User.Read'),
        }),
      );

      expect(api.tokenHasScope(access_token, 'User.Read')).toBe(true);
    });

    it('supports scopes for the first requested audience only', () => {
      const { access_token } = api.token(
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: api.generateAuthCode('someaudience/somescope User.Read'),
        }),
      );

      expect(api.tokenHasScope(access_token, 'User.Read')).toBe(false);
    });

    it('special openid scopes do not count towards the 1-audience limit', () => {
      const { access_token } = api.token(
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: api.generateAuthCode('openid offline_access User.Read'),
        }),
      );

      expect(api.tokenHasScope(access_token, 'User.Read')).toBe(true);
    });

    it('refreshes tokens', () => {
      const { access_token } = api.token(
        new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: api.generateRefreshToken(
            'email openid profile User.Read',
          ),
        }),
      );

      expect(
        api.tokenHasScope(access_token, 'email openid profile User.Read'),
      ).toBe(true);
    });
    it('requires `openid` scope for ID token', () => {
      const { id_token } = api.token(
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: api.generateAuthCode('User.Read'),
        }),
      );

      expect(id_token).toBeUndefined();
    });
    it('requires `offline_access` scope for refresh token', () => {
      const { refresh_token } = api.token(
        new URLSearchParams({
          grant_type: 'authorization_code',
          code: api.generateAuthCode('User.Read'),
        }),
      );

      expect(refresh_token).toBeUndefined();
    });
  });
});
