/*
 * Copyright 2024 The Backstage Authors
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
import { PostCard } from './PostCard';
import React from 'react';

const minProps = {
  title: 'Post Card',
  description: 'This is the description of a Post Card',
};

describe('<PostCard />', () => {
  it('should render a PostCard', async () => {
    const { getByRole } = await renderInTestApp(
      <PostCard>
        <PostCard.Title>{minProps.title}</PostCard.Title>
        <PostCard.Description>{minProps.description}</PostCard.Description>
      </PostCard>,
    );
    expect(getByRole('heading', { name: minProps.title })).toBeInTheDocument();
    expect(getByRole('paragraph')).toHaveTextContent(minProps.description);
  });
});
