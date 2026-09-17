/*
 * Copyright 2025 The Backstage Authors
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

import { fireEvent, screen } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';

import { DefaultRepoOwnerPicker } from './DefaultRepoOwnerPicker';

describe('DefaultRepoOwnerPicker', () => {
  it('renders an input field', async () => {
    const { getByRole } = await renderInTestApp(
      <DefaultRepoOwnerPicker
        onChange={jest.fn()}
        state={{ owner: 'owner1' }}
        rawErrors={[]}
      />,
    );

    expect(getByRole('textbox')).toBeInTheDocument();
    expect(getByRole('textbox')).toHaveValue('owner1');
  });

  it('input field disabled', async () => {
    await renderInTestApp(
      <DefaultRepoOwnerPicker
        onChange={jest.fn()}
        isDisabled
        state={{ owner: 'owner1' }}
        rawErrors={[]}
      />,
    );

    const input = screen.getByRole('textbox');

    // Expect input to be disabled
    expect(input).toBeDisabled();
    expect(input).toHaveValue('owner1');
  });

  it('calls onChange when the input field changes', async () => {
    const onChange = jest.fn();

    const { getByRole } = await renderInTestApp(
      <DefaultRepoOwnerPicker
        onChange={onChange}
        state={{ owner: 'owner1' }}
        rawErrors={[]}
      />,
    );

    const input = getByRole('textbox');

    fireEvent.change(input, {
      target: { value: 'owner2' },
    });

    expect(onChange).toHaveBeenCalledWith({ owner: 'owner2' });
  });
});
