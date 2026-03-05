/*
 * Copyright 2021 The Backstage Authors
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

import { configApiRef } from '@backstage/core-plugin-api';
import { renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { rootDocsRouteRef } from '../../../routes';
import { DocsCardGrid } from './DocsCardGrid';

// Hacky way to mock a specific boolean config value.
const getOptionalBooleanMock = jest.fn().mockReturnValue(false);
jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: (apiRef: any) => {
    const actualUseApi = jest.requireActual(
      '@backstage/core-plugin-api',
    ).useApi;
    const actualApi = actualUseApi(apiRef);
    if (apiRef === configApiRef) {
      const configReader = actualApi;
      configReader.getOptionalBoolean = getOptionalBooleanMock;
      return configReader;
    }

    return actualApi;
  },
}));

describe('Entity Docs Card Grid', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should render all entities passed to it', async () => {
    await renderInTestApp(
      <DocsCardGrid
        entities={[
          {
            apiVersion: 'version',
            kind: 'TestKind',
            metadata: {
              name: 'testName',
            },
            spec: {
              owner: 'techdocs@example.com',
            },
          },
          {
            apiVersion: 'version',
            kind: 'TestKind2',
            metadata: {
              name: 'testName2',
            },
            spec: {
              owner: 'not-owned@example.com',
            },
          },
        ]}
      />,
      {
        mountedRoutes: {
          '/docs/:namespace/:kind/:name/*': rootDocsRouteRef,
        },
      },
    );
    expect(await screen.findByText('testName')).toBeInTheDocument();
    expect(await screen.findByText('testName2')).toBeInTheDocument();
    const [button1, button2] = await screen.findAllByRole('button');
    expect(button1.getAttribute('href')).toContain(
      '/docs/default/testkind/testname',
    );
    expect(button2.getAttribute('href')).toContain(
      '/docs/default/testkind2/testname2',
    );
  });

  it('should fall back to case-sensitive links when configured', async () => {
    getOptionalBooleanMock.mockReturnValue(true);

    await renderInTestApp(
      <DocsCardGrid
        entities={[
          {
            apiVersion: 'version',
            kind: 'TestKind',
            metadata: {
              name: 'testName',
              namespace: 'SomeNamespace',
            },
            spec: {
              owner: 'techdocs@example.com',
            },
          },
        ]}
      />,
      {
        mountedRoutes: {
          '/techdocs/:namespace/:kind/:name/*': rootDocsRouteRef,
        },
      },
    );

    const button = await screen.findByRole('button');
    expect(getOptionalBooleanMock).toHaveBeenCalledWith(
      'techdocs.legacyUseCaseSensitiveTripletPaths',
    );
    expect(button.getAttribute('href')).toContain(
      '/techdocs/SomeNamespace/TestKind/testName',
    );
  });

  it('should render entity title if available', async () => {
    await renderInTestApp(
      <DocsCardGrid
        entities={[
          {
            apiVersion: 'version',
            kind: 'TestKind',
            metadata: {
              name: 'testName',
              title: 'TestTitle',
            },
            spec: {
              owner: 'techdocs@example.com',
            },
          },
        ]}
      />,
      {
        mountedRoutes: {
          '/docs/:namespace/:kind/:name/*': rootDocsRouteRef,
        },
      },
    );
    expect(await screen.findByText('TestTitle')).toBeInTheDocument();
  });
});
