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
import { TechDocsReaderPage } from './TechDocsReaderPage';
import { render, waitFor } from '@testing-library/react';

import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { ConfigReader } from '@backstage/config';
import { Header } from '@backstage/core-components';
import { ApiProvider } from '@backstage/core-app-api';
import { searchApiRef } from '@backstage/plugin-search';
import { TestApiRegistry, wrapInTestApp } from '@backstage/test-utils';

import {
  techdocsApiRef,
  TechDocsApi,
  techdocsStorageApiRef,
  TechDocsStorageApi,
} from '../../../api';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: jest.fn().mockReturnValue({
      entityRef: 'Component::backstage',
    }),
  };
});

jest.mock('@backstage/plugin-techdocs-mkdocs', () => {
  const actual = jest.requireActual('@backstage/plugin-techdocs-mkdocs');
  return {
    ...actual,
    techDocsReaderPage: <div data-testid="techdocs-content" />,
  };
});

jest.mock('../TechDocsReaderPageHeader', () => {
  return {
    __esModule: true,
    TechDocsReaderPageHeader: () => <div />,
  };
});

global.scroll = jest.fn();

const scmIntegrationsApi = ScmIntegrationsApi.fromConfig(
  new ConfigReader({ integrations: {} }),
);

const techdocsApi: Partial<TechDocsApi> = {
  getEntityMetadata: jest.fn().mockResolvedValue({
    apiVersion: 'v1',
    kind: 'Component',
    metadata: {
      name: 'backstage',
    },
  }),
  getTechDocsMetadata: jest.fn().mockResolvedValue({
    site_name: 'Backstage',
    site_description: 'Backstage is an open-source developer portal.',
  }),
};

const techdocsStorageApi: Partial<TechDocsStorageApi> = {
  getEntityDocs: jest.fn().mockResolvedValue('<html />'),
  getBaseUrl: jest.fn().mockResolvedValue('https://backstage.io/docs'),
  getApiOrigin: jest.fn().mockResolvedValue('backstage.io'),
};

const searchApi = {
  query: jest.fn().mockResolvedValue({ results: [] }),
};

const apiRegistry = TestApiRegistry.from(
  [scmIntegrationsApiRef, scmIntegrationsApi],
  [techdocsApiRef, techdocsApi],
  [techdocsStorageApiRef, techdocsStorageApi],
  [searchApiRef, searchApi],
);

describe('<TechDocsReaderPage />', () => {
  it('should render default techdocs page', async () => {
    const rendered = render(
      wrapInTestApp(
        <ApiProvider apis={apiRegistry}>
          <TechDocsReaderPage />
        </ApiProvider>,
      ),
    );

    await waitFor(() => {
      expect(rendered.getByTestId('techdocs-content')).toBeInTheDocument();
    });
  });

  it('should render techdocs page with custom header', async () => {
    const rendered = render(
      wrapInTestApp(
        <ApiProvider apis={apiRegistry}>
          <TechDocsReaderPage>
            {({ techdocsMetadataValue }) => (
              <Header
                type="documentation"
                title="A custom header"
                subtitle={techdocsMetadataValue?.site_name}
              />
            )}
          </TechDocsReaderPage>
        </ApiProvider>,
      ),
    );

    await waitFor(() => {
      expect(rendered.getByText('A custom header')).toBeInTheDocument();
    });
  });
});
