/*
 * Copyright 2022 The Backstage Authors
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
import {
  MockAnalyticsApi,
  renderInTestApp,
  TestApiProvider,
} from '@backstage/test-utils';
import userEvent from '@testing-library/user-event';
import { screen } from '@testing-library/react';
import { StackOverflowSearchResultListItem } from './StackOverflowSearchResultListItem';
import { analyticsApiRef } from '@backstage/core-plugin-api';

describe('<StackOverflowSearchResultListItem/>', () => {
  it('should render without exploding', async () => {
    await renderInTestApp(
      <StackOverflowSearchResultListItem
        result={{
          title: 'Customizing Spotify backstage UI',
          text: 'Name of Author',
          location: 'https://stackoverflow.com/questions/7',
          answers: 0,
          tags: ['backstage'],
        }}
      />,
    );
    expect(
      screen.getByText(/Customizing Spotify backstage UI/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Tag: backstage/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Customizing Spotify backstage UI/i).closest('a'),
    ).toHaveAttribute('href', 'https://stackoverflow.com/questions/7');
  });

  it('should capture analytics for rank', async () => {
    const analyticsSpy = new MockAnalyticsApi();

    await renderInTestApp(
      <TestApiProvider apis={[[analyticsApiRef, analyticsSpy]]}>
        <StackOverflowSearchResultListItem
          result={{
            title: 'Customizing Spotify backstage UI',
            text: 'Name of Author',
            location: 'https://stackoverflow.com/questions/7',
            answers: 0,
            tags: ['backstage'],
          }}
          rank={1}
        />
        ,
      </TestApiProvider>,
    );

    await userEvent.click(
      screen.getByText(/Customizing Spotify backstage UI/i),
    );

    expect(analyticsSpy.getEvents()[0]).toMatchObject({
      action: 'discover',
      attributes: { to: 'https://stackoverflow.com/questions/7' },
      context: { extension: 'App', pluginId: 'root', routeRef: 'unknown' },
      subject: 'Customizing Spotify backstage UI',
      value: 1,
    });
  });

  it('should render highlight', async () => {
    await renderInTestApp(
      <StackOverflowSearchResultListItem
        result={{
          title: 'Customizing Spotify backstage UI',
          text: 'Name of Author',
          location: 'https://stackoverflow.com/questions/7',
          answers: 0,
          tags: ['backstage'],
        }}
        highlight={{
          fields: {
            title: 'Highlighted Title',
            text: 'Highlighted Author',
          },
          preTag: '<xyz>',
          postTag: '</xyz>',
        }}
      />,
    );
    expect(screen.getByText(/Highlighted Title/i)).toBeInTheDocument();
    expect(screen.getByText(/Highlighted Author/i)).toBeInTheDocument();
  });
});
