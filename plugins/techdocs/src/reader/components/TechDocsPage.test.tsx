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
import { TechDocsPage } from './TechDocsPage';
import { render, act } from '@testing-library/react';
import { ConfigReader } from '@backstage/config';
import {
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { wrapInTestApp } from '@backstage/test-utils';
import { Header } from '@backstage/core-components';
import {
  techdocsApiRef,
  TechDocsApi,
  techdocsStorageApiRef,
  TechDocsStorageApi,
} from '../../api';
import { ApiRegistry, ApiProvider } from '@backstage/core-app-api';
import { searchApiRef } from '@backstage/plugin-search';

jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useParams: jest.fn(),
  };
});

jest.mock('./TechDocsPageHeader', () => {
  return {
    __esModule: true,
    TechDocsPageHeader: () => <div />,
  };
});

const { useParams }: { useParams: jest.Mock } =
  jest.requireMock('react-router-dom');
global.scroll = jest.fn();

describe('<TechDocsPage />', () => {
  it('should render techdocs page', async () => {
    useParams.mockReturnValue({
      entityRef: 'Component::backstage',
    });

    const scmIntegrationsApi: ScmIntegrationsApi =
      ScmIntegrationsApi.fromConfig(
        new ConfigReader({
          integrations: {},
        }),
      );
    const techdocsApi: Partial<TechDocsApi> = {
      getEntityMetadata: () =>
        Promise.resolve({
          apiVersion: 'v1',
          kind: 'Component',
          metadata: {
            name: 'backstage',
          },
        }),
      getTechDocsMetadata: () =>
        Promise.resolve({
          site_name: 'string',
          site_description: 'string',
        }),
    };

    const techdocsStorageApi: Partial<TechDocsStorageApi> = {
      getEntityDocs: (): Promise<string> => Promise.resolve('String'),
      getBaseUrl: (): Promise<string> => Promise.resolve('String'),
      getApiOrigin: (): Promise<string> => Promise.resolve('String'),
    };
    const searchApi = {
      query: () =>
        Promise.resolve({
          results: [],
        }),
    };
    const apiRegistry = ApiRegistry.from([
      [scmIntegrationsApiRef, scmIntegrationsApi],
      [techdocsApiRef, techdocsApi],
      [techdocsStorageApiRef, techdocsStorageApi],
      [searchApiRef, searchApi],
    ]);

    await act(async () => {
      const rendered = render(
        wrapInTestApp(
          <ApiProvider apis={apiRegistry}>
            <TechDocsPage />
          </ApiProvider>,
        ),
      );
      expect(rendered.getByTestId('techdocs-content')).toBeInTheDocument();
    });
  });

  it('should render techdocs page with custom header', async () => {
    useParams.mockReturnValue({
      entityRef: 'Component::backstage',
    });

    const scmIntegrationsApi: ScmIntegrationsApi =
      ScmIntegrationsApi.fromConfig(
        new ConfigReader({
          integrations: {},
        }),
      );
    const techdocsApi: Partial<TechDocsApi> = {
      getEntityMetadata: () =>
        Promise.resolve({
          apiVersion: 'v1',
          kind: 'Component',
          metadata: {
            name: 'backstage',
          },
        }),
      getTechDocsMetadata: () =>
        Promise.resolve({
          site_name: 'string',
          site_description: 'string',
        }),
    };

    const techdocsStorageApi: Partial<TechDocsStorageApi> = {
      getEntityDocs: (): Promise<string> => Promise.resolve('String'),
      getBaseUrl: (): Promise<string> => Promise.resolve('String'),
      getApiOrigin: (): Promise<string> => Promise.resolve('String'),
    };
    const searchApi = {
      query: () =>
        Promise.resolve({
          results: [],
        }),
    };
    const apiRegistry = ApiRegistry.from([
      [scmIntegrationsApiRef, scmIntegrationsApi],
      [techdocsApiRef, techdocsApi],
      [techdocsStorageApiRef, techdocsStorageApi],
      [searchApiRef, searchApi],
    ]);

    await act(async () => {
      const rendered = render(
        wrapInTestApp(
          <ApiProvider apis={apiRegistry}>
            <TechDocsPage>
              {({ techdocsMetadataValue }) => (
                <Header
                  type="documentation"
                  title="A custom header"
                  subtitle={techdocsMetadataValue?.site_name}
                />
              )}
            </TechDocsPage>
          </ApiProvider>,
        ),
      );
      expect(rendered.getByText('A custom header')).toBeInTheDocument();
    });
  });
});
