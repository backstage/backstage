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
import React from 'react';
import { ItemCard } from './ItemCard';

const minProps = {
  description: 'This is the description of an Item Card',
  label: 'Button',
  title: 'Item Card',
};

describe('<InfoCard />', () => {
  it('renders default without exploding', async () => {
    const { description, label, title } = minProps;
    const { getByText } = await renderInTestApp(<ItemCard {...minProps} />);
    expect(getByText(description)).toBeInTheDocument();
    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(label)).toBeInTheDocument();
  });

  it('renders with subtitle without exploding', async () => {
    const { description, label, title } = minProps;
    const subtitle = 'Pretitle';
    const { getByText } = await renderInTestApp(
      <ItemCard {...minProps} subtitle={subtitle} />,
    );
    expect(getByText(description)).toBeInTheDocument();
    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(label)).toBeInTheDocument();
    expect(getByText(subtitle)).toBeInTheDocument();
  });

  it('renders with tags without exploding', async () => {
    const { description, label, title } = minProps;
    const tags = ['tag one', 'tag two'];
    const { getByText } = await renderInTestApp(
      <ItemCard {...minProps} tags={tags} />,
    );
    expect(getByText(description)).toBeInTheDocument();
    expect(getByText(title)).toBeInTheDocument();
    expect(getByText(label)).toBeInTheDocument();
    tags.forEach(tag => {
      expect(getByText(tag)).toBeInTheDocument();
    });
  });
});
