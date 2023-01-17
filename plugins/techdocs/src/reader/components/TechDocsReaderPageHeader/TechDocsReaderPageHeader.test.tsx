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
import { act, waitFor } from '@testing-library/react';

import { CompoundEntityRef } from '@backstage/catalog-model';
import { entityRouteRef } from '@backstage/plugin-catalog-react';
import {
  techdocsApiRef,
  TechDocsReaderPageProvider,
} from '@backstage/plugin-techdocs-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';

import { rootRouteRef } from '../../../routes';

import { TechDocsReaderPageHeader } from './TechDocsReaderPageHeader';

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
  <TestApiProvider apis={[[techdocsApiRef, techdocsApiMock]]}>
    <TechDocsReaderPageProvider entityRef={entityRef}>
      {children}
    </TechDocsReaderPageProvider>
  </TestApiProvider>
);

describe('<TechDocsReaderPageHeader />', () => {
  it('should render a techdocs page header', async () => {
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);

    await act(async () => {
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

      await waitFor(() => {
        expect(rendered.getAllByText('test-site-name')).toHaveLength(2);
      });

      expect(rendered.getByText('test-site-desc')).toBeDefined();
    });
  });

  it('should render a techdocs page header even if metadata is not loaded', async () => {
    await act(async () => {
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
  });

  it('should not render a techdocs page header if entity metadata is missing', async () => {
    getEntityMetadata.mockResolvedValue(undefined);

    await act(async () => {
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

      await waitFor(() => {
        expect(rendered.container.innerHTML).not.toContain('header');
      });
    });
  });

  it('should not render a techdocs page header if techdocs metadata is missing', async () => {
    getTechDocsMetadata.mockResolvedValue(undefined);

    await act(async () => {
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

      await waitFor(() => {
        expect(rendered.container.innerHTML).not.toContain('header');
      });
    });
  });

  it('should render a link back to the component page', async () => {
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);

    await act(async () => {
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

      await waitFor(() => {
        expect(
          rendered.getByRole('link', { name: 'test:test-namespace/test-name' }),
        ).toHaveAttribute('href', '/catalog/test-namespace/test/test-name');
      });
    });
  });
});
