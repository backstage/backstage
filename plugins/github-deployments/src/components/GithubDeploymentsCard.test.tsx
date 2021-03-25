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
  UrlPatternDiscovery,
  configApiRef,
  ConfigReader,
} from '@backstage/core';

import { render } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { GithubDeploymentsApiClient, githubDeploymentsApiRef } from '../api';
import { githubDeploymentsPlugin } from '../plugin';
import { GithubDeploymentsCard } from './GithubDeploymentsCard';

import { entityStub, responseStub } from '../mocks/mocks';

const discoveryApi = UrlPatternDiscovery.compile('http://exampleapi.com');
const errorApiMock = { post: jest.fn(), error$: jest.fn() };

const apis = ApiRegistry.from([
  [configApiRef, new ConfigReader({})],
  [errorApiRef, errorApiMock],
  [githubDeploymentsApiRef, new GithubDeploymentsApiClient({ discoveryApi })],
]);

describe('github-deployments', () => {
  const worker = setupServer();
  beforeAll(() => worker.listen());
  afterAll(() => worker.close());
  afterEach(() => worker.resetHandlers());

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
      worker.use(rest.post('*', (_, res, ctx) => res(ctx.json(responseStub))));

      const rendered = render(
        <ApiProvider apis={apis}>
          <GithubDeploymentsCard entity={entityStub} />
        </ApiProvider>,
      );

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
  });
});
