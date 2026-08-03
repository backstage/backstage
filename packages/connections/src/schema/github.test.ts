/*
 * Copyright 2026 The Backstage Authors
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
import { GithubConnectionType } from './github';

const app = (appId: number, orgs?: string[]) => ({
  method: 'app' as const,
  title: 'GitHub App',
  appId,
  privateKey: 'private-key',
  clientId: 'client-id',
  clientSecret: 'client-secret',
  orgs,
});

describe('GithubConnectionType', () => {
  describe('matchAuth', () => {
    it('selects an app matching the organization', () => {
      const unrestricted = app(3);
      const first = app(1, ['first']);
      const second = app(2, ['second']);

      expect(
        GithubConnectionType.matchAuth?.(
          [unrestricted, first, second],
          'https://github.com/second/repository',
        ),
      ).toBe(second);
    });

    it('falls back to an unrestricted app when the organization does not match', () => {
      const unrestricted = app(3);
      const token = {
        method: 'token' as const,
        title: 'Token',
        token: 'token',
      };

      expect(
        GithubConnectionType.matchAuth?.(
          [app(1, ['first']), token, unrestricted, app(2, ['second'])],
          'https://github.com/example/repository',
        ),
      ).toBe(unrestricted);
    });

    it('treats an app with no organizations as unrestricted', () => {
      const unrestricted = app(3, []);

      expect(
        GithubConnectionType.matchAuth?.(
          [app(1, ['first']), unrestricted],
          'https://github.com/example/repository',
        ),
      ).toBe(unrestricted);
    });

    it('falls back to the only app when the organization does not match', () => {
      const onlyApp = app(1, ['another-org']);
      const token = {
        method: 'token' as const,
        title: 'Token',
        token: 'token',
      };

      expect(
        GithubConnectionType.matchAuth?.(
          [onlyApp, token],
          'https://github.com/example/repository',
        ),
      ).toBe(onlyApp);
    });

    it('falls back to a token when multiple apps do not match', () => {
      const token = {
        method: 'token' as const,
        title: 'Token',
        token: 'token',
      };

      expect(
        GithubConnectionType.matchAuth?.(
          [app(1, ['first']), app(2, ['second']), token],
          'https://github.com/example/repository',
        ),
      ).toBe(token);
    });
  });
});
