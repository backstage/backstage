/*
 * Copyright 2020 Spotify AB
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
import { render } from '@testing-library/react';
import { wrapInTestApp } from '@backstage/test-utils';

import ProgressCard from './ProgressCard';

const minProps = { title: 'Tingle upgrade', progress: 0.12 };

describe('<ProgressCard />', () => {
  it('renders without exploding', () => {
    const { getByText } = render(wrapInTestApp(<ProgressCard {...minProps} />));
    expect(getByText(/Tingle.*/)).toBeInTheDocument();
  });

  it('renders progress and title', () => {
    const { getByText } = render(wrapInTestApp(<ProgressCard {...minProps} />));
    expect(getByText(/Tingle.*/)).toBeInTheDocument();
    expect(getByText(/12%.*/)).toBeInTheDocument();
  });

  it('does not render deepLink', () => {
    const { queryByText } = render(
      wrapInTestApp(<ProgressCard {...minProps} />),
    );
    expect(queryByText('View more')).not.toBeInTheDocument();
  });

  it('handles invalid numbers', () => {
    const badProps = { title: 'Tingle upgrade', progress: 'hejjo' };
    const { getByText } = render(wrapInTestApp(<ProgressCard {...badProps} />));
    expect(getByText(/N\/A.*/)).toBeInTheDocument();
  });
});
