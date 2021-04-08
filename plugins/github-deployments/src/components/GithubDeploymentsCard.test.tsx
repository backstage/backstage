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
import { Entity } from '@backstage/catalog-model';

let entity: { entity: Entity };

jest.mock('@backstage/plugin-catalog-react', () => ({
  useEntity: () => {
    return entity;
  },
}));

const errorApiMock = { post: jest.fn(), error$: jest.fn() };

const configApi: ConfigApi = new ConfigReader({
  integrations: {
    github: [
      {
        host: 'my-github-1.com',
        apiBaseUrl: 'https://api.my-github-1.com',
      },
      {
        host: 'my-github-2.com',
        apiBaseUrl: 'https://api.my-github-2.com',
      },
      {
        host: 'my-github-3.com',
      },
    ],
  },
});

const GRAPHQL_GITHUB_API = graphql.link('https://api.github.com/graphql');
const GRAPHQL_CUSTOM_API_1 = graphql.link('https://api.github-1.com/graphql');
const GRAPHQL_CUSTOM_API_2 = graphql.link('https://api.github-2.com/graphql');

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

const assertFetchedData = async () => {
  const rendered = await renderInTestApp(
    <ApiProvider apis={apis}>
      <GithubDeploymentsCard />
    </ApiProvider>,
  );

  expect(await rendered.findByText('GitHub Deployments')).toBeInTheDocument();

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
};

describe('github-deployments', () => {
  const worker = setupServer();
  msw.setupDefaultHandlers(worker);

  beforeEach(() => {
    worker.resetHandlers();
    jest.resetAllMocks();
  });

  describe('export-plugin', () => {
    it('should export plugin', () => {
      expect(githubDeploymentsPlugin).toBeDefined();
    });
  });

  describe('GithubDeploymentsCard', () => {
    beforeEach(() => {
      entity = entityStub;
      entity.entity.metadata.annotations = {
        'github.com/project-slug': 'org/repo',
      };
    });

    it('displays fetched data using default github api', async () => {
      worker.use(
        GRAPHQL_GITHUB_API.query('deployments', (_, res, ctx) =>
          res(ctx.data(responseStub)),
        ),
      );

      await assertFetchedData();
      expect.assertions(7);
    });

    it('should display empty state when no data', async () => {
      worker.use(
        GRAPHQL_GITHUB_API.query('deployments', (_, res, ctx) =>
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
        GRAPHQL_GITHUB_API.query('deployments', (_, res, ctx) =>
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
        GRAPHQL_GITHUB_API.query('deployments', (_, res, ctx) =>
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

    describe('entity with source location', () => {
      beforeEach(() => {
        entity = entityStub;
        entity.entity.metadata.annotations = {
          'github.com/project-slug': 'org/repo',
          'backstage.io/source-location':
            'url:https://my-github-1.com/org/repo',
        };
      });

      it('should fetch data using custom api', async () => {
        const customAPI = graphql.link('https://api.my-github-1.com/graphql');

        worker.use(
          customAPI.query('deployments', (_, res, ctx) =>
            res(ctx.data(responseStub)),
          ),
        );

        await assertFetchedData();
        expect.assertions(7);
      });
    });

    describe('entity with managed by location', () => {
      beforeEach(() => {
        entity = entityStub;
        entity.entity.metadata.annotations = {
          'github.com/project-slug': 'org/repo',
          'backstage.io/managed-by-location':
            'url:https://my-github-2.com/org/repo',
        };
      });

      it('should fetch data using custom api', async () => {
        const customAPI = graphql.link('https://api.my-github-2.com/graphql');

        worker.use(
          customAPI.query('deployments', (_, res, ctx) =>
            res(ctx.data(responseStub)),
          ),
        );

        await assertFetchedData();
        expect.assertions(7);
      });
    });

    describe('entity with location without baseApiURL', () => {
      beforeEach(() => {
        entity = entityStub;
        entity.entity.metadata.annotations = {
          'github.com/project-slug': 'org/repo',
          'backstage.io/managed-by-location':
            'url:https://my-github-3.com/org/repo',
        };
      });

      it('shows error when no matching github host', async () => {
        const rendered = await renderInTestApp(
          <ApiProvider apis={apis}>
            <GithubDeploymentsCard />
          </ApiProvider>,
        );

        expect(
          await rendered.findByText(
            'Warning: No apiBaseUrl available for location url:https://my-github-3.com/org/repo, please check your integrations config',
          ),
        ).toBeInTheDocument();
      });
    });

    describe('entity with location without matching host', () => {
      beforeEach(() => {
        entity = entityStub;
        entity.entity.metadata.annotations = {
          'github.com/project-slug': 'org/repo',
          'backstage.io/managed-by-location':
            'url:https://my-github-unknown.com/org/repo',
        };
      });

      it('shows error when no matching github host', async () => {
        const rendered = await renderInTestApp(
          <ApiProvider apis={apis}>
            <GithubDeploymentsCard />
          </ApiProvider>,
        );

        expect(
          await rendered.findByText(
            'Warning: No matching GitHub integration configuration for location url:https://my-github-unknown.com/org/repo, please check your integrations config',
          ),
        ).toBeInTheDocument();
      });
    });
  });
});
