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
import React from 'react';
import {
  ApiProvider,
  ApiRegistry,
  errorApiRef,
  configApiRef,
  ConfigReader,
  ConfigApi,
  OAuthApi,
} from '@backstage/core';

import { fireEvent } from '@testing-library/react';
import { msw, renderInTestApp } from '@backstage/test-utils';
import { GithubDeploymentsApiClient, githubDeploymentsApiRef } from '../api';
import { githubDeploymentsPlugin } from '../plugin';
import { GithubDeploymentsCard } from './GithubDeploymentsCard';

import {
  entityStub,
  noDataResponseStub,
  refreshedResponseStub,
  responseStub,
} from '../mocks/mocks';

import { setupServer } from 'msw/node';
import { graphql } from 'msw';
import { ScmIntegrations } from '@backstage/integration';

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: () => {
    return entityStub;
  },
}));

const errorApiMock = { post: jest.fn(), error$: jest.fn() };

const configApi: ConfigApi = new ConfigReader({
  integrations: {
    github: [
      {
        host: 'missing-api-base-url.com',
      },
      {
        host: 'my-github.com',
        apiBaseUrl: 'https://api.my-github.com',
      },
    ],
  },
});
const scmIntegrationsApi = ScmIntegrations.fromConfig(configApi);
const githubAuthApi: OAuthApi = {
  getAccessToken: async _ => 'access_token',
};

const apis = ApiRegistry.from([
  [configApiRef, configApi],
  [errorApiRef, errorApiMock],
  [
    githubDeploymentsApiRef,
    new GithubDeploymentsApiClient({ scmIntegrationsApi, githubAuthApi }),
  ],
]);

describe('github-deployments', () => {
  const worker = setupServer();
  msw.setupDefaultHandlers(worker);

  beforeEach(() => {
    jest.resetAllMocks();
  });

  describe('export-plugin', () => {
    it('should export plugin', () => {
      expect(githubDeploymentsPlugin).toBeDefined();
    });
  });

  describe('GithubDeploymentsCard', () => {
    it('should display fetched data', async () => {
      worker.use(
        graphql.query('deployments', (_, res, ctx) =>
          res(ctx.data(responseStub)),
        ),
      );

      const rendered = await renderInTestApp(
        <ApiProvider apis={apis}>
          <GithubDeploymentsCard />
        </ApiProvider>,
      );

      expect(
        await rendered.findByText('GitHub Deployments'),
      ).toBeInTheDocument();
      expect(await rendered.findByText('active')).toBeInTheDocument();
      expect(await rendered.findByText('prd')).toBeInTheDocument();
      expect(await rendered.findByText('12345')).toHaveAttribute(
        'href',
        'https://exampleapi.com/123456789',
      );

      expect(await rendered.findByText('pending')).toBeInTheDocument();
      expect(await rendered.findByText('lab')).toBeInTheDocument();
      expect(await rendered.findByText('54321')).toHaveAttribute(
        'href',
        'https://exampleapi.com/543212345',
      );
    });

    it('should display empty state when no data', async () => {
      worker.use(
        graphql.query('deployments', (_, res, ctx) =>
          res(ctx.data(noDataResponseStub)),
        ),
      );

      const rendered = await renderInTestApp(
        <ApiProvider apis={apis}>
          <GithubDeploymentsCard />
        </ApiProvider>,
      );

      expect(
        await rendered.findByText('GitHub Deployments'),
      ).toBeInTheDocument();
      expect(
        await rendered.findByText('No deployments found for this entity.'),
      ).toBeInTheDocument();
    });

    it('should shows new data on reload', async () => {
      worker.use(
        graphql.query('deployments', (_, res, ctx) =>
          res(ctx.data(responseStub)),
        ),
      );

      const rendered = await renderInTestApp(
        <ApiProvider apis={apis}>
          <GithubDeploymentsCard />
        </ApiProvider>,
      );

      expect(
        await rendered.findByText('GitHub Deployments'),
      ).toBeInTheDocument();
      expect(await rendered.findByText('pending')).toBeInTheDocument();

      worker.resetHandlers();
      worker.use(
        graphql.query('deployments', (_, res, ctx) =>
          res(ctx.data(refreshedResponseStub)),
        ),
      );

      const refreshButton = await rendered.findByTitle('Reload');
      fireEvent.click(refreshButton);

      expect(
        await rendered.findByText('GitHub Deployments'),
      ).toBeInTheDocument();
      expect(await rendered.findByText('failure')).toBeInTheDocument();
    });

    it('shows error when host does not exist', async () => {
      worker.use(
        graphql.query('deployments', (_, res, ctx) =>
          res(ctx.data(responseStub)),
        ),
      );

      const rendered = await renderInTestApp(
        <ApiProvider apis={apis}>
          <GithubDeploymentsCard host="unknown-host.com" />
        </ApiProvider>,
      );

      expect(
        await rendered.findByText(
          'Warning: No matching GitHub integration configuration for host unknown-host.com, please check your integrations config',
        ),
      ).toBeInTheDocument();
    });

    it('shows error when baseApiURL does not exist for host', async () => {
      worker.use(
        graphql.query('deployments', (_, res, ctx) =>
          res(ctx.data(responseStub)),
        ),
      );

      const rendered = await renderInTestApp(
        <ApiProvider apis={apis}>
          <GithubDeploymentsCard host="missing-api-base-url.com" />
        </ApiProvider>,
      );

      expect(
        await rendered.findByText(
          'Warning: No apiBaseUrl available for host missing-api-base-url.com',
        ),
      ).toBeInTheDocument();
    });
  });
});
