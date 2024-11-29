/*
 * Copyright 2022 The Backstage Authors
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

const octokit = {
  search: {
    code: jest.fn(),
  },
  repos: {
    get: jest.fn(),
  },
};

jest.mock('@octokit/rest', () => {
  class Octokit {
    constructor() {
      return octokit;
    }
  }
  return { Octokit };
});

import { PluginEndpointDiscovery } from '@backstage/backend-common';
import { GithubLocationAnalyzer } from './GithubLocationAnalyzer';
import {
  registerMswTestHooks,
  mockServices,
} from '@backstage/backend-test-utils';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { ConfigReader } from '@backstage/config';

const server = setupServer();

describe('GithubLocationAnalyzer', () => {
  const mockDiscoveryApi: jest.Mocked<PluginEndpointDiscovery> = {
    getBaseUrl: jest.fn().mockResolvedValue('http://localhost:7007'),
    getExternalBaseUrl: jest.fn(),
  };
  const mockAuthService = mockServices.auth.mock({
    getPluginRequestToken: async () => ({ token: 'abc123' }),
  });
  const config = new ConfigReader({
    integrations: {
      github: [
        {
          host: 'h.com',
          token: 't',
        },
      ],
    },
  });

  registerMswTestHooks(server);

  beforeEach(() => {
    server.use(
      rest.post('http://localhost:7007/locations', async (_, res, ctx) => {
        return res(
          ctx.status(201),
          ctx.json({
            location: 'test',
            exists: false,
            entities: [
              {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'Location',
                metadata: {
                  name: 'test-entity',
                },
                spec: {
                  type: 'url',
                  target: 'whatever',
                },
              },
              {
                apiVersion: 'backstage.io/v1alpha1',
                kind: 'Component',
                metadata: {
                  title: 'Test Entity',
                  name: 'test-entity-2',
                  description: 'The expected description 2',
                },
                spec: {
                  type: 'some-type',
                  lifecycle: 'experimental',
                  owner: 'someone',
                },
              },
            ],
          }),
        );
      }),
    );

    octokit.repos.get.mockResolvedValue({
      data: { default_branch: 'my_default_branch' },
    });
  });

  it('should analyze', async () => {
    octokit.search.code.mockImplementation((opts: { q: string }) => {
      if (opts.q === 'filename:catalog-info.yaml extension:yaml repo:foo/bar') {
        return Promise.resolve({
          data: { items: [{ path: 'catalog-info.yaml' }], total_count: 1 },
        });
      }
      return Promise.reject();
    });

    const analyzer = new GithubLocationAnalyzer({
      discovery: mockDiscoveryApi,
      auth: mockAuthService,
      config,
    });
    const result = await analyzer.analyze({
      url: 'https://github.com/foo/bar',
    });

    expect(result.existing[0].isRegistered).toBeFalsy();
    expect(result.existing[0].location).toEqual({
      type: 'url',
      target:
        'https://github.com/foo/bar/blob/my_default_branch/catalog-info.yaml',
    });
  });

  it('should use the provided entity filename for search', async () => {
    octokit.search.code.mockImplementation((opts: { q: string }) => {
      if (opts.q === 'filename:anvil.yaml extension:yaml repo:foo/bar') {
        return Promise.resolve({
          data: { items: [{ path: 'anvil.yaml' }], total_count: 1 },
        });
      }
      return Promise.reject();
    });

    const analyzer = new GithubLocationAnalyzer({
      discovery: mockDiscoveryApi,
      auth: mockAuthService,
      config,
    });
    const result = await analyzer.analyze({
      url: 'https://github.com/foo/bar',
      catalogFilename: 'anvil.yaml',
    });

    expect(result.existing[0].location).toEqual({
      type: 'url',
      target: 'https://github.com/foo/bar/blob/my_default_branch/anvil.yaml',
    });
  });

  it('should use the provided entity file extension in search query only if present', async () => {
    octokit.search.code.mockImplementation((opts: { q: string }) => {
      if (opts.q === 'filename:.gitignore  repo:foo/bar') {
        return Promise.resolve({
          data: { items: [{ path: '.gitignore' }], total_count: 1 },
        });
      }
      return Promise.reject();
    });

    const analyzer = new GithubLocationAnalyzer({
      discovery: mockDiscoveryApi,
      auth: mockAuthService,
      config,
    });
    const result = await analyzer.analyze({
      url: 'https://github.com/foo/bar',
      catalogFilename: '.gitignore',
    });

    expect(result.existing[0].location).toEqual({
      type: 'url',
      target: 'https://github.com/foo/bar/blob/my_default_branch/.gitignore',
    });
  });
});
