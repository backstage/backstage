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

  describe('Variants', () => {
    it('renders with the gridItem variant without crashing', async () => {
      const rendered = await renderInTestApp(
        <InfoCard {...minProps} variant="gridItem">
          <span>Grid item content</span>
        </InfoCard>,
      );

      expect(rendered.getByText('Some title')).toBeInTheDocument();
      expect(rendered.getByText('Grid item content')).toBeInTheDocument();
    });

    it('renders with the fullHeight variant without crashing', async () => {
      const rendered = await renderInTestApp(
        <InfoCard {...minProps} variant="fullHeight">
          <span>Full height content</span>
        </InfoCard>,
      );

      expect(rendered.getByText('Some title')).toBeInTheDocument();
      expect(rendered.getByText('Full height content')).toBeInTheDocument();
    });
  });

  describe('Actions', () => {
    it('renders footer actions when the actions prop is provided', async () => {
      const rendered = await renderInTestApp(
        <InfoCard {...minProps} actions={<button>Save</button>}>
          <span>Card body</span>
        </InfoCard>,
      );

      expect(rendered.getByText('Save')).toBeInTheDocument();
      expect(rendered.getByText('Card body')).toBeInTheDocument();
    });

    it('renders top-right actions when the actionsTopRight prop is provided', async () => {
      const rendered = await renderInTestApp(
        <InfoCard
          {...minProps}
          actionsTopRight={
            <span data-testid="top-right-action">Top Right</span>
          }
        >
          <span>Card body</span>
        </InfoCard>,
      );

      expect(rendered.getByTestId('top-right-action')).toBeInTheDocument();
      expect(rendered.getByText('Top Right')).toBeInTheDocument();
    });
  });

  describe('Content options', () => {
    it('renders with noPadding without crashing', async () => {
      const rendered = await renderInTestApp(
        <InfoCard {...minProps} noPadding>
          <span>No padding content</span>
        </InfoCard>,
      );

      expect(rendered.getByText('No padding content')).toBeInTheDocument();
    });

    it('renders without divider when divider prop is false', async () => {
      const rendered = await renderInTestApp(
        <InfoCard {...minProps} divider={false}>
          <span>No divider content</span>
        </InfoCard>,
      );

      expect(rendered.getByText('Some title')).toBeInTheDocument();
      expect(rendered.getByText('No divider content')).toBeInTheDocument();
    });
  });
});
