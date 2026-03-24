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
import { ReactNode } from 'react';

import { CompoundEntityRef, RELATION_OWNED_BY } from '@backstage/catalog-model';
import { entityRouteRef } from '@backstage/plugin-catalog-react';
import {
  techdocsApiRef,
  TechDocsReaderPageProvider,
} from '@backstage/plugin-techdocs-react';
import {
  renderInTestApp,
  TestApiProvider,
  mockApis,
} from '@backstage/test-utils';
import { configApiRef } from '@backstage/core-plugin-api';
import { searchApiRef, MockSearchApi } from '@backstage/plugin-search-react';

import { TechDocsReaderEntityCard } from './TechDocsReaderEntityCard';

const mockEntityMetadata = {
  apiVersion: 'v1',
  kind: 'Component',
  metadata: {
    name: 'test-component',
    namespace: 'default',
    title: 'Test Component Title',
  },
  spec: {
    owner: 'team-a',
    lifecycle: 'production',
  },
  relations: [
    {
      type: RELATION_OWNED_BY,
      targetRef: 'group:default/team-a',
    },
  ],
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

const Wrapper = ({
  entityRef = {
    kind: mockEntityMetadata.kind,
    name: mockEntityMetadata.metadata.name,
    namespace: mockEntityMetadata.metadata.namespace!!,
  },
  children,
}: {
  entityRef?: CompoundEntityRef;
  children: ReactNode;
}) => (
  <TestApiProvider
    apis={[
      [techdocsApiRef, techdocsApiMock],
      [configApiRef, mockApis.config()],
      [searchApiRef, new MockSearchApi()],
    ]}
  >
    <TechDocsReaderPageProvider entityRef={entityRef}>
      {children}
    </TechDocsReaderPageProvider>
  </TestApiProvider>
);

const mountedRoutes = {
  '/catalog/:namespace/:kind/:name/*': entityRouteRef,
};

describe('<TechDocsReaderEntityCard />', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render entity kind, owner, and lifecycle', async () => {
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);

    const rendered = await renderInTestApp(
      <Wrapper>
        <TechDocsReaderEntityCard />
      </Wrapper>,
      { mountedRoutes },
    );

    expect(await rendered.findByText('Component:')).toBeInTheDocument();
    expect(rendered.getByText('Owner:')).toBeInTheDocument();
    expect(rendered.getByText('Lifecycle:')).toBeInTheDocument();
    expect(rendered.getByText('production')).toBeInTheDocument();
  });

  it('should not render when entity metadata is loading', async () => {
    // Don't resolve the metadata — it stays in loading state
    getEntityMetadata.mockReturnValue(new Promise(() => {}));
    getTechDocsMetadata.mockReturnValue(new Promise(() => {}));

    const rendered = await renderInTestApp(
      <Wrapper>
        <TechDocsReaderEntityCard />
      </Wrapper>,
      { mountedRoutes },
    );

    expect(rendered.queryByText('Component:')).not.toBeInTheDocument();
  });

  it('should not render when entity metadata is missing', async () => {
    getEntityMetadata.mockResolvedValue(undefined);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);

    const rendered = await renderInTestApp(
      <Wrapper>
        <TechDocsReaderEntityCard />
      </Wrapper>,
      { mountedRoutes },
    );

    expect(rendered.queryByText('Component:')).not.toBeInTheDocument();
  });

  it('should not render lifecycle when not present', async () => {
    getEntityMetadata.mockResolvedValue({
      ...mockEntityMetadata,
      spec: { owner: 'team-a' },
    });
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);

    const rendered = await renderInTestApp(
      <Wrapper>
        <TechDocsReaderEntityCard />
      </Wrapper>,
      { mountedRoutes },
    );

    expect(await rendered.findByText('Component:')).toBeInTheDocument();
    expect(rendered.queryByText('Lifecycle:')).not.toBeInTheDocument();
  });

  it('should not render owner when no owned-by relations exist', async () => {
    getEntityMetadata.mockResolvedValue({
      ...mockEntityMetadata,
      relations: [],
    });
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);

    const rendered = await renderInTestApp(
      <Wrapper>
        <TechDocsReaderEntityCard />
      </Wrapper>,
      { mountedRoutes },
    );

    expect(await rendered.findByText('Component:')).toBeInTheDocument();
    expect(rendered.queryByText('Owner:')).not.toBeInTheDocument();
  });

  it('should render search when withSearch is true', async () => {
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);

    const rendered = await renderInTestApp(
      <Wrapper>
        <TechDocsReaderEntityCard withSearch />
      </Wrapper>,
      { mountedRoutes },
    );

    expect(await rendered.findByText('Component:')).toBeInTheDocument();
    expect(
      rendered.getByRole('searchbox', { name: 'Search docs' }),
    ).toBeInTheDocument();
  });

  it('should not render search when withSearch is false', async () => {
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);

    const rendered = await renderInTestApp(
      <Wrapper>
        <TechDocsReaderEntityCard />
      </Wrapper>,
      { mountedRoutes },
    );

    expect(await rendered.findByText('Component:')).toBeInTheDocument();
    expect(
      rendered.queryByRole('searchbox', { name: 'Search docs' }),
    ).not.toBeInTheDocument();
  });
});
