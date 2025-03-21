/*
 * Copyright 2020 The Backstage Authors
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
import { renderInTestApp } from '@backstage/test-utils';
import { within } from '@testing-library/react';
import { InfoCard } from './InfoCard';

const minProps = {
  title: 'Some title',
  deepLink: {
    title: 'A deepLink title',
    link: '/mocked',
  },
};

describe('<InfoCard />', () => {
  it('renders without exploding', async () => {
    const rendered = await renderInTestApp(<InfoCard {...minProps} />);
    expect(rendered.getByText('Some title')).toBeInTheDocument();
  });

  it('renders a deepLink when prop is set', async () => {
    const rendered = await renderInTestApp(<InfoCard {...minProps} />);
    expect(rendered.getByText('A deepLink title')).toBeInTheDocument();
  });

  describe('Subheader', () => {
    it('shows the subheader passed in via the subheader prop', async () => {
      const { getByTestId } = await renderInTestApp(
        <InfoCard {...minProps} subheader="example subheader" />,
      );

      const subheaderContainer = getByTestId('info-card-subheader');

      expect(
        within(subheaderContainer).getByText('example subheader'),
      ).toBeInTheDocument();
    });

    it('shows the icon passed in via the icon prop', async () => {
      const { getByTestId } = await renderInTestApp(
        <InfoCard {...minProps} icon={<span data-testid="mock-icon" />} />,
      );

      const subheaderContainer = getByTestId('info-card-subheader');

      expect(
        within(subheaderContainer).getByTestId('mock-icon'),
      ).toBeInTheDocument();
    });

    it('is not rendered where there is not an icon or subheading', async () => {
      const { queryByTestId } = await renderInTestApp(
        <InfoCard {...minProps} />,
      );

      expect(queryByTestId('info-card-subheader')).not.toBeInTheDocument();
    });
  });
});
