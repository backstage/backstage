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
import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import { visitsApiRef } from '../../api';
import { ContextProvider } from './Context';
import { waitFor } from '@testing-library/react';

const visits = [
  {
    id: 'explore',
    name: 'Explore Backstage',
    pathname: '/explore',
    hits: 35,
    timestamp: Date.now() - 86400_000,
  },
];

const mockVisitsApi = {
  saveVisit: async () => visits[0],
  listVisits: async () => visits,
};

describe('<Content kind="recent"/>', () => {
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
});

describe('<Content kind="top"/>', () => {
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
});
