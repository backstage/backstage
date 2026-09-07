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
import { ConfigReader } from '@backstage/config';
import { JsonObject } from '@backstage/types';
import { buildConnectionsFromConfig } from './buildConnectionsFromConfig';

const rootConfig = (data: JsonObject) => new ConfigReader(data);

describe('buildConnectionsFromConfig', () => {
  let logger: { debug: jest.Mock; warn: jest.Mock };

  beforeEach(() => {
    logger = { debug: jest.fn(), warn: jest.fn() };
  });

  it('returns an empty list when nothing is configured, with or without a logger', () => {
    expect(buildConnectionsFromConfig({ config: rootConfig({}) })).toEqual([]);
    expect(
      buildConnectionsFromConfig({ config: rootConfig({}), logger }),
    ).toEqual([]);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('converts legacy integrations, merges explicit connections, and assigns default titles', () => {
    const connections = buildConnectionsFromConfig({
      config: rootConfig({
        integrations: {
          github: [{ host: 'github.com', token: 'gh-token' }],
        },
        connections: [
          {
            type: 'gitlab',
            host: 'gitlab.com',
            auth: [{ method: 'token', token: 'gl-token' }],
          },
        ],
      }),
      logger,
    });

    expect(connections).toMatchObject([
      {
        type: 'github',
        host: 'github.com',
        title: 'GitHub',
        auth: [{ method: 'token', token: 'gh-token', title: 'Token' }],
      },
      {
        type: 'gitlab',
        host: 'gitlab.com',
        title: 'GitLab',
        auth: [{ method: 'token', token: 'gl-token', title: 'Token' }],
      },
    ]);
    expect(logger.warn).not.toHaveBeenCalled();
  });

  it('includes the identity in default titles when multiple connections share a type', () => {
    const connections = buildConnectionsFromConfig({
      config: rootConfig({
        connections: [
          {
            type: 'github',
            host: 'github.com',
            auth: [{ method: 'token', token: 'public' }],
          },
          {
            type: 'github',
            host: 'ghe.acme.com',
            title: 'Enterprise GitHub',
            auth: [{ method: 'token', token: 'enterprise' }],
          },
        ],
      }),
    });

    expect(connections.map(c => c.title)).toEqual([
      'GitHub (github.com)',
      'Enterprise GitHub',
    ]);
  });

  it('lets explicit connections shadow legacy entries of the same type, with a warning', () => {
    const connections = buildConnectionsFromConfig({
      config: rootConfig({
        integrations: {
          github: [{ host: 'ghe.acme.com', token: 'legacy-token' }],
        },
        connections: [
          {
            type: 'github',
            host: 'github.com',
            auth: [{ method: 'token', token: 'explicit-token' }],
          },
        ],
      }),
      logger,
    });

    expect(connections).toMatchObject([{ type: 'github', host: 'github.com' }]);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('legacy integrations of this type are ignored'),
    );
  });

  it('keeps the first legacy entry when duplicates resolve to the same connection, with a warning', () => {
    const connections = buildConnectionsFromConfig({
      config: rootConfig({
        integrations: {
          github: [
            { host: 'ghe.acme.com', token: 'first-token' },
            { host: 'ghe.acme.com', token: 'second-token' },
          ],
        },
      }),
      logger,
    });

    expect(connections).toMatchObject([
      {
        type: 'github',
        host: 'ghe.acme.com',
        auth: [{ method: 'token', token: 'first-token' }],
      },
    ]);
    expect(logger.warn).toHaveBeenCalledWith(
      expect.stringContaining('github ghe.acme.com'),
    );
  });

  it('rejects invalid configuration with contextual error messages', () => {
    // Explicit connections that fail schema validation get connections
    // config context together with the prettified schema error.
    expect(() =>
      buildConnectionsFromConfig({
        config: rootConfig({
          connections: [
            { type: 'github', auth: [{ method: 'token', token: 't' }] },
          ],
        }),
      }),
    ).toThrow(
      /Invalid connection of type "github" in connections config:[\s\S]*host/,
    );

    // Legacy entries that fail conversion get legacy integrations context.
    expect(() =>
      buildConnectionsFromConfig({
        config: rootConfig({
          integrations: { awsS3: [{ endpoint: 'not a url' }] },
        }),
      }),
    ).toThrow(
      /Failed to convert legacy integrations config:[\s\S]*Invalid endpoint URL "not a url"/,
    );

    // The connections config must be a list.
    expect(() =>
      buildConnectionsFromConfig({
        config: rootConfig({ connections: { type: 'github' } }),
      }),
    ).toThrow('Expected "connections" config to be an array');

    // Explicit connections have a uniqueness requirement per identity, unlike
    // deduplicated legacy entries.
    expect(() =>
      buildConnectionsFromConfig({
        config: rootConfig({
          connections: [
            {
              type: 'github',
              host: 'github.com',
              auth: [{ method: 'token', token: 'one' }],
            },
            {
              type: 'github',
              host: 'github.com',
              auth: [{ method: 'token', token: 'two' }],
            },
          ],
        }),
      }),
    ).toThrow('Duplicate connection of type "github" for host "github.com"');

    // Singleton connection types allow at most one entry.
    expect(() =>
      buildConnectionsFromConfig({
        config: rootConfig({
          connections: [
            { type: 'aws', auth: [{ method: 'account', mainAccount: true }] },
            { type: 'aws', auth: [{ method: 'account', accountId: '123' }] },
          ],
        }),
      }),
    ).toThrow(
      'Duplicate connection of type "aws"; this is a singleton connection type',
    );
  });
});
