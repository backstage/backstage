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

import { renderInTestApp } from '@backstage/test-utils';

import React from 'react';
import { OwnerListPicker } from './OwnerListPicker';
import { fireEvent } from '@testing-library/react';

describe('<OwnerListPicker />', () => {
  it('should render the tasks owner filter', async () => {
    const props = {
      filter: 'owned',
      onSelectOwner: jest.fn(),
    };

    const { getByText } = await renderInTestApp(<OwnerListPicker {...props} />);

    expect(await getByText('Owned')).toBeDefined();
    expect(await getByText('All')).toBeDefined();
  });

  it('should call the function on select other item', async () => {
    const props = {
      filter: 'owned',
      onSelectOwner: jest.fn(),
    };

    const { getByText } = await renderInTestApp(<OwnerListPicker {...props} />);

    fireEvent.click(await getByText('All'));
    expect(props.onSelectOwner).toBeCalledWith('all');
  });
});
