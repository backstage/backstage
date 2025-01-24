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

import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { entityPresentationApiRef } from '@backstage/plugin-catalog-react';
import { DefaultEntityPresentationApi } from '@backstage/plugin-catalog';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';

import React from 'react';
import { rootDocsRouteRef } from '../../../routes';
import { InfoCardGrid } from './InfoCardGrid';

describe('Entity Info Card Grid', () => {
  const catalogApi = catalogApiMock();
  let Wrapper: React.ComponentType<React.PropsWithChildren<{}>>;

  beforeEach(() => {
    jest.resetAllMocks();
    Wrapper = ({ children }: { children?: React.ReactNode }) => (
      <TestApiProvider
        apis={[
          [
            entityPresentationApiRef,
            DefaultEntityPresentationApi.create({ catalogApi }),
          ],
        ]}
      >
        {children}
      </TestApiProvider>
    );
  });

  it('should render multiple entities', async () => {
    await renderInTestApp(
      <Wrapper>
        <InfoCardGrid
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
            {
              apiVersion: 'version',
              kind: 'TestKind2',
              metadata: {
                name: 'testName2',
                title: 'TestTitle2',
              },
              spec: {
                owner: 'techdocs2@example.com',
              },
            },
          ]}
        />
      </Wrapper>,
      {
        mountedRoutes: {
          '/docs/:namespace/:kind/:name/*': rootDocsRouteRef,
        },
      },
    );

    expect(await screen.findByText('TestTitle')).toBeInTheDocument();
    expect(await screen.findByText('TestTitle2')).toBeInTheDocument();
  });

  it('should render links correctly', async () => {
    await renderInTestApp(
      <Wrapper>
        <InfoCardGrid
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
            {
              apiVersion: 'version',
              kind: 'TestKind2',
              metadata: {
                name: 'testName2',
                title: 'TestTitle2',
              },
              spec: {
                owner: 'techdocs2@example.com',
              },
            },
          ]}
        />
      </Wrapper>,
      {
        mountedRoutes: {
          '/docs/:namespace/:kind/:name/*': rootDocsRouteRef,
        },
      },
    );

    expect(await screen.findByText('TestTitle')).toBeInTheDocument();
    expect(await screen.findByText('TestTitle2')).toBeInTheDocument();
    const [button1, button2] = await screen.findAllByTestId('read-docs-link');
    expect(button1.getAttribute('href')).toContain(
      '/docs/default/testkind/testname',
    );
    expect(button2.getAttribute('href')).toContain(
      '/docs/default/testkind2/testname2',
    );
  });

  it('should render entity title if available', async () => {
    await renderInTestApp(
      <Wrapper>
        <InfoCardGrid
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
        />
      </Wrapper>,
      {
        mountedRoutes: {
          '/docs/:namespace/:kind/:name/*': rootDocsRouteRef,
        },
      },
    );

    expect(await screen.findByText('TestTitle')).toBeInTheDocument();
  });

  it('should render entity name if title is not available', async () => {
    await renderInTestApp(
      <Wrapper>
        <InfoCardGrid
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
          ]}
        />
      </Wrapper>,
      {
        mountedRoutes: {
          '/docs/:namespace/:kind/:name/*': rootDocsRouteRef,
        },
      },
    );

    expect(await screen.findByText('testName')).toBeInTheDocument();
  });
});
