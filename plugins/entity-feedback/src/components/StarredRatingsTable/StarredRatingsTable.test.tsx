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

import { renderInTestApp } from '@backstage/test-utils';
import React from 'react';

import { FeedbackRatings } from '../StarredRatingButtons';
import { StarredRatingsTable } from './StarredRatingsTable';

jest.mock('../FeedbackRatingsTable', () => ({
  FeedbackRatingsTable: ({ ratingValues }: { ratingValues: string[] }) => {
    return (
      <span>
        {ratingValues.map(v => (
          <span key={v}>{v}</span>
        ))}
      </span>
    );
  },
}));

describe('StarredRatingsTable', () => {
  it('renders starred ratings correctly', async () => {
    const rendered = await renderInTestApp(<StarredRatingsTable />);
    expect(rendered.getByText(FeedbackRatings.one)).toBeInTheDocument();
    expect(rendered.getByText(FeedbackRatings.two)).toBeInTheDocument();
    expect(rendered.getByText(FeedbackRatings.three)).toBeInTheDocument();
    expect(rendered.getByText(FeedbackRatings.four)).toBeInTheDocument();
    expect(rendered.getByText(FeedbackRatings.five)).toBeInTheDocument();
  });
});
