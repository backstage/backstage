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
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { renderInTestApp, TestApiRegistry } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { catalogImportApiRef, CatalogImportClient } from '../../api';
import { DefaultImportPage } from './DefaultImportPage';

describe('<DefaultImportPage />', () => {
  const fetchApi = {
    fetch: jest.fn(),
  };

  let apis: TestApiRegistry;

  beforeEach(() => {
    apis = TestApiRegistry.from(
      [configApiRef, new ConfigReader({ integrations: {} })],
      [catalogApiRef, catalogApiMock()],
      [
        catalogImportApiRef,
        new CatalogImportClient({
          discoveryApi: {} as any,
          scmAuthApi: {
            getCredentials: async () => ({ token: 'token', headers: {} }),
          },
          fetchApi,
          scmIntegrationsApi: {} as any,
          catalogApi: {} as any,
          configApi: {} as any,
        }),
      ],
    );
  });

  it('renders without exploding', async () => {
    await renderInTestApp(
      <ApiProvider apis={apis}>
        <DefaultImportPage />
      </ApiProvider>,
    );

    expect(
      screen.getByText('Start tracking your component in Backstage'),
    ).toBeInTheDocument();
  });
});
