/*
 * Copyright 2023 The Backstage Authors
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
import { Content } from './Content';
import {
  TestApiProvider,
  renderInTestApp,
  MockConfigApi,
} from '@backstage/test-utils';
import { visitsApiRef } from '../../api';
import { ContextProvider } from './Context';
import { waitFor } from '@testing-library/react';
import { configApiRef } from '@backstage/core-plugin-api';

const visits = [
  {
    id: 'explore',
    name: 'Explore Backstage',
    pathname: '/explore',
    hits: 35,
    timestamp: Date.now() - 86400_000,
  },
  {
    id: 'tech-radar',
    name: 'Tech Radar',
    pathname: '/tech-radar',
    hits: 40,
    timestamp: Date.now() - 360_000,
  },
];

let mockVisitsApi = {
  save: async () => visits[0],
  list: async () => visits,
};

describe('<Content kind="recent"/>', () => {
  beforeEach(() => {
    mockVisitsApi = {
      save: async () => visits[0],
      list: async () => visits,
    };
  });

  afterEach(() => jest.resetAllMocks());

  it('renders', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <ContextProvider>
          <Content kind="recent" />
        </ContextProvider>
      </TestApiProvider>,
    );
    expect(getByText('Recently Visited')).toBeInTheDocument();
    await waitFor(() =>
      expect(getByText('Explore Backstage')).toBeInTheDocument(),
    );
  });

  it('allows visits to be overridden', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <ContextProvider>
          <Content
            kind="recent"
            visits={[
              {
                id: 'tech-radar',
                name: 'Tech Radar',
                pathname: '/tech-radar',
                hits: 40,
                timestamp: Date.now() - 360_000,
              },
            ]}
          />
        </ContextProvider>
      </TestApiProvider>,
    );
    expect(getByText('Recently Visited')).toBeInTheDocument();
    await waitFor(() => expect(getByText('Tech Radar')).toBeInTheDocument());
  });

  it('allows loading to be overridden', async () => {
    const { container } = await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <ContextProvider>
          <Content kind="recent" loading />
        </ContextProvider>
      </TestApiProvider>,
    );
    expect(container.querySelector('.MuiSkeleton-root')).toBeInTheDocument();
  });

  it('allows number of items to be specified', async () => {
    const { container } = await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <ContextProvider>
          <Content
            kind="recent"
            visits={[
              {
                id: 'explore',
                name: 'Explore Backstage',
                pathname: '/explore',
                hits: 35,
                timestamp: Date.now() - 86400_000,
              },
              {
                id: 'tech-radar',
                name: 'Tech Radar',
                pathname: '/tech-radar',
                hits: 40,
                timestamp: Date.now() - 360_000,
              },
            ]}
            numVisitsOpen={1}
            numVisitsTotal={2}
          />
        </ContextProvider>
      </TestApiProvider>,
    );
    expect(container.querySelectorAll('li')).toHaveLength(2);
    expect(container.querySelectorAll('li')[0]).toBeVisible();
    expect(container.querySelectorAll('li')[1]).not.toBeVisible();
  });

  it('allows recent items to be filtered using config', async () => {
    const configApiMock = new MockConfigApi({
      home: {
        recentVisits: {
          filterBy: [
            {
              field: 'pathname',
              operator: '==',
              value: '/tech-radar',
            },
          ],
        },
      },
    });

    const listSpy = jest.spyOn(mockVisitsApi, 'list');

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [visitsApiRef, mockVisitsApi],
        ]}
      >
        <ContextProvider>
          <Content kind="recent" />
        </ContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() => {
      expect(listSpy).toHaveBeenCalledWith({
        limit: 8,
        orderBy: [
          {
            direction: 'desc',
            field: 'timestamp',
          },
        ],
        filterBy: [{ field: 'pathname', operator: '==', value: '/tech-radar' }],
      });
    });
  });

  it('shows all recent items when there is no filtering in the config', async () => {
    const listSpy = jest.spyOn(mockVisitsApi, 'list');

    await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <ContextProvider>
          <Content kind="recent" />
        </ContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() => {
      expect(listSpy).toHaveBeenCalledWith({
        limit: 8,
        orderBy: [
          {
            direction: 'desc',
            field: 'timestamp',
          },
        ],
        filterBy: [],
      });
    });
  });

  it('allows recent items to have no filter if the filter config is not valid', async () => {
    const configApiMock = new MockConfigApi({
      home: {
        recentVisits: {
          filterBy: [
            {
              operator: '==',
              value: '/tech-radar',
            },
            {
              field: 'pathname',
              operator: '==',
              value: '/explore',
            },
          ],
        },
      },
    });

    const listSpy = jest.spyOn(mockVisitsApi, 'list');

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [visitsApiRef, mockVisitsApi],
        ]}
      >
        <ContextProvider>
          <Content kind="recent" />
        </ContextProvider>
      </TestApiProvider>,
    );
    await waitFor(() => {
      expect(listSpy).toHaveBeenCalledWith({
        limit: 8,
        orderBy: [
          {
            direction: 'desc',
            field: 'timestamp',
          },
        ],
        filterBy: [
          {
            field: 'pathname',
            operator: '==',
            value: '/explore',
          },
        ],
      });
    });
  });
});

describe('<Content kind="top"/>', () => {
  beforeEach(() => {
    mockVisitsApi = {
      save: async () => visits[0],
      list: async () => visits,
    };
  });

  afterEach(() => jest.resetAllMocks());

  it('renders', async () => {
    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <ContextProvider>
          <Content kind="top" />
        </ContextProvider>
      </TestApiProvider>,
    );
    expect(getByText('Top Visited')).toBeInTheDocument();
    await waitFor(() =>
      expect(getByText('Explore Backstage')).toBeInTheDocument(),
    );
  });

  it('allows top items to be filtered using config', async () => {
    const configApiMock = new MockConfigApi({
      home: {
        topVisits: {
          filterBy: [
            {
              field: 'pathname',
              operator: '==',
              value: '/explore',
            },
          ],
        },
      },
    });

    const listSpy = jest.spyOn(mockVisitsApi, 'list');

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [visitsApiRef, mockVisitsApi],
        ]}
      >
        <ContextProvider>
          <Content kind="top" />
        </ContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() => {
      expect(listSpy).toHaveBeenCalledWith({
        limit: 8,
        orderBy: [
          {
            direction: 'desc',
            field: 'hits',
          },
        ],
        filterBy: [{ field: 'pathname', operator: '==', value: '/explore' }],
      });
    });
  });

  it('shows all top items when there is no filtering in the config', async () => {
    const listSpy = jest.spyOn(mockVisitsApi, 'list');

    await renderInTestApp(
      <TestApiProvider apis={[[visitsApiRef, mockVisitsApi]]}>
        <ContextProvider>
          <Content kind="top" />
        </ContextProvider>
      </TestApiProvider>,
    );

    await waitFor(() => {
      expect(listSpy).toHaveBeenCalledWith({
        limit: 8,
        orderBy: [
          {
            direction: 'desc',
            field: 'hits',
          },
        ],
        filterBy: [],
      });
    });
  });
});
