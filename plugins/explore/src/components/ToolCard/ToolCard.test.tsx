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
import { screen } from '@testing-library/react';
import React from 'react';
import { ToolCard } from './ToolCard';

const minProps = {
  card: {
    title: 'Title',
    description: 'Something something',
    url: 'http://spotify.com/',
    image: 'https://developer.spotify.com/assets/WebAPI_intro.png',
    tags: ['tag1', 'tag2'],
  },
};

describe('<ToolCard />', () => {
  it('renders without exploding', async () => {
    await renderInTestApp(<ToolCard {...minProps} />);
    expect(screen.getByText('Explore')).toBeInTheDocument();
  });

  it('renders props correctly', async () => {
    await renderInTestApp(<ToolCard {...minProps} />);
    expect(
      screen.getByRole('heading', { name: minProps.card.title }),
    ).toBeInTheDocument();
    expect(screen.getByText(minProps.card.description)).toBeInTheDocument();
  });

  it('should link out', async () => {
    const { container } = await renderInTestApp(<ToolCard {...minProps} />);
    const anchor = container.querySelector('a');
    expect(anchor).toHaveAttribute('href', minProps.card.url);
  });

  it('renders default description when missing', async () => {
    const card = {
      title: 'Title',
      url: 'http://spotify.com/',
      image: 'https://developer.spotify.com/assets/WebAPI_intro.png',
    };
    await renderInTestApp(<ToolCard card={card} />);
    expect(screen.getByText('Description missing')).toBeInTheDocument();
  });

  it('renders lifecycle correctly', async () => {
    const propsWithLifecycle = {
      card: {
        title: 'Title',
        url: 'http://spotify.com/',
        image: 'https://developer.spotify.com/assets/WebAPI_intro.png',
        lifecycle: 'GA',
      },
    };
    await renderInTestApp(<ToolCard {...propsWithLifecycle} />);
    expect(screen.queryByText('GA')).not.toBeInTheDocument();
  });

  it('renders tags correctly', async () => {
    await renderInTestApp(<ToolCard {...minProps} />);
    expect(screen.getByText(minProps.card.tags[0])).toBeInTheDocument();
    expect(screen.getByText(minProps.card.tags[1])).toBeInTheDocument();
  });
});
