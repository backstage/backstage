/*
 * Copyright 2021 The Backstage Authors
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

import { ApiProvider, ConfigReader } from '@backstage/core-app-api';
import { configApiRef } from '@backstage/core-plugin-api';
import {
  renderInTestApp,
  TestApiProvider,
  TestApiRegistry,
} from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { CatalogImportApi, catalogImportApiRef } from '../../api';
import { ImportInfoCard } from './ImportInfoCard';

describe('<ImportInfoCard />', () => {
  let apis: TestApiRegistry;
  let catalogImportApi: jest.Mocked<CatalogImportApi>;

  beforeEach(() => {
    catalogImportApi = {
      analyzeUrl: jest.fn(),
      submitPullRequest: jest.fn(),
    };

    apis = TestApiRegistry.from(
      [
        configApiRef,
        new ConfigReader({
          integrations: {
            github: [{ token: 'my-token' }],
          },
        }),
      ],
      [catalogImportApiRef, catalogImportApi],
    );
  });

  it('renders without exploding', async () => {
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, new ConfigReader({ integrations: {} })],
          [catalogImportApiRef, catalogImportApi],
        ]}
      >
        <ImportInfoCard />
      </TestApiProvider>,
    );

    expect(
      screen.getByText('Register an existing component'),
    ).toBeInTheDocument();
  });

  it('renders section on GitHub discovery if supported', async () => {
    catalogImportApi.preparePullRequest = async () => ({ title: '', body: '' });

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <ImportInfoCard />
      </ApiProvider>,
    );

    expect(screen.getByText(/The wizard discovers all/)).toBeInTheDocument();
  });

  it('renders section on pull requests if supported', async () => {
    catalogImportApi.preparePullRequest = async () => ({ title: '', body: '' });

    await renderInTestApp(
      <ApiProvider apis={apis}>
        <ImportInfoCard />
      </ApiProvider>,
    );

    expect(
      screen.getByText(/the wizard will prepare a Pull Request/),
    ).toBeInTheDocument();
  });
});
