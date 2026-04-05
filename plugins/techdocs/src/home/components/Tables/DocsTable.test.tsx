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

import { vi } from 'vitest';

import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import { configApiRef } from '@backstage/core-plugin-api';
import { DocsTable } from './DocsTable';
import { rootDocsRouteRef } from '../../../routes';
import { entityRouteRef } from '@backstage/plugin-catalog-react';

// Hacky way to mock a specific boolean config value.
const getOptionalBooleanMock = vi.fn().mockReturnValue(false);
vi.mock('@backstage/core-plugin-api', async () => {
  const actual = await vi.importActual<
    typeof import('@backstage/core-plugin-api')
  >('@backstage/core-plugin-api');
  return {
    ...actual,
    useApi: (apiRef: any) => {
      const actualApi = actual.useApi(apiRef);
      if (apiRef === configApiRef) {
        (actualApi as any).getOptionalBoolean = getOptionalBooleanMock;
        return actualApi;
      }

      return actualApi;
    },
  };
});

describe('DocsTable test', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should render documents passed', async () => {
    await renderInTestApp(
      <DocsTable
        entities={[
          {
            apiVersion: 'version',
            kind: 'TestKind',
            metadata: {
              name: 'testName',
            },
            spec: {
              owner: 'user:owned',
            },
            relations: [
              {
                targetRef: 'user:default/owned',
                type: 'ownedBy',
              },
            ],
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
            relations: [
              {
                targetRef: 'user:default/not-owned',
                type: 'ownedBy',
              },
            ],
          },
        ]}
      />,
      {
        mountedRoutes: {
          '/docs/:namespace/:kind/:name/*': rootDocsRouteRef,
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    const link1 = await screen.findByText('testName');
    const link2 = await screen.findByText('testName2');
    expect(link1).toBeInTheDocument();
    expect(link1.getAttribute('href')).toContain(
      '/docs/default/testkind/testname',
    );
    expect(link2).toBeInTheDocument();
    expect(link2.getAttribute('href')).toContain(
      '/docs/default/testkind2/testname2',
    );
  });

  it('should fall back to case-sensitive links when configured', async () => {
    getOptionalBooleanMock.mockReturnValue(true);

    await renderInTestApp(
      <DocsTable
        entities={[
          {
            apiVersion: 'version',
            kind: 'TestKind',
            metadata: {
              name: 'testName',
              namespace: 'SomeNamespace',
            },
            spec: {
              owner: 'user:owned',
            },
            relations: [
              {
                targetRef: 'user:default/owned',
                type: 'ownedBy',
              },
            ],
          },
        ]}
      />,
      {
        mountedRoutes: {
          '/techdocs/:namespace/:kind/:name/*': rootDocsRouteRef,
          '/catalog/:namespace/:kind/:name': entityRouteRef,
        },
      },
    );

    const button = await screen.findByText('testName');
    expect(getOptionalBooleanMock).toHaveBeenCalledWith(
      'techdocs.legacyUseCaseSensitiveTripletPaths',
    );
    expect(button.getAttribute('href')).toContain(
      '/techdocs/SomeNamespace/TestKind/testName',
    );
  });

  it('should render empty state if no owned documents exist', async () => {
    await renderInTestApp(<DocsTable entities={[]} />, {
      mountedRoutes: {
        '/docs/:namespace/:kind/:name/*': rootDocsRouteRef,
        '/catalog/:namespace/:kind/:name': entityRouteRef,
      },
    });

    expect(await screen.findByText('No documents to show')).toBeInTheDocument();
  });
});
