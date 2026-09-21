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
import { screen } from '@testing-library/react';
import {
  catalogApiRef,
  entityRouteRef,
  EntityProvider,
} from '@backstage/plugin-catalog-react';
import { FlatRoutes } from '@backstage/core-app-api';
import { Route } from 'react-router-dom';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { MockSearchApi, searchApiRef } from '@backstage/plugin-search-react';
import {
  techdocsApiRef,
  TechDocsAddonLocations,
  type TechDocsAddonOptions,
} from '@backstage/plugin-techdocs-react';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import {
  configApiRef,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

const useTechDocsReaderDom = jest.fn();
jest.mock('../../reader/components/TechDocsReaderPageContent/dom', () => ({
  ...jest.requireActual(
    '../../reader/components/TechDocsReaderPageContent/dom',
  ),
  useTechDocsReaderDom: (...args: any[]) => useTechDocsReaderDom(...args),
}));
const useReaderState = jest.fn();
jest.mock('../../reader/components/useReaderState', () => ({
  ...jest.requireActual('../../reader/components/useReaderState'),
  useReaderState: (...args: any[]) => useReaderState(...args),
}));
jest.mock('@backstage/plugin-techdocs-react', () => ({
  ...jest.requireActual('@backstage/plugin-techdocs-react'),
  useShadowDomStylesLoading: () => false,
  useShadowRootElements: () => [],
}));

import { rootCatalogDocsRouteRef, rootDocsRouteRef } from '../../routes';
import {
  TechDocsEntityContent,
  TechDocsReaderPage,
} from './TechDocsReaderPage';

const entity = {
  apiVersion: 'backstage.io/v1alpha1',
  kind: 'Component',
  metadata: {
    name: 'test-name',
    namespace: 'test-namespace',
    annotations: { 'backstage.io/techdocs-ref': 'dir:.' },
  },
  spec: { owner: 'test' },
};

const getEntityMetadata = jest.fn();
const getTechDocsMetadata = jest.fn();

const addonOptions: TechDocsAddonOptions[] = [
  {
    name: 'ProbeAddon',
    location: TechDocsAddonLocations.Subheader,
    component: () => <div>ADDON_RENDERED</div>,
  },
];

const mountedRoutes = {
  '/docs/:namespace/:kind/:name/*': rootDocsRouteRef,
  '/catalog/:namespace/:kind/:name/*': entityRouteRef,
  // Takes no params, so it cannot be mounted on a parameterised path.
  '/docs-tab': rootCatalogDocsRouteRef,
};

const renderPage = (options: {
  routePath: string;
  routeEntry: string;
  element: JSX.Element;
}) =>
  renderInTestApp(
    <TestApiProvider
      apis={[
        [techdocsApiRef, { getEntityMetadata, getTechDocsMetadata }],
        [catalogApiRef, catalogApiMock({ entities: [entity] })],
        [discoveryApiRef, mockApis.discovery()],
        [searchApiRef, new MockSearchApi()],
        [
          fetchApiRef,
          {
            fetch: jest.fn().mockResolvedValue({
              ok: true,
              json: jest.fn().mockResolvedValue({
                expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
              }),
            }),
          },
        ],
        [
          configApiRef,
          mockApis.config({
            data: {
              app: { baseUrl: 'http://localhost:3000' },
              backend: { baseUrl: 'http://localhost:7007' },
            },
          }),
        ],
      ]}
    >
      <EntityProvider entity={entity}>
        <FlatRoutes>
          <Route path={options.routePath} element={options.element} />
        </FlatRoutes>
      </EntityProvider>
    </TestApiProvider>,
    { mountedRoutes, routeEntries: [options.routeEntry] },
  );

beforeEach(() => {
  getEntityMetadata.mockResolvedValue({
    ...entity,
    locationMetadata: { type: 'github', target: 'https://example.com/' },
  });
  getTechDocsMetadata.mockResolvedValue({
    site_name: 'test-site-name',
    site_description: 'test-site-desc',
  });
  useTechDocsReaderDom.mockReturnValue(document.createElement('html'));
  useReaderState.mockReturnValue({ state: 'cached' });
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('<TechDocsReaderPage />', () => {
  it('renders addons alongside the documentation', async () => {
    await renderPage({
      routePath: '/docs/:namespace/:kind/:name/*',
      routeEntry: '/docs/test-namespace/Component/test-name',
      element: (
        <TechDocsReaderPage
          addonOptions={addonOptions}
          withSearch={false}
          withHeader={false}
        />
      ),
    });

    expect(await screen.findByText('ADDON_RENDERED')).toBeInTheDocument();
    expect(
      await screen.findByTestId('techdocs-native-shadowroot'),
    ).toBeInTheDocument();
  });
});

describe('<TechDocsEntityContent />', () => {
  it('renders addons alongside the documentation', async () => {
    await renderPage({
      routePath: '/catalog/:namespace/:kind/:name/docs/*',
      routeEntry: '/catalog/test-namespace/Component/test-name/docs',
      element: <TechDocsEntityContent addonOptions={addonOptions} />,
    });

    expect(await screen.findByText('ADDON_RENDERED')).toBeInTheDocument();
    expect(
      await screen.findByTestId('techdocs-native-shadowroot'),
    ).toBeInTheDocument();
  });
});
