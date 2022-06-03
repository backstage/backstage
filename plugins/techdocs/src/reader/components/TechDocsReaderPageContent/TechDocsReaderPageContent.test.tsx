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
jest.mock('./dom', () => ({
  ...jest.requireActual('./dom'),
  useTechDocsReaderDom: jest.fn(),
}));

jest.mock('../useReaderState', () => ({
  ...jest.requireActual('../useReaderState'),
  useReaderState: jest.fn(),
}));

import React from 'react';
import { act, waitFor } from '@testing-library/react';

import { ThemeProvider } from '@material-ui/core';

import { lightTheme } from '@backstage/theme';
import { CompoundEntityRef } from '@backstage/catalog-model';
import {
  techdocsApiRef,
  TechDocsReaderPageProvider,
} from '@backstage/plugin-techdocs-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { useTechDocsReaderDom } from './dom';
import { useReaderState } from '../useReaderState';
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
  <ThemeProvider theme={lightTheme}>
    <TestApiProvider apis={[[techdocsApiRef, techdocsApiMock]]}>
      <TechDocsReaderPageProvider entityRef={entityRef}>
        {children}
      </TechDocsReaderPageProvider>
    </TestApiProvider>
  </ThemeProvider>
);

describe('<TechDocsReaderPageContent />', () => {
  it('should render techdocs page content', async () => {
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);
    (useTechDocsReaderDom as jest.Mock).mockReturnValue(
      document.createElement('html'),
    );
    (useReaderState as jest.Mock).mockReturnValue({ state: 'cached' });

    await act(async () => {
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
  });

  it('should not render techdocs content if entity metadata is missing', async () => {
    getEntityMetadata.mockResolvedValue(undefined);
    (useTechDocsReaderDom as jest.Mock).mockReturnValue(
      document.createElement('html'),
    );
    (useReaderState as jest.Mock).mockReturnValue({ state: 'cached' });

    await act(async () => {
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
          rendered.getByText('ERROR 404: PAGE NOT FOUND'),
        ).toBeInTheDocument();
      });
    });
  });

  it('should render 404 if there is no dom and reader state is not found', async () => {
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);
    (useTechDocsReaderDom as jest.Mock).mockReturnValue(undefined);
    (useReaderState as jest.Mock).mockReturnValue({
      state: 'CONTENT_NOT_FOUND',
    });

    await act(async () => {
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
  });
});
