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
import { VisitedByType } from './VisitedByType';
import { Context, defaultContextValue } from './Context';
import { renderInTestApp } from '@backstage/test-utils';
import { waitFor } from '@testing-library/react';

describe('<VisitedByType/> kind="top"', () => {
  it('should render', async () => {
    const { getByText } = await renderInTestApp(
      <Context.Provider value={{ ...defaultContextValue, kind: 'top' }}>
        <VisitedByType />
      </Context.Provider>,
    );
    expect(getByText('Top Visited')).toBeInTheDocument();
  });
  it('should display hits', async () => {
    const { getByText } = await renderInTestApp(
      <Context.Provider
        value={{
          ...defaultContextValue,
          kind: 'top',
          loading: false,
          visits: [
            {
              id: 'tech-radar',
              name: 'Tech Radar',
              pathname: '/tech-radar',
              hits: 40,
              timestamp: Date.now() - 360_000,
            },
          ],
        }}
      >
        <VisitedByType />
      </Context.Provider>,
    );
    await waitFor(() => expect(getByText('40 times')).toBeInTheDocument());
  });
});

describe('<VisitedByType/> kind="recent"', () => {
  it('should render', async () => {
    const { getByText } = await renderInTestApp(
      <Context.Provider value={{ ...defaultContextValue, kind: 'recent' }}>
        <VisitedByType />
      </Context.Provider>,
    );
    expect(getByText('Recently Visited')).toBeInTheDocument();
  });
  it('should display how long ago a visit happened', async () => {
    const { getByText } = await renderInTestApp(
      <Context.Provider
        value={{
          ...defaultContextValue,
          kind: 'recent',
          loading: false,
          visits: [
            {
              id: 'tech-radar',
              name: 'Tech Radar',
              pathname: '/tech-radar',
              hits: 40,
              timestamp: Date.now() - 86400_000,
            },
          ],
        }}
      >
        <VisitedByType />
      </Context.Provider>,
    );
    await waitFor(() => expect(getByText('1 day ago')).toBeInTheDocument());
  });
});
