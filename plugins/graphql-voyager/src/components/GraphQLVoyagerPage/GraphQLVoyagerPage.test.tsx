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
import React from 'react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';

import { GraphQLVoyagerPage } from './GraphQLVoyagerPage';
import { GraphQLVoyagerApi, graphQlVoyagerApiRef } from '../../lib/api';

jest.mock('../GraphQLVoyagerBrowser', () => ({
  GraphQLVoyagerBrowser: () => '<GraphQLVoyagerBrowser />',
}));

describe('GraphQLVoyagerPage', () => {
  it('should show error when no endpoints are loaded', async () => {
    const loadingApi: GraphQLVoyagerApi = {
      async getEndpoints() {
        throw new Error('No endpoints');
      },
    };

    const rendered = await renderInTestApp(
      <TestApiProvider apis={[[graphQlVoyagerApiRef, loadingApi]]}>
        <GraphQLVoyagerPage />
      </TestApiProvider>,
    );

    expect(rendered.getByText('Welcome to Voyager!')).toBeInTheDocument();
    expect(rendered.getByText('Error: No endpoints')).toBeInTheDocument();
  });

  it('should show GraphQLVoyagerBrowser', async () => {
    const loadingApi: GraphQLVoyagerApi = {
      async getEndpoints() {
        return [];
      },
    };

    const rendered = await renderInTestApp(
      <TestApiProvider apis={[[graphQlVoyagerApiRef, loadingApi]]}>
        <GraphQLVoyagerPage />
      </TestApiProvider>,
    );

    expect(rendered.getByText('Welcome to Voyager!')).toBeInTheDocument();
    expect(rendered.getByText('<GraphQLVoyagerBrowser />')).toBeInTheDocument();
  });
});
