/*
 * Copyright 2021 Spotify AB
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
import { CatalogClient } from '@backstage/catalog-client';
import {
  ApiProvider,
  ApiRegistry,
  configApiRef,
  errorApiRef,
} from '@backstage/core';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { msw, renderInTestApp } from '@backstage/test-utils';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import React from 'react';
import { catalogImportApiRef, CatalogImportClient } from '../api';
import { ImportComponentPage } from './ImportComponentPage';

let codeSearchMockResponse: () => Promise<{
  data: {
    total_count: number;
    items: Array<{ path: string }>;
  };
}>;

let findGithubConfigMockResponse = () => ({
  host: 'test.localhost',
  owner: 'someuser',
});

jest.mock('@backstage/integration', () => ({
  readGitHubIntegrationConfigs: () => ({
    find: findGithubConfigMockResponse,
  }),
}));

jest.mock('@octokit/rest', () => ({
  Octokit: jest.fn().mockImplementation(() => {
    return {
      repos: {
        get: () =>
          Promise.resolve({
            data: {
              default_branch: 'main',
            },
          }),
      },
      search: {
        code: codeSearchMockResponse,
      },
    };
  }),
}));

const OUR_GITHUB_TEST_REPO = 'https://github.com/someuser/somerepo';
describe('<ImportComponentPage />', () => {
  const server = setupServer();
  msw.setupDefaultHandlers(server);

  beforeEach(() => {
    server.use(
      rest.post('https://backend.localhost/locations', (_, res, ctx) => {
        return res(
          ctx.status(201),
          ctx.json(require('../mocks/locations-POST-response.json')),
        );
      }),
      rest.post('https://backend.localhost/analyze-location', (_, res, ctx) => {
        return res(
          ctx.json(require('../mocks/analyze-location-POST-response.json')),
        );
      }),
    );
  });
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  let apis: ApiRegistry;

  const mockErrorApi: jest.Mocked<typeof errorApiRef.T> = {
    post: jest.fn(),
    error$: jest.fn(),
  };

  beforeEach(() => {
    const getBaseUrl = () => Promise.resolve('https://backend.localhost');
    apis = ApiRegistry.from([
      [
        catalogApiRef,
        new CatalogClient({
          discoveryApi: { getBaseUrl },
        }),
      ],
      [
        catalogImportApiRef,
        new CatalogImportClient({
          discoveryApi: { getBaseUrl },
          githubAuthApi: {
            getAccessToken: (_, __) => Promise.resolve('token'),
          },
          configApi: {} as any,
        }),
      ],
      [
        configApiRef,
        {
          getOptional: () => 'Title',
          getOptionalConfigArray: () => [],
          has: () => true,
          getConfig: () => ({
            has: () => true,
          }),
        },
      ],
      [errorApiRef, mockErrorApi],
    ]);
  });

  async function renderSUT() {
    return await renderInTestApp(
      <ApiProvider apis={apis}>
        <ImportComponentPage catalogRouteRef={{ path: 'path', title: 'ttl' }} />
      </ApiProvider>,
    );
  }

  it('Should not explode on non-Github URLs', async () => {
    findGithubConfigMockResponse = () => undefined!!;
    await renderSUT();
    await waitFor(() => {
      fireEvent.input(
        screen.getByPlaceholderText('https://github.com/backstage/backstage'),
        {
          target: {
            value: 'https://test-git-provider.localhost/someuser/somerepo',
          },
        },
      );
    });

    fireEvent.click(screen.getByText('Next'));
    await waitFor(() => {
      const firstStepInput = screen.queryByPlaceholderText(
        'https://github.com/backstage/backstage',
      );
      expect(firstStepInput).not.toBeInTheDocument();
    });
  });

  it('Should offer direct file import from non-Github URLs', async () => {
    findGithubConfigMockResponse = () => undefined!!;
    await renderSUT();
    await waitFor(() => {
      fireEvent.input(
        screen.getByPlaceholderText('https://github.com/backstage/backstage'),
        {
          target: {
            value:
              'https://test-git-provider.localhost/someuser/somerepo/catalog-info.yaml',
          },
        },
      );
    });

    fireEvent.click(screen.getByText('Next'));
    await waitFor(() => {
      const firstStepInput = screen.queryByPlaceholderText(
        'https://github.com/backstage/backstage',
      );
      expect(firstStepInput).not.toBeInTheDocument();
    });
    expect(
      screen.getByText(
        'https://test-git-provider.localhost/someuser/somerepo/catalog-info.yaml',
      ),
    ).toBeInTheDocument();
  });

  it('Should use found yaml file directly and not create a pull request if GitHub api returns one', async () => {
    findGithubConfigMockResponse = () => ({
      host: 'test.localhost',
      owner: 'someuser',
    });
    codeSearchMockResponse = () =>
      Promise.resolve({
        data: {
          total_count: 3,
          items: [
            { path: 'simple/path/catalog-info.yaml' },
            { path: 'co/mple/x/path/catalog-info.yaml' },
            { path: 'catalog-info.yaml' },
          ],
        },
      });
    await renderSUT();
    await waitFor(() => {
      fireEvent.input(
        screen.getByPlaceholderText('https://github.com/backstage/backstage'),
        { target: { value: OUR_GITHUB_TEST_REPO } },
      );
    });

    fireEvent.click(screen.getByText('Next'));
    await waitFor(() => {
      expect(
        screen.getByText(
          'https://github.com/someusername/somerepo/blob/master/src/catalog-info.yaml',
        ),
      ).toBeInTheDocument();

      const pullReqText = screen.queryByText('pull request');
      expect(pullReqText).not.toBeInTheDocument();
    });
  });

  it('Should indicate a pull request creation when no yaml file found in the repo', async () => {
    findGithubConfigMockResponse = () => ({
      host: 'test.localhost',
      owner: 'someuser',
    });
    codeSearchMockResponse = () =>
      Promise.resolve({
        data: {
          total_count: 0,
          items: [],
        },
      });
    const { container } = await renderSUT();
    await waitFor(() => {
      fireEvent.input(
        screen.getByPlaceholderText('https://github.com/backstage/backstage'),
        { target: { value: OUR_GITHUB_TEST_REPO } },
      );
    });

    fireEvent.click(screen.getByText('Next'));
    await waitFor(() => {
      expect(screen.getByText(OUR_GITHUB_TEST_REPO)).toBeInTheDocument();
    });
    const textNode = container
      .querySelector('a[href="https://github.com/someuser/somerepo"]')
      ?.closest('p');
    expect(textNode?.innerHTML).toContain(
      'Following config object will be submitted in a pull request to the repository',
    );
    expect(
      screen.queryByText(
        'https://github.com/someusername/somerepo/blob/master/src/catalog-info.yaml',
      ),
    ).not.toBeInTheDocument();
  });
});
