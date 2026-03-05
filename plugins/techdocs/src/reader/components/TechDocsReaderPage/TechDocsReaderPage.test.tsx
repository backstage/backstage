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

import { ReactNode } from 'react';
import { scmIntegrationsApiRef } from '@backstage/integration-react';

import {
  catalogApiRef,
  entityPresentationApiRef,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import {
  mockApis,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import { catalogApiMock as catalogApiMockFactory } from '@backstage/plugin-catalog-react/testUtils';

import { techdocsApiRef, techdocsStorageApiRef } from '../../../api';

import { rootRouteRef, rootDocsRouteRef } from '../../../routes';
import { TECHDOCS_EXTERNAL_ANNOTATION } from '@backstage/plugin-techdocs-common';

import { TechDocsReaderPage } from './TechDocsReaderPage';
import { Route, useNavigate, useParams } from 'react-router-dom';
import { TechDocsAddons } from '@backstage/plugin-techdocs-react';
import { ReportIssue } from '@backstage/plugin-techdocs-module-addons-contrib';
import { FlatRoutes } from '@backstage/core-app-api';

import { Page } from '@backstage/core-components';
import {
  configApiRef,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

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
const getCookie = jest.fn();

const techdocsApiMock = {
  getEntityMetadata,
  getTechDocsMetadata,
  getCookie,
};

const techdocsStorageApiMock: jest.Mocked<typeof techdocsStorageApiRef.T> = {
  getApiOrigin: jest.fn(),
  getBaseUrl: jest.fn(),
  getBuilder: jest.fn(),
  getEntityDocs: jest.fn(),
  getStorageUrl: jest.fn(),
  syncEntityDocs: jest.fn(),
};

const entityPresentationApiMock: jest.Mocked<
  typeof entityPresentationApiRef.T
> = {
  forEntity: jest.fn().mockReturnValue({
    snapshot: {
      primaryTitle: 'Test Entity',
    },
  }),
};

const catalogApiMock = catalogApiMockFactory.mock();

const fetchApiMock = {
  fetch: jest.fn().mockResolvedValue({
    ok: true,
    json: jest.fn().mockResolvedValue({
      // Expires in 10 minutes
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    }),
  }),
};

const PageMock = () => {
  const { namespace, kind, name } = useParams();
  return <>{`PageMock: ${namespace}#${kind}#${name}`}</>;
};

jest.mock('@backstage/core-components', () => ({
  ...jest.requireActual('@backstage/core-components'),
  Page: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

const configApi = mockApis.config({
  data: { app: { baseUrl: 'http://localhost:3000' } },
});

const Wrapper = ({ children }: { children: ReactNode }) => {
  return (
    <TestApiProvider
      apis={[
        [fetchApiRef, fetchApiMock],
        [discoveryApiRef, mockApis.discovery()],
        [scmIntegrationsApiRef, {}],
        [configApiRef, configApi],
        [techdocsApiRef, techdocsApiMock],
        [techdocsStorageApiRef, techdocsStorageApiMock],
        [entityPresentationApiRef, entityPresentationApiMock],
        [catalogApiRef, catalogApiMock],
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
  const mockNavigate = jest.fn();

  beforeEach(() => {
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);
    getCookie.mockResolvedValue({
      // Expires in 10 minutes
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });

    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
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
    expect(rendered.container.querySelector('header')).not.toBeInTheDocument();
    expect(rendered.container.querySelector('article')).not.toBeInTheDocument();
    expect(rendered.getByText('techdocs reader page')).toBeInTheDocument();
  });

  it('should render techdocs reader page with addons', async () => {
    (Page as jest.Mock).mockImplementation(PageMock);
    const name = 'test-name';
    const namespace = 'test-namespace';
    const kind = 'test';

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

  it('should render techdocs reader page with addons and page', async () => {
    (Page as jest.Mock).mockImplementation(PageMock);
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

  it('should apply overrideThemeOptions', async () => {
    const overrideThemeOptions = {
      typography: { fontFamily: 'Comic Sans MS' },
    };

    const rendered = await renderInTestApp(
      <Wrapper>
        <TechDocsReaderPage
          entityRef={{
            name: 'test-name',
            namespace: 'test-namespace',
            kind: 'test',
          }}
          overrideThemeOptions={overrideThemeOptions}
        />
      </Wrapper>,
      {
        mountedRoutes,
      },
    );

    const text = rendered.getAllByText(mockTechDocsMetadata.site_name)[0];

    expect(text).toHaveStyle('fontFamily: Comic Sans MS');
  });

  describe('external TechDocs redirect', () => {
    beforeEach(() => {
      mockNavigate.mockClear();
      catalogApiMock.getEntityByRef.mockReset();
      catalogApiMock.getEntityByRef.mockResolvedValue(mockEntityMetadata);
    });

    it('should navigate to external URL when entity has external techdocs annotation', async () => {
      const mockEntityWithExternalAnnotation = {
        ...mockEntityMetadata,
        metadata: {
          ...mockEntityMetadata.metadata,
          annotations: {
            [TECHDOCS_EXTERNAL_ANNOTATION]:
              'component:external-namespace/external-docs',
          },
        },
      };

      catalogApiMock.getEntityByRef.mockResolvedValue(
        mockEntityWithExternalAnnotation,
      );

      await renderInTestApp(
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

      expect(mockNavigate).toHaveBeenCalledWith(
        '/docs/external-namespace/component/external-docs',
        { replace: true },
      );
    });

    it('should render normally when entity has no external techdocs annotation', async () => {
      const mockEntityWithoutExternalAnnotation = {
        ...mockEntityMetadata,
        metadata: {
          ...mockEntityMetadata.metadata,
          annotations: undefined,
        },
      };

      catalogApiMock.getEntityByRef.mockResolvedValue(
        mockEntityWithoutExternalAnnotation,
      );

      const rendered = await renderInTestApp(
        <Wrapper>
          <TechDocsReaderPage
            entityRef={{
              name: 'test-name',
              namespace: 'test-namespace',
              kind: 'test-kind',
            }}
          />
        </Wrapper>,
        {
          mountedRoutes,
        },
      );

      expect(rendered.container.querySelector('header')).toBeInTheDocument();
      expect(rendered.container.querySelector('article')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should render normally when entity has external annotation but no value', async () => {
      const mockEntityWithEmptyExternalAnnotation = {
        ...mockEntityMetadata,
        metadata: {
          ...mockEntityMetadata.metadata,
          annotations: {
            [TECHDOCS_EXTERNAL_ANNOTATION]: '',
          },
        },
      };

      catalogApiMock.getEntityByRef.mockResolvedValue(
        mockEntityWithEmptyExternalAnnotation,
      );

      const rendered = await renderInTestApp(
        <Wrapper>
          <TechDocsReaderPage
            entityRef={{
              name: 'test-name',
              namespace: 'test-namespace',
              kind: 'test-kind',
            }}
          />
        </Wrapper>,
        {
          mountedRoutes,
        },
      );

      expect(rendered.container.querySelector('header')).toBeInTheDocument();
      expect(rendered.container.querySelector('article')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });

    it('should render normally when catalog API throws an error', async () => {
      catalogApiMock.getEntityByRef.mockRejectedValue(
        new Error('Catalog API error'),
      );

      const rendered = await renderInTestApp(
        <Wrapper>
          <TechDocsReaderPage
            entityRef={{
              name: 'test-name',
              namespace: 'test-namespace',
              kind: 'test-kind',
            }}
          />
        </Wrapper>,
        {
          mountedRoutes,
        },
      );

      expect(rendered.container.querySelector('header')).toBeInTheDocument();
      expect(rendered.container.querySelector('article')).toBeInTheDocument();
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
