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
import { mockServices } from '@backstage/backend-test-utils';
import { combineConnectionSources } from './combineConnectionSources';
import { RootConnection } from '../api/Connection';

const githubTokenAuth = (token: string) =>
  ({ method: 'token', token } as unknown as RootConnection['auth'][number]);

const githubAppAuth = (appId: number) =>
  ({
    method: 'app',
    appId,
    privateKey: `pk-${appId}`,
    clientId: `client-${appId}`,
    clientSecret: `secret-${appId}`,
  } as unknown as RootConnection['auth'][number]);

const connection = (
  type: string,
  host: string,
  auth: RootConnection['auth'],
  extras: Partial<RootConnection> = {},
): RootConnection =>
  ({
    type,
    host,
    auth,
    ...extras,
  } as unknown as RootConnection);

describe('combineConnectionSources', () => {
  let logger: ReturnType<typeof mockServices.logger.mock>;

  beforeEach(() => {
    logger = mockServices.logger.mock();
  });

  it('returns an empty array when both inputs are empty', () => {
    expect(combineConnectionSources([], [], logger)).toEqual([]);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('passes through legacy entries when no connections config is present', () => {
    const legacy = [
      connection('github', 'github.com', [githubTokenAuth('lt')]),
    ];

    const result = combineConnectionSources(legacy, [], logger);

    expect(result).toEqual(legacy);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('passes through connections entries when no legacy entries are present', () => {
    const fromConfig = [
      connection('github', 'enterprise.example.com', [githubTokenAuth('ct')]),
    ];

    const result = combineConnectionSources([], fromConfig, logger);

    expect(result).toEqual(fromConfig);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('keeps legacy and connections entries side by side when types do not overlap', () => {
    const legacy = [
      connection('github', 'github.com', [githubTokenAuth('lt')]),
    ];
    const fromConfig = [
      connection('gitlab', 'gitlab.com', [githubTokenAuth('ct')]),
    ];

    const result = combineConnectionSources(legacy, fromConfig, logger);

    expect(result.map(c => c.type).sort()).toEqual(['github', 'gitlab']);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('discards every legacy entry of a type when any connections entry has the same type', () => {
    const legacy = [
      connection('github', 'github.com', [githubTokenAuth('legacy-public')]),
      connection('github', 'enterprise.example.com', [githubAppAuth(1)]),
      connection('github', 'other.example.com', [
        githubTokenAuth('legacy-other'),
      ]),
    ];
    const fromConfig = [
      connection('github', 'config.example.com', [githubAppAuth(99)]),
    ];

    const result = combineConnectionSources(legacy, fromConfig, logger);

    expect(result).toHaveLength(1);
    expect((result[0] as unknown as { host: string }).host).toBe(
      'config.example.com',
    );
  });

  it('logs a single warning per discarded legacy type', () => {
    const legacy = [
      connection('github', 'github.com', [githubTokenAuth('a')]),
      connection('github', 'b.example.com', [githubTokenAuth('b')]),
      connection('github', 'c.example.com', [githubTokenAuth('c')]),
    ];
    const fromConfig = [
      connection('github', 'config.example.com', [githubAppAuth(1)]),
    ];

    combineConnectionSources(legacy, fromConfig, logger);

    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('github'));
  });

  it('only discards the legacy types that overlap, leaving other types alone', () => {
    const legacy = [
      connection('github', 'github.com', [githubTokenAuth('legacy-gh')]),
      connection('gitlab', 'gitlab.com', [githubTokenAuth('legacy-gl')]),
    ];
    const fromConfig = [
      connection('github', 'config.example.com', [githubAppAuth(1)]),
    ];

    const result = combineConnectionSources(legacy, fromConfig, logger);

    expect(result.map(c => c.type).sort()).toEqual(['github', 'gitlab']);
    const gitlab = result.find(c => c.type === 'gitlab');
    expect((gitlab as unknown as { host: string }).host).toBe('gitlab.com');
    expect(logger.warn).toHaveBeenCalledTimes(1);
    expect(logger.warn).toHaveBeenCalledWith(expect.stringContaining('github'));
  });
});
