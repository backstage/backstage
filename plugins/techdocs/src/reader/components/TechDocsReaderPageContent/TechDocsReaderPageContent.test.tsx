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
import React from 'react';
import { waitFor } from '@testing-library/react';

import { CompoundEntityRef } from '@backstage/catalog-model';
import {
  techdocsApiRef,
  TechDocsReaderPageProvider,
  useShadowRootElements,
} from '@backstage/plugin-techdocs-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';

const useTechDocsReaderDom = jest.fn();
jest.mock('./dom', () => ({
  ...jest.requireActual('./dom'),
  useTechDocsReaderDom: (...args: any[]) => useTechDocsReaderDom(...args),
}));
const useReaderState = jest.fn();
jest.mock('../useReaderState', () => ({
  ...jest.requireActual('../useReaderState'),
  useReaderState: (...args: any[]) => useReaderState(...args),
}));
const useShadowDomStylesLoading = jest.fn().mockReturnValue(false);
jest.mock('@backstage/plugin-techdocs-react', () => ({
  ...jest.requireActual('@backstage/plugin-techdocs-react'),
  useShadowDomStylesLoading: (...args: any[]) =>
    useShadowDomStylesLoading(...args),
  useShadowRootElements: jest.fn(),
}));

import { TechDocsReaderPageContent } from './TechDocsReaderPageContent';

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

describe('<TechDocsReaderPageContent />', () => {
  const useShadowRootElementsMock = useShadowRootElements as jest.Mock;

  beforeEach(() => {
    useShadowRootElementsMock.mockReturnValue([]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render techdocs page content', async () => {
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);
    useTechDocsReaderDom.mockReturnValue(document.createElement('html'));
    useReaderState.mockReturnValue({ state: 'cached' });

    const rendered = await renderInTestApp(
      <Wrapper>
        <TechDocsReaderPageContent withSearch={false} />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(
        rendered.getByTestId('techdocs-native-shadowroot'),
      ).toBeInTheDocument();
    });
  });

  it('should not render techdocs content if entity metadata is missing', async () => {
    getEntityMetadata.mockResolvedValue(undefined);
    useTechDocsReaderDom.mockReturnValue(document.createElement('html'));
    useReaderState.mockReturnValue({ state: 'cached' });

    await expect(
      renderInTestApp(
        <Wrapper>
          <TechDocsReaderPageContent withSearch={false} />
        </Wrapper>,
      ),
    ).rejects.toThrow('Reached NotFound Page');

    // Check the global document for the absence of the shadow root
    const shadowRoot = document.querySelector(
      '[data-testid="techdocs-native-shadowroot"]',
    );
    expect(shadowRoot).not.toBeInTheDocument();
  });

  it('should render 404 if there is no dom and reader state is not found', async () => {
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);
    useTechDocsReaderDom.mockReturnValue(undefined);
    useReaderState.mockReturnValue({ state: 'CONTENT_NOT_FOUND' });

    const rendered = await renderInTestApp(
      <Wrapper>
        <TechDocsReaderPageContent withSearch={false} />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(
        rendered.queryByTestId('techdocs-native-shadowroot'),
      ).not.toBeInTheDocument();
      expect(
        rendered.getByText('ERROR 404: Documentation not found'),
      ).toBeInTheDocument();
    });
  });

  it('should scroll to header if hash is not present in url', async () => {
    jest.spyOn(document, 'querySelector');

    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);
    useTechDocsReaderDom.mockReturnValue(document.createElement('html'));
    useReaderState.mockReturnValue({ state: 'cached' });

    const rendered = await renderInTestApp(
      <Wrapper>
        <TechDocsReaderPageContent withSearch={false} />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(
        rendered.getByTestId('techdocs-native-shadowroot'),
      ).toBeInTheDocument();

      expect(document.querySelector).toHaveBeenCalledWith('header');
    });
  });

  it('should scroll to hash if hash is present in url', async () => {
    jest.spyOn(document, 'querySelector');

    const mockScrollIntoView = jest.fn();
    const h2 = document.createElement('h2');
    h2.innerText = 'emojis';
    h2.id = 'emojis';
    h2.scrollIntoView = mockScrollIntoView;
    const mockTechDocsPage = document.createElement('html');
    mockTechDocsPage.appendChild(h2);

    useShadowRootElementsMock.mockReturnValue([h2]);
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);
    useTechDocsReaderDom.mockReturnValue(mockTechDocsPage);
    useReaderState.mockReturnValue({ state: 'cached' });

    window.location.hash = '#emojis';

    const rendered = await renderInTestApp(
      <Wrapper>
        <TechDocsReaderPageContent withSearch={false} />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(
        rendered.getByTestId('techdocs-native-shadowroot'),
      ).toBeInTheDocument();
      expect(mockScrollIntoView).toHaveBeenCalled();
      expect(document.querySelector).not.toHaveBeenCalledWith('header');
    });

    window.location.hash = '';
  });

  it('should render progress bar when content is loading', async () => {
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);
    useTechDocsReaderDom.mockReturnValue(document.createElement('html'));
    useReaderState.mockReturnValue({ state: 'CHECKING' });

    const rendered = await renderInTestApp(
      <Wrapper>
        <TechDocsReaderPageContent withSearch={false} />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(rendered.queryByRole('progressbar')).toBeInTheDocument();
    });
  });

  it('should render progress bar when styles are loading', async () => {
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);
    useTechDocsReaderDom.mockReturnValue(document.createElement('html'));
    useReaderState.mockReturnValue({ state: 'cached' });
    useShadowDomStylesLoading.mockReturnValue(true);

    const rendered = await renderInTestApp(
      <Wrapper>
        <TechDocsReaderPageContent withSearch={false} />
      </Wrapper>,
    );

    await waitFor(() => {
      expect(rendered.queryByRole('progressbar')).toBeInTheDocument();
    });
  });
});
