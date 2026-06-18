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

import { configApiRef } from '@backstage/core-plugin-api';
import { toastApiRef } from '@backstage/frontend-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { AuthorizeResult } from '@backstage/plugin-permission-common';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { screen, waitFor } from '@testing-library/react';
import { SWRConfig } from 'swr';
import { createComponentRouteRef } from '../../routes';
import type { CatalogExportSettings } from '../CatalogExportButton';
import { NfsBaseCatalogPage } from './DefaultCatalogPage';

const configApi = mockApis.config({
  data: {
    organization: {
      name: 'Spotify',
    },
    app: {
      support: {
        url: 'https://example.com/support',
        items: [],
      },
    },
  },
});

type RenderOptions = {
  authorize?: AuthorizeResult.ALLOW | AuthorizeResult.DENY;
  exportSettings?: CatalogExportSettings;
  mountCreateRoute?: boolean;
};

const renderPage = async ({
  authorize = AuthorizeResult.ALLOW,
  exportSettings,
  mountCreateRoute = true,
}: RenderOptions = {}) => {
  const permissionApi = mockApis.permission({ authorize });
  jest.spyOn(permissionApi, 'authorize');
  const rendered = await renderInTestApp(
    <SWRConfig value={{ provider: () => new Map() }}>
      <TestApiProvider
        apis={[
          [catalogApiRef, {}],
          [configApiRef, configApi],
          [permissionApiRef, permissionApi],
          [toastApiRef, { post: jest.fn() }],
        ]}
      >
        <NfsBaseCatalogPage
          filters={<div>Filters</div>}
          content={<div>Injected content</div>}
          exportSettings={exportSettings}
        />
      </TestApiProvider>
    </SWRConfig>,
    {
      mountedRoutes: mountCreateRoute
        ? { '/create': createComponentRouteRef }
        : {},
    },
  );

  return { ...rendered, permissionApi };
};

describe('NfsBaseCatalogPage', () => {
  it('renders the BUI header actions and content container', async () => {
    await renderPage();

    expect(
      screen.getByRole('heading', { name: 'Spotify Catalog' }),
    ).toHaveClass('bui-HeaderTitle');
    const createLink = await screen.findByRole('link', { name: 'Create' });
    expect(createLink).toHaveAttribute('href', '/create');
    expect(createLink.querySelector('svg')).toBeInTheDocument();
    expect(screen.getByTestId('support-button')).toBeInTheDocument();
    expect(
      screen.getByText('Injected content').closest('.bui-Container'),
    ).toBeInTheDocument();
  });

  it('renders Export selection inside the entity list provider', async () => {
    await renderPage({ exportSettings: { enabled: true } });

    const exportButton = screen.getByRole('button', {
      name: 'Export selection',
    });
    expect(exportButton).toHaveClass('bui-ButtonIcon');
    expect(exportButton).not.toHaveTextContent('Export selection');
  });

  it('hides Create when permission is denied', async () => {
    const { permissionApi } = await renderPage({
      authorize: AuthorizeResult.DENY,
    });

    await waitFor(() => expect(permissionApi.authorize).toHaveBeenCalled());
    expect(
      screen.queryByRole('link', { name: 'Create' }),
    ).not.toBeInTheDocument();
  });

  it('hides Create when the optional create route is unbound', async () => {
    const { permissionApi } = await renderPage({ mountCreateRoute: false });

    await waitFor(() => expect(permissionApi.authorize).toHaveBeenCalled());
    expect(
      screen.queryByRole('link', { name: 'Create' }),
    ).not.toBeInTheDocument();
  });
});
