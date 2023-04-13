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
import { screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';
import CardHeader from './CardHeader';

const props = {
  title: 'Fix problem',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  authorName: 'user1246',
  authorAvatar: 'authorAvatar',
  repositoryName: 'NewRepository',
  labels: [
    {
      id: '01h82',
      name: 'bug',
    },
    {
      id: 'id2904',
      name: 'documentation',
    },
  ],
};

describe('<CardHeader/>', () => {
  it('finds labels in PR Card Header when PR includes labels', async () => {
    await renderInTestApp(<CardHeader {...props} />);
    expect(screen.getByText('bug')).toBeInTheDocument();
    expect(screen.getByText('documentation')).toBeInTheDocument();
  });

  it('does not find labels in PR Card Header when PR does not include labels', async () => {
    const propsWithNoLabels = {
      ...props,
      labels: [],
    };
    await renderInTestApp(<CardHeader {...propsWithNoLabels} />);
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
  });
});
