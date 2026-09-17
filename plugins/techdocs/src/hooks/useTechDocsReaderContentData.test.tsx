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
import {
  techdocsApiRef,
  TechDocsReaderPageProvider,
  useShadowRootElements,
} from '@backstage/plugin-techdocs-react';
import {
  renderInTestApp,
  TestApiProvider,
  mockApis,
} from '@backstage/test-utils';
import { configApiRef } from '@backstage/core-plugin-api';

const useTechDocsReaderDom = jest.fn();
jest.mock('../reader/components/TechDocsReaderPageContent/dom', () => ({
  ...jest.requireActual('../reader/components/TechDocsReaderPageContent/dom'),
  useTechDocsReaderDom: (...args: any[]) => useTechDocsReaderDom(...args),
}));
const useTechDocsReader = jest.fn();
jest.mock('../reader/components/TechDocsReaderProvider', () => ({
  ...jest.requireActual('../reader/components/TechDocsReaderProvider'),
  useTechDocsReader: (...args: any[]) => useTechDocsReader(...args),
}));
const useShadowDomStylesLoading = jest.fn().mockReturnValue(false);
jest.mock('@backstage/plugin-techdocs-react', () => ({
  ...jest.requireActual('@backstage/plugin-techdocs-react'),
  useShadowDomStylesLoading: (...args: any[]) =>
    useShadowDomStylesLoading(...args),
  useShadowRootElements: jest.fn(),
}));

import { useTechDocsReaderContentData } from './useTechDocsReaderContentData';

const mockEntityMetadata = {
  apiVersion: 'v1',
  kind: 'test',
  metadata: {
    name: 'test-name',
    namespace: 'test-namespace',
  },
  spec: { owner: 'test' },
};

const mockTechDocsMetadata = {
  site_name: 'test-site-name',
  site_description: 'test-site-desc',
};

const getEntityMetadata = jest.fn();
const getTechDocsMetadata = jest.fn();

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
      [configApiRef, mockApis.config()],
    ]}
  >
    <TechDocsReaderPageProvider entityRef={entityRef}>
      {children}
    </TechDocsReaderPageProvider>
  </TestApiProvider>
);

function HookRenderer({ defaultPath }: { defaultPath?: string }) {
  const data = useTechDocsReaderContentData({ defaultPath });
  const [, setRender] = useState(0);
  useEffect(() => setRender(r => r + 1), [data.isNotFound, data.isDomReady]);
  return (
    <div>
      <span data-testid="isNotFound">{String(data.isNotFound)}</span>
      <span data-testid="isDomReady">{String(data.isDomReady)}</span>
      <span data-testid="showProgress">{String(data.showProgress)}</span>
    </div>
  );
}

describe('useTechDocsReaderContentData', () => {
  const useShadowRootElementsMock = useShadowRootElements as jest.Mock;

  beforeEach(() => {
    useShadowRootElementsMock.mockReturnValue([]);
    jest.clearAllMocks();
  });

  it('should return ready state when DOM is loaded', async () => {
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);
    useTechDocsReaderDom.mockReturnValue(document.createElement('html'));
    useTechDocsReader.mockReturnValue({ state: 'cached' });

    await renderInTestApp(
      <Wrapper>
        <HookRenderer />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('isDomReady')).toHaveTextContent('true');
    });

    expect(screen.getByTestId('isNotFound')).toHaveTextContent('false');
    expect(screen.getByTestId('showProgress')).toHaveTextContent('false');
  });

  it('should return not found when entity metadata is missing', async () => {
    getEntityMetadata.mockResolvedValue(undefined);
    useTechDocsReaderDom.mockReturnValue(document.createElement('html'));
    useTechDocsReader.mockReturnValue({ state: 'cached' });

    await renderInTestApp(
      <Wrapper>
        <HookRenderer />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('isNotFound')).toHaveTextContent('true');
    });
  });

  it('should show progress when checking state', async () => {
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);
    useTechDocsReaderDom.mockReturnValue(document.createElement('html'));
    useTechDocsReader.mockReturnValue({ state: 'CHECKING' });

    await renderInTestApp(
      <Wrapper>
        <HookRenderer />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('showProgress')).toHaveTextContent('true');
    });
  });

  it('should show progress when styles are loading', async () => {
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);
    useTechDocsReaderDom.mockReturnValue(document.createElement('html'));
    useTechDocsReader.mockReturnValue({ state: 'cached' });
    useShadowDomStylesLoading.mockReturnValue(true);

    await renderInTestApp(
      <Wrapper>
        <HookRenderer />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(screen.getByTestId('showProgress')).toHaveTextContent('true');
    });
  });
});
