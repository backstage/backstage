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

import { ApiProvider } from '@backstage/core-app-api';
import { configApiRef, storageApiRef } from '@backstage/core-plugin-api';
import {
  MockStarredEntitiesApi,
  catalogApiRef,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import {
  TestApiRegistry,
  mockApis,
  renderInTestApp,
} from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import React from 'react';
import { rootDocsRouteRef } from '../../routes';
import { DefaultTechDocsHome } from './DefaultTechDocsHome';

const mockCatalogApi = catalogApiMock({
  entities: [
    {
      apiVersion: 'version',
      kind: 'User',
      metadata: {
        name: 'owned',
        namespace: 'default',
      },
    },
  ],
});

describe('TechDocs Home', () => {
  const configApi = mockApis.config({
    data: { organization: { name: 'My Company' } },
  });

  const apiRegistry = TestApiRegistry.from(
    [catalogApiRef, mockCatalogApi],
    [configApiRef, configApi],
    [storageApiRef, mockApis.storage()],
    [starredEntitiesApiRef, new MockStarredEntitiesApi()],
  );

  it('should render a TechDocs home page', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <DefaultTechDocsHome />
      </ApiProvider>,
      {
        mountedRoutes: {
          '/docs/:namespace/:kind/:name/*': rootDocsRouteRef,
        },
      },
    );

    // Header
    expect(await screen.findByText('Documentation')).toBeInTheDocument();
    expect(
      await screen.findByText(/Documentation available in My Company/i),
    ).toBeInTheDocument();
  });
});
