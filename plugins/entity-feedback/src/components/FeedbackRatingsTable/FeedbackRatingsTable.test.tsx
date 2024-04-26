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

import { entityRouteRef } from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import React from 'react';
import { EntityFeedbackApi, entityFeedbackApiRef } from '../../api';
import { FeedbackRatingsTable } from './FeedbackRatingsTable';

describe('FeedbackRatingsTable', () => {
  const sampleRatings = [
    {
      entityRef: 'component:default/foo',
      entityTitle: 'Foo Component',
      ratings: { 'Rating 1': 3, 'Rating 2': 1 },
    },
    {
      entityRef: 'system:default/bar',
      entityTitle: 'Bar Component',
      ratings: { 'Rating 1': 5 },
    },
    {
      entityRef: 'domain:default/hello-world',
      entityTitle: 'Hello World',
      ratings: { 'Rating 3': 5 },
    },
  ];

  const feedbackApi: Partial<EntityFeedbackApi> = {
    getAllRatings: jest.fn().mockImplementation(async () => sampleRatings),
    getOwnedRatings: jest.fn().mockImplementation(async () => sampleRatings),
  };

  const sampleRatingValues = ['Rating 1', 'Rating 2'];

  const render = async (props: any = {}) =>
    renderInTestApp(
      <TestApiProvider apis={[[entityFeedbackApiRef, feedbackApi]]}>
        <FeedbackRatingsTable {...props} ratingValues={sampleRatingValues} />
      </TestApiProvider>,
      {
        mountedRoutes: { '/catalog/:namespace/:kind/:name': entityRouteRef },
      },
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all ratings correctly', async () => {
    const rendered = await render({ allEntities: true });

    expect(feedbackApi.getAllRatings).toHaveBeenCalled();
    expect(feedbackApi.getOwnedRatings).not.toHaveBeenCalled();

    expect(rendered.getByText('Entity Ratings')).toBeInTheDocument();

    // Columns
    expect(rendered.getByText('Entity')).toBeInTheDocument();
    expect(rendered.getByText('Rating 1')).toBeInTheDocument();
    expect(rendered.getByText('Rating 2')).toBeInTheDocument();

    // Rows
    expect(rendered.getByText('Foo Component')).toBeInTheDocument();
    expect(rendered.getByText('component')).toBeInTheDocument();
    expect(rendered.getByText('3')).toBeInTheDocument();
    expect(rendered.getByText('1')).toBeInTheDocument();
    expect(rendered.getByText('Bar Component')).toBeInTheDocument();
    expect(rendered.getByText('system')).toBeInTheDocument();
    expect(rendered.getByText('5')).toBeInTheDocument();

    expect(rendered.queryByText('Hello World')).toBeNull();
  });

  it('renders owned entity ratings correctly', async () => {
    const rendered = await render({
      ownerRef: 'group:default/test-team',
      title: 'Custom Title',
    });

    expect(feedbackApi.getAllRatings).not.toHaveBeenCalled();
    expect(feedbackApi.getOwnedRatings).toHaveBeenCalledWith(
      'group:default/test-team',
    );

    expect(rendered.getByText('Custom Title')).toBeInTheDocument();

    // Columns
    expect(rendered.getByText('Entity')).toBeInTheDocument();
    expect(rendered.getByText('Rating 1')).toBeInTheDocument();
    expect(rendered.getByText('Rating 2')).toBeInTheDocument();

    // Rows
    expect(rendered.getByText('Foo Component')).toBeInTheDocument();
    expect(rendered.getByText('component')).toBeInTheDocument();
    expect(rendered.getByText('3')).toBeInTheDocument();
    expect(rendered.getByText('1')).toBeInTheDocument();
    expect(rendered.getByText('Bar Component')).toBeInTheDocument();
    expect(rendered.getByText('system')).toBeInTheDocument();
    expect(rendered.getByText('5')).toBeInTheDocument();

    expect(rendered.queryByText('Hello World')).toBeNull();
  });
});
