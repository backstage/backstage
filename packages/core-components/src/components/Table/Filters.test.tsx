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
import { Filters } from './Filters';

describe('Filters', () => {
  it('renders nothing for the filters when the array is empty', async () => {
    await renderInTestApp(<Filters filters={[]} onChangeFilters={() => {}} />);

    // `props.filters?.length` is `0` for an empty array, and `0` is a valid
    // React node, so a naive `length && ...` guard leaks the literal `0` into
    // the DOM. Nothing filter-related should be rendered here.
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  it('renders a select for each provided filter', async () => {
    await renderInTestApp(
      <Filters
        filters={[
          { type: 'select', element: { label: 'Owner', items: [] } },
          { type: 'select', element: { label: 'Kind', items: [] } },
        ]}
        onChangeFilters={() => {}}
      />,
    );

    expect(screen.getByText('Owner')).toBeInTheDocument();
    expect(screen.getByText('Kind')).toBeInTheDocument();
  });
});
