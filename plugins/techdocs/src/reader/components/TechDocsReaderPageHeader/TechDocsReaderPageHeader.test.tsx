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

import { CompoundEntityRef } from '@backstage/catalog-model';
import {
  entityPresentationApiRef,
  entityRouteRef,
} from '@backstage/plugin-catalog-react';
import {
  techdocsApiRef,
  TechDocsReaderPageProvider,
} from '@backstage/plugin-techdocs-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';

import { rootRouteRef } from '../../../routes';

import { TechDocsReaderPageHeader } from './TechDocsReaderPageHeader';
import { waitFor } from '@testing-library/react';

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

const mockUseParams = jest.fn();
mockUseParams.mockReturnValue({ '*': 'foo/bar/baz/' });

jest.mock('react-router-dom', () => {
  return {
    ...(jest.requireActual('react-router-dom') as any),
    useParams: () => mockUseParams(),
  };
});

const getEntityMetadata = jest.fn();
const getTechDocsMetadata = jest.fn();

const techdocsApiMock = {
  getEntityMetadata,
  getTechDocsMetadata,
};

const forEntity = jest.fn();

forEntity.mockReturnValue({
  snapshot: {
    primaryTitle: 'Test Entity',
  },
});

const entityPresentationApiMock = {
  forEntity,
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
  children: React.ReactNode;
}) => (
  <TestApiProvider
    apis={[
      [techdocsApiRef, techdocsApiMock],
      [entityPresentationApiRef, entityPresentationApiMock],
    ]}
  >
    <TechDocsReaderPageProvider entityRef={entityRef}>
      {children}
    </TechDocsReaderPageProvider>
  </TestApiProvider>
);

describe('<TechDocsReaderPageHeader />', () => {
  it('should render a techdocs page header', async () => {
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);

    const rendered = await renderInTestApp(
      <Wrapper>
        <TechDocsReaderPageHeader />
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
          '/docs': rootRouteRef,
        },
      },
    );

    expect(rendered.container.innerHTML).toContain('header');

    expect(rendered.getAllByText('test-site-name')).toHaveLength(2);
    expect(rendered.getByText('test-site-desc')).toBeDefined();

    expect(rendered.getByRole('link', { name: 'Test Entity' })).toHaveAttribute(
      'href',
      '/catalog/test-namespace/test/test-name',
    );
  });

  it('should render a techdocs page header even if metadata is not loaded', async () => {
    const rendered = await renderInTestApp(
      <Wrapper>
        <TechDocsReaderPageHeader />
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
          '/docs': rootRouteRef,
        },
      },
    );

    expect(rendered.container.innerHTML).toContain('header');
  });

  it('should not render a techdocs page header if entity metadata is missing', async () => {
    getEntityMetadata.mockResolvedValue(undefined);

    const rendered = await renderInTestApp(
      <Wrapper>
        <TechDocsReaderPageHeader />
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
          '/docs': rootRouteRef,
        },
      },
    );

    expect(rendered.container.innerHTML).not.toContain('header');
  });

  it('should not render a techdocs page header if techdocs metadata is missing', async () => {
    getTechDocsMetadata.mockResolvedValue(undefined);

    const rendered = await renderInTestApp(
      <Wrapper>
        <TechDocsReaderPageHeader />
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
          '/docs': rootRouteRef,
        },
      },
    );

    expect(rendered.container.innerHTML).not.toContain('header');
  });

  it('The header title changes depending on the url params', async () => {
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);

    await renderInTestApp(
      <Wrapper>
        <TechDocsReaderPageHeader />
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
          '/docs': rootRouteRef,
        },
      },
    );

    await waitFor(() => {
      expect(document.title).toEqual(
        'Backstage | Test Entity | Foo | Bar | Baz',
      );
    });
  });
});
