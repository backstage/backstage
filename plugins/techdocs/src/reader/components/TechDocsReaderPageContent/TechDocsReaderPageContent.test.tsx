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
import { act, waitFor } from '@testing-library/react';

import { ThemeProvider } from '@material-ui/core';

import { lightTheme } from '@backstage/theme';
import { CompoundEntityRef } from '@backstage/catalog-model';
import {
  techdocsApiRef,
  TechDocsReaderPageProvider,
  techdocsStorageApiRef,
} from '@backstage/plugin-techdocs-react';
import { searchApiRef } from '@backstage/plugin-search-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';

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

const mockEntityDocs = '<html/>';
const mockSyncDocs = 'cached';

const getEntityDocs = jest.fn();
const syncEntityDocs = jest.fn();

const techdocsStorageApiMock = {
  getEntityDocs,
  syncEntityDocs,
};

const searchApiMock = {
  query: jest.fn().mockResolvedValue({ results: [] }),
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
    <TestApiProvider
      apis={[
        [techdocsApiRef, techdocsApiMock],
        [techdocsStorageApiRef, techdocsStorageApiMock],
        [searchApiRef, searchApiMock],
      ]}
    >
      <TechDocsReaderPageProvider entityRef={entityRef}>
        {children}
      </TechDocsReaderPageProvider>
    </TestApiProvider>
  </ThemeProvider>
);

describe('<TechDocsReaderPageContent />', () => {
  it('should render techdocs page content', async () => {
    getEntityDocs.mockReturnValue(mockEntityDocs);
    getEntityMetadata.mockResolvedValue(mockEntityMetadata);
    getTechDocsMetadata.mockResolvedValue(mockTechDocsMetadata);
    syncEntityDocs.mockResolvedValue(mockSyncDocs);

    await act(async () => {
      const rendered = await renderInTestApp(
        <Wrapper>
          <TechDocsReaderPageContent>Children</TechDocsReaderPageContent>
        </Wrapper>,
      );

      await waitFor(() => {
        expect(rendered.getByText('Children')).toBeInTheDocument();
      });
    });
  });

  it('should not render techdocs content if entity metadata is missing', async () => {
    getEntityDocs.mockReturnValue(mockEntityDocs);
    getEntityMetadata.mockResolvedValue(undefined);
    syncEntityDocs.mockResolvedValue(mockSyncDocs);

    await act(async () => {
      const rendered = await renderInTestApp(
        <Wrapper>
          <TechDocsReaderPageContent>Children</TechDocsReaderPageContent>
        </Wrapper>,
      );

      await waitFor(() => {
        expect(rendered.queryByText('Children')).not.toBeInTheDocument();
        expect(
          rendered.getByText('ERROR 404: PAGE NOT FOUND'),
        ).toBeInTheDocument();
      });
    });
  });
});
