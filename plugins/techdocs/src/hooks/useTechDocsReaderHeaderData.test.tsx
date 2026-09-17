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
import { ReactNode, useState, useEffect } from 'react';
import { waitFor, screen } from '@testing-library/react';

import { CompoundEntityRef } from '@backstage/catalog-model';
import { entityPresentationApiRef } from '@backstage/plugin-catalog-react';
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

import { useTechDocsReaderHeaderData } from './useTechDocsReaderHeaderData';

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

let useParamsPath = '/';
jest.mock('react-router-dom', () => {
  return {
    ...(jest.requireActual('react-router-dom') as any),
    useParams: () => ({ '*': useParamsPath }),
  };
});

const getEntityMetadata = jest.fn();
const getTechDocsMetadata = jest.fn();

const forEntity = jest.fn().mockReturnValue({
  snapshot: { primaryTitle: 'Test Entity' },
});

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
      [techdocsApiRef, { getEntityMetadata, getTechDocsMetadata }],
      [entityPresentationApiRef, { forEntity }],
      [configApiRef, mockApis.config()],
    ]}
  >
    <TechDocsReaderPageProvider entityRef={entityRef}>
      {children}
    </TechDocsReaderPageProvider>
  </TestApiProvider>
);

function HookRenderer() {
  const data = useTechDocsReaderHeaderData();
  const [, setRender] = useState(0);
  useEffect(() => setRender(r => r + 1), [data.hidden, data.title]);
  return (
    <div>
      <span data-testid="hidden">{String(data.hidden)}</span>
      <span data-testid="title">{data.title || ''}</span>
      <span data-testid="tabTitle">{data.tabTitle}</span>
      <span data-testid="showSourceLink">{String(data.showSourceLink)}</span>
      <span data-testid="sourceLink">{data.sourceLink || ''}</span>
    </div>
  );
}

describe('useTechDocsReaderHeaderData', () => {
  beforeEach(() => {
    useParamsPath = '/';
    jest.clearAllMocks();
    forEntity.mockReturnValue({
      snapshot: { primaryTitle: 'Test Entity' },
    });
  });

  it('should return header data when metadata is loaded', async () => {
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);

    await renderInTestApp(
      <Wrapper>
        <HookRenderer />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('hidden')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('title')).toHaveTextContent('test-site-name');
    expect(screen.getByTestId('showSourceLink')).toHaveTextContent('true');
    expect(screen.getByTestId('sourceLink')).toHaveTextContent(
      'https://example.com/',
    );
  });

  it('should be hidden when entity metadata is missing', async () => {
    getEntityMetadata.mockResolvedValue(undefined);

    await renderInTestApp(
      <Wrapper>
        <HookRenderer />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('hidden')).toHaveTextContent('true');
    });
  });

  it('should be hidden when techdocs metadata is missing', async () => {
    getTechDocsMetadata.mockResolvedValue(undefined);

    await renderInTestApp(
      <Wrapper>
        <HookRenderer />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('hidden')).toHaveTextContent('true');
    });
  });

  it('should not show source link for local docs', async () => {
    getEntityMetadata.mockResolvedValue({
      ...mockEntityMetadata,
      locationMetadata: { type: 'dir', target: '/local/path' },
    });
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);

    await renderInTestApp(
      <Wrapper>
        <HookRenderer />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('hidden')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('showSourceLink')).toHaveTextContent('false');
  });

  it('should compute tab title from URL path segments', async () => {
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);

    useParamsPath = 'foo/bar/baz/';
    await renderInTestApp(
      <Wrapper>
        <HookRenderer />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('hidden')).toHaveTextContent('false');
    });

    expect(screen.getByTestId('tabTitle')).toHaveTextContent(
      'Test Entity | Foo | Bar | Baz | Backstage',
    );
  });
});
