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

import { DefaultStarredEntitiesApi } from '@backstage/plugin-catalog';
import {
  catalogApiRef,
  entityRouteRef,
  starredEntitiesApiRef,
} from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { permissionApiRef } from '@backstage/plugin-permission-react';
import {
  renderInTestApp,
  TestApiProvider,
  mockApis,
} from '@backstage/test-utils';
import { rootRouteRef, viewTechDocRouteRef } from '../../../routes';
import { TemplateListPage } from './TemplateListPage';
import {
  TECHDOCS_ANNOTATION,
  TECHDOCS_EXTERNAL_ANNOTATION,
  TECHDOCS_EXTERNAL_PATH_ANNOTATION,
} from '@backstage/plugin-techdocs-common';

const mountedRoutes = {
  mountedRoutes: {
    '/': rootRouteRef,
    '/catalog/:namespace/:kind/:name': entityRouteRef,
    '/docs/:namespace/:kind/:name': viewTechDocRouteRef,
  },
};

describe('TemplateListPage', () => {
  const mockCatalogApi = catalogApiMock({
    entities: [
      {
        apiVersion: 'scaffolder.backstage.io/v1beta3',
        kind: 'Template',
        metadata: { name: 'blob', tags: ['blob'] },
        spec: {
          type: 'service',
        },
      },
    ],
  });

  describe('TechDocs link rendering', () => {
    it('shows TechDocs link when template has backstage.io/techdocs-ref', async () => {
      const mockCatalogApiWithDocs = catalogApiMock({
        entities: [
          {
            apiVersion: 'scaffolder.backstage.io/v1beta3',
            kind: 'Template',
            metadata: {
              name: 'tmpl-a',
              annotations: { [TECHDOCS_ANNOTATION]: 'dir:.' },
            },
            spec: { type: 'service' },
          },
        ],
      });

      const { findByText } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, mockCatalogApiWithDocs],
            [
              starredEntitiesApiRef,
              new DefaultStarredEntitiesApi({
                storageApi: mockApis.storage(),
              }),
            ],
            [permissionApiRef, mockApis.permission()],
          ]}
        >
          <TemplateListPage />
        </TestApiProvider>,
        mountedRoutes,
      );

      expect(await findByText('View TechDocs')).toBeInTheDocument();
    });

    it('shows TechDocs link when template has backstage.io/techdocs-entity', async () => {
      const mockCatalogApiWithExternal = catalogApiMock({
        entities: [
          {
            apiVersion: 'scaffolder.backstage.io/v1beta3',
            kind: 'Template',
            metadata: {
              name: 'tmpl-b',
              annotations: {
                [TECHDOCS_EXTERNAL_ANNOTATION]: 'component:default/other',
              },
            },
            spec: { type: 'service' },
          },
        ],
      });

      const { findByText } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, mockCatalogApiWithExternal],
            [
              starredEntitiesApiRef,
              new DefaultStarredEntitiesApi({
                storageApi: mockApis.storage(),
              }),
            ],
            [permissionApiRef, mockApis.permission()],
          ]}
        >
          <TemplateListPage />
        </TestApiProvider>,
        mountedRoutes,
      );

      expect(await findByText('View TechDocs')).toBeInTheDocument();
    });

    it('appends path when backstage.io/techdocs-entity-path is set', async () => {
      const mockCatalogApiWithPath = catalogApiMock({
        entities: [
          {
            apiVersion: 'scaffolder.backstage.io/v1beta3',
            kind: 'Template',
            metadata: {
              name: 'tmpl-c',
              annotations: {
                [TECHDOCS_EXTERNAL_ANNOTATION]: 'component:default/other',
                [TECHDOCS_EXTERNAL_PATH_ANNOTATION]: '/guides/start',
              },
            },
            spec: { type: 'service' },
          },
        ],
      });

      const { findByText } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, mockCatalogApiWithPath],
            [
              starredEntitiesApiRef,
              new DefaultStarredEntitiesApi({
                storageApi: mockApis.storage(),
              }),
            ],
            [permissionApiRef, mockApis.permission()],
          ]}
        >
          <TemplateListPage />
        </TestApiProvider>,
        mountedRoutes,
      );

      const link = (await findByText('View TechDocs')).closest('a')!;
      expect(link).toHaveAttribute(
        'href',
        expect.stringMatching(
          /\/docs\/default\/component\/other\/?(index\.html)?#?\/guides\/start|\/docs\/default\/component\/other\/guides\/start/,
        ),
      );
    });
  });

  it('should render the search bar for templates', async () => {
    const { getByPlaceholderText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: mockApis.storage(),
            }),
          ],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <TemplateListPage />
      </TestApiProvider>,
      mountedRoutes,
    );

    expect(getByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('should render the all and starred filters', async () => {
    const { getByRole } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: mockApis.storage(),
            }),
          ],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <TemplateListPage />
      </TestApiProvider>,
      mountedRoutes,
    );

    expect(getByRole('menuitem', { name: /All/ })).toBeInTheDocument();
    expect(getByRole('menuitem', { name: /Starred/ })).toBeInTheDocument();
  });

  it('should render the category picker', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: mockApis.storage(),
            }),
          ],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <TemplateListPage />
      </TestApiProvider>,
      mountedRoutes,
    );

    expect(getByText('Categories')).toBeInTheDocument();
  });

  it('should render the EntityOwnerPicker', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: mockApis.storage(),
            }),
          ],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <TemplateListPage />
      </TestApiProvider>,
      mountedRoutes,
    );

    expect(getByText('Owner')).toBeInTheDocument();
  });

  // eslint-disable-next-line jest/no-disabled-tests
  it.skip('should render the EntityTag picker', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider
        apis={[
          [catalogApiRef, mockCatalogApi],
          [
            starredEntitiesApiRef,
            new DefaultStarredEntitiesApi({
              storageApi: mockApis.storage(),
            }),
          ],
          [permissionApiRef, mockApis.permission()],
        ]}
      >
        <TemplateListPage />
      </TestApiProvider>,
      mountedRoutes,
    );

    expect(getByText('Tags')).toBeInTheDocument();
  });

  describe('scaffolder page context menu', () => {
    it('should render if context menu props are not set to false', async () => {
      const { queryByTestId } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, mockCatalogApi],
            [
              starredEntitiesApiRef,
              new DefaultStarredEntitiesApi({
                storageApi: mockApis.storage(),
              }),
            ],
            [permissionApiRef, mockApis.permission()],
          ]}
        >
          <TemplateListPage />
        </TestApiProvider>,
        mountedRoutes,
      );
      expect(queryByTestId('menu-button')).toBeInTheDocument();
    });

    it('should not render if context menu props are set to false', async () => {
      const { queryByTestId } = await renderInTestApp(
        <TestApiProvider
          apis={[
            [catalogApiRef, mockCatalogApi],
            [
              starredEntitiesApiRef,
              new DefaultStarredEntitiesApi({
                storageApi: mockApis.storage(),
              }),
            ],
            [permissionApiRef, mockApis.permission()],
          ]}
        >
          <TemplateListPage
            contextMenu={{
              editor: false,
              actions: false,
              tasks: false,
              templatingExtensions: false,
            }}
          />
        </TestApiProvider>,
        mountedRoutes,
      );
      expect(queryByTestId('menu-button')).not.toBeInTheDocument();
    });
  });
});
