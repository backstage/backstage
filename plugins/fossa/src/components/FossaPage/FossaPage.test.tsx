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

import { Entity } from '@backstage/catalog-model';
import { catalogApiRef, entityRouteRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import React from 'react';
import { FossaApi, fossaApiRef } from '../../api';
import { FossaPage } from './FossaPage';

describe('<FossaPage />', () => {
  const catalogApi = {
    addLocation: jest.fn(),
    getEntities: jest.fn(),
    getLocationByRef: jest.fn(),
    getLocationById: jest.fn(),
    removeEntityByUid: jest.fn(),
    removeLocationById: jest.fn(),
    refreshEntity: jest.fn(),
    getEntityAncestors: jest.fn(),
    getEntityFacets: jest.fn(),
    validateEntity: jest.fn(),
  };
  const fossaApi: jest.Mocked<FossaApi> = {
    getFindingSummary: jest.fn(),
    getFindingSummaries: jest.fn(),
  };
  let Wrapper: React.ComponentType;

  beforeEach(() => {
    Wrapper = ({ children }: { children?: React.ReactNode }) => (
      <TestApiProvider
        apis={[
          [fossaApiRef, fossaApi],
          [catalogApiRef, catalogApi],
        ]}
      >
        {children}
      </TestApiProvider>
    );
  });

  afterEach(() => jest.resetAllMocks());

  it('shows fossa issues', async () => {
    const entity0: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'my-name-0',
        annotations: {
          'fossa.io/project-name': 'my-name-0',
        },
      },
    };
    const entity1: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'my-name-1',
        annotations: {
          'fossa.io/project-name': 'my-name-1',
        },
      },
    };
    const entity2: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'my-name-2',
        annotations: {
          'fossa.io/project-name': 'my-name-2',
        },
      },
    };
    const entity3: Entity = {
      apiVersion: 'v1',
      kind: 'Component',
      metadata: {
        name: 'my-name-3',
      },
    };

    catalogApi.getEntities.mockResolvedValue({
      items: [entity0, entity1, entity2, entity3],
    });

    fossaApi.getFindingSummaries.mockResolvedValue(
      new Map([
        [
          'my-name-1',
          {
            timestamp: '2000-01-01T00:00:00Z',
            projectDefaultBranch: 'branch/default-branch',
            projectUrl: 'http://…',
            issueCount: 0,
            dependencyCount: 0,
          },
        ],
        [
          'my-name-2',
          {
            timestamp: '2000-01-01T00:00:00Z',
            projectDefaultBranch: 'branch/default-branch',
            projectUrl: 'http://…',
            issueCount: 10,
            dependencyCount: 10,
          },
        ],
      ]),
    );

    const { getByText, getAllByText } = await renderInTestApp(
      <Wrapper>
        <FossaPage />
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );

    expect(getAllByText(/Not configured/i)).toHaveLength(2);
    expect(getByText(/No dependencies/i)).toBeInTheDocument();
    expect(getByText(/0 Issues/i)).toBeInTheDocument();
    expect(getByText(/10 Issues/i)).toBeInTheDocument();
  });

  it('has configurable entity filter', async () => {
    const entity: Entity = {
      apiVersion: 'v1',
      kind: 'API',
      metadata: {
        name: 'my-name-0',
        annotations: {
          'fossa.io/project-name': 'my-name-0',
        },
      },
    };

    fossaApi.getFindingSummaries.mockResolvedValue(new Map());
    catalogApi.getEntities.mockResolvedValue({ items: [entity] });

    const { getByText } = await renderInTestApp(
      <Wrapper>
        <FossaPage entitiesFilter={{ kind: 'API' }} />
      </Wrapper>,
      {
        mountedRoutes: {
          '/catalog/:namespace/:kind/:name/*': entityRouteRef,
        },
      },
    );

    expect(catalogApi.getEntities).toHaveBeenCalledWith(
      expect.objectContaining({
        filter: { kind: 'API' },
      }),
    );
    expect(getByText(/my-name-0/i)).toBeInTheDocument();
  });
});
