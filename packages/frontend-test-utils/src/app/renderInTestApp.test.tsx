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

import { useCallback } from 'react';
import { screen, fireEvent } from '@testing-library/react';
import {
  MockAnalyticsApi,
  TestApiProvider,
} from '@backstage/frontend-test-utils';
import {
  analyticsApiRef,
  PageBlueprint,
  useAnalytics,
} from '@backstage/frontend-plugin-api';
import { renderInTestApp } from './renderInTestApp';

describe('renderInTestApp', () => {
  it('should render the given component in a page', async () => {
    const IndexPage = () => <div>Index Page</div>;
    renderInTestApp(<IndexPage />);
    expect(await screen.findByText('Index Page')).toBeInTheDocument();
  });

  it('should works with apis provider', async () => {
    const IndexPage = () => {
      const analyticsApi = useAnalytics();
      const handleClick = useCallback(() => {
        analyticsApi.captureEvent('click', 'See details');
      }, [analyticsApi]);
      return (
        <div>
          Index Page
          <a href="/details" onClick={handleClick}>
            See details
          </a>
        </div>
      );
    };

    const analyticsApiMock = new MockAnalyticsApi();

    renderInTestApp(
      <TestApiProvider apis={[[analyticsApiRef, analyticsApiMock]]}>
        <IndexPage />
      </TestApiProvider>,
    );

    fireEvent.click(await screen.findByRole('link', { name: 'See details' }));

    expect(analyticsApiMock.getEvents()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          action: 'click',
          subject: 'See details',
        }),
      ]),
    );
  });

  it('should support setting different locations in the history stack', async () => {
    renderInTestApp(<h1>Index page</h1>, {
      extensions: [
        PageBlueprint.make({
          name: 'second-page',
          params: defineParams =>
            defineParams({
              path: '/second-page',
              loader: async () => <h1>Second Page</h1>,
            }),
        }),
      ],
      initialRouteEntries: ['/second-page'],
    });

    expect(await screen.findByText('Second Page')).toBeInTheDocument();
  });
});
