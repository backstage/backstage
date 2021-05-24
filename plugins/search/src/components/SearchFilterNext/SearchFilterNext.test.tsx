/*
 * Copyright 2021 Spotify AB
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
import { SearchFilterNext } from './SearchFilterNext';

const MockFilterComponent = ({ name }: { name: string }) => {
  return <h6>{name}</h6>;
};

describe('<SearchFilterNext />', () => {
  it('renders without exploding', async () => {
    const props = {
      name: 'filter name',
    };

    const { getByRole } = await renderInTestApp(
      <SearchFilterNext {...props} component={MockFilterComponent} />,
    );

    expect(getByRole('heading', { name: 'filter name' })).toBeInTheDocument();
  });
});
