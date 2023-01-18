/*
 * Copyright 2020 The Backstage Authors
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
import { act } from '@testing-library/react';
import { scmIntegrationsApiRef } from '@backstage/integration-react';

import { entityRouteRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';

import { techdocsApiRef, techdocsStorageApiRef } from '../../../api';

import { rootRouteRef, rootDocsRouteRef } from '../../../routes';

import { TechDocsReaderPage } from './TechDocsReaderPage';
import { Route, useParams } from 'react-router-dom';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { FlatRoutes } from '@backstage/core-app-api';

import { Page } from '@backstage/core-components';

const mockEntityMetadata = {
  locationMetadata: {
    type: 'github',
    target: 'https://example.com/',
  },
  apiVersion: 'v1',
  kind: 'test',
  metadata: {
    name: 'test-name',
    namespace: 'test-namespace',
  },
  spec: {
    owner: 'test',
  },
};

const mockTechDocsMetadata = {
  site_name: 'test-site-name',
  site_description: 'test-site-desc',
};

const getEntityMetadata = jest.fn();
const getTechDocsMetadata = jest.fn();

const techdocsApiMock = {
  getEntityMetadata,
  getTechDocsMetadata,
};

const techdocsStorageApiMock: jest.Mocked<typeof techdocsStorageApiRef.T> = {
  getApiOrigin: jest.fn(),
  getBaseUrl: jest.fn(),
  getBuilder: jest.fn(),
  getEntityDocs: jest.fn(),
  getStorageUrl: jest.fn(),
  syncEntityDocs: jest.fn(),
};

const PageMock = () => {
  const { namespace, kind, name } = useParams();
  return <>{`PageMock: ${namespace}#${kind}#${name}`}</>;
};

jest.mock('@backstage/core-components', () => ({
  ...jest.requireActual('@backstage/core-components'),
  Page: jest.fn(),
}));

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <TestApiProvider
      apis={[
        [scmIntegrationsApiRef, {}],
        [techdocsApiRef, techdocsApiMock],
        [techdocsStorageApiRef, techdocsStorageApiMock],
      ]}
    >
      {children}
    </TestApiProvider>
  );
};

const mountedRoutes = {
  '/catalog/:namespace/:kind/:name/*': entityRouteRef,
  '/docs': rootRouteRef,
  '/docs/:namespace/:kind/:name/*': rootDocsRouteRef,
};

describe('<TechDocsReaderPage />', () => {
  beforeEach(() => {
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  beforeEach(() => {
    const realPage = jest.requireActual('@backstage/core-components').Page;
    (Page as jest.Mock).mockImplementation(realPage);
  });

  it('should render a techdocs reader page without children', async () => {
    const rendered = await renderInTestApp(
      <Wrapper>
        <TechDocsReaderPage
          entityRef={{
            name: 'test-name',
            namespace: 'test-namespace',
            kind: 'test',
          }}
        />
      </Wrapper>,
      {
        mountedRoutes,
      },
    );

    // TechDocsReaderPageHeader
    expect(rendered.container.querySelector('header')).toBeInTheDocument();
    // TechDocsReaderPageContent
    expect(rendered.container.querySelector('article')).toBeInTheDocument();
  });

  it('should render a techdocs reader page with children', async () => {
    await act(async () => {
      const rendered = await renderInTestApp(
        <Wrapper>
          <TechDocsReaderPage
            entityRef={{
              name: 'test-name',
              namespace: 'test-namespace',
              kind: 'test',
            }}
          >
            techdocs reader page
          </TechDocsReaderPage>
        </Wrapper>,
        {
          mountedRoutes,
        },
      );
      expect(
        rendered.container.querySelector('header'),
      ).not.toBeInTheDocument();
      expect(
        rendered.container.querySelector('article'),
      ).not.toBeInTheDocument();
      expect(rendered.getByText('techdocs reader page')).toBeInTheDocument();
    });
  });

  it('should render techdocs reader page with addons', async () => {
    (Page as jest.Mock).mockImplementation(PageMock);
    const name = 'test-name';
    const namespace = 'test-namespace';
    const kind = 'test';

    await act(async () => {
      const rendered = await renderInTestApp(
        <Wrapper>
          <FlatRoutes>
            <Route
              path="/docs/:namespace/:kind/:name/*"
              element={<TechDocsReaderPage />}
            >
              <TechDocsAddons>
                <ReportIssue />
              </TechDocsAddons>
            </Route>
          </FlatRoutes>
        </Wrapper>,
        {
          mountedRoutes,
          routeEntries: ['/docs/test-namespace/test/test-name'],
        },
      );

      expect(
        rendered.getByText(`PageMock: ${namespace}#${kind}#${name}`),
      ).toBeInTheDocument();
    });
  });

  it('should render techdocs reader page with addons and page', async () => {
    (Page as jest.Mock).mockImplementation(PageMock);
    await act(async () => {
      const rendered = await renderInTestApp(
        <Wrapper>
          <FlatRoutes>
            <Route
              path="/docs/:namespace/:kind/:name/*"
              element={<TechDocsReaderPage />}
            >
              <p>the page</p>
              <TechDocsAddons>
                <ReportIssue />
              </TechDocsAddons>
            </Route>
          </FlatRoutes>
        </Wrapper>,
        {
          mountedRoutes,
          routeEntries: ['/docs/test-namespace/test/test-name'],
        },
      );

      expect(rendered.getByText('the page')).toBeInTheDocument();
    });
  });
});
