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
import { VisitList } from './VisitList';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

describe('<VisitList/>', () => {
  it('renders with mandatory parameters', async () => {
    const { getByText } = await render(
      <VisitList title="My title" detailType="time-ago" />,
    );
    expect(getByText('My title')).toBeInTheDocument();
  });

  it('renders skeleton when loading is true', async () => {
    const { container } = await render(
      <VisitList title="My title" detailType="time-ago" loading />,
    );
    expect(container.querySelectorAll('li')).toHaveLength(8);
    expect(container.querySelectorAll('.MuiSkeleton-root')).toHaveLength(16);
  });

  it('renders specified amount of items', async () => {
    const { container } = await render(
      <VisitList
        title="My title"
        detailType="time-ago"
        loading
        numVisitsOpen={1}
        numVisitsTotal={2}
      />,
    );
    expect(container.querySelectorAll('li')).toHaveLength(2);
  });

  it('renders some items hidden', async () => {
    const { container } = await render(
      <VisitList
        title="My title"
        detailType="time-ago"
        loading
        numVisitsOpen={1}
        numVisitsTotal={2}
      />,
    );
    expect(container.querySelectorAll('li')[0]).toBeVisible();
    expect(container.querySelectorAll('li')[1]).not.toBeVisible();
  });

  it('renders all items when not collapsed', async () => {
    const { container } = await render(
      <VisitList
        title="My title"
        detailType="time-ago"
        loading
        collapsed={false}
        numVisitsOpen={1}
        numVisitsTotal={2}
      />,
    );
    expect(container.querySelectorAll('li')[0]).toBeVisible();
    expect(container.querySelectorAll('li')[1]).toBeVisible();
  });

  it('renders visit with time-ago', async () => {
    const { container, getByText } = await render(
      <BrowserRouter>
        <VisitList
          title="My title"
          detailType="time-ago"
          visits={[
            {
              id: 'explore',
              name: 'Explore Backstage',
              pathname: '/explore',
              hits: 35,
              timestamp: Date.now() - 86400_000,
            },
          ]}
        />
        ,
      </BrowserRouter>,
    );
    expect(container.querySelectorAll('li')).toHaveLength(1);
    expect(getByText('Explore Backstage')).toBeInTheDocument();
    expect(getByText('1 day ago')).toBeInTheDocument();
  });

  it('renders visit with hits', async () => {
    const { container, getByText } = await render(
      <BrowserRouter>
        <VisitList
          title="My title"
          detailType="hits"
          visits={[
            {
              id: 'explore',
              name: 'Explore Backstage',
              pathname: '/explore',
              hits: 35,
              timestamp: Date.now() - 86400_000,
            },
          ]}
        />
        ,
      </BrowserRouter>,
    );
    expect(container.querySelectorAll('li')).toHaveLength(1);
    expect(getByText('Explore Backstage')).toBeInTheDocument();
    expect(getByText('35 times')).toBeInTheDocument();
  });

  it('renders text warning about few items', async () => {
    const { getByText } = await render(
      <BrowserRouter>
        <VisitList
          title="My title"
          detailType="hits"
          visits={[
            {
              id: 'explore',
              name: 'Explore Backstage',
              pathname: '/explore',
              hits: 35,
              timestamp: Date.now() - 86400_000,
            },
          ]}
        />
        ,
      </BrowserRouter>,
    );
    expect(
      getByText('The more pages you visit, the more pages will appear here.'),
    ).toBeInTheDocument();
  });

  it('renders text warning about no items', async () => {
    const { getByText } = await render(
      <BrowserRouter>
        <VisitList title="My title" detailType="hits" visits={[]} />,
      </BrowserRouter>,
    );
    expect(getByText('There are no visits to show yet.')).toBeInTheDocument();
  });
});
