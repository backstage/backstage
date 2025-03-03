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

import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';

import { DefaultRepoBranchPicker } from './DefaultRepoBranchPicker';

describe('DefaultRepoBranchPicker', () => {
  it('renders an input field', () => {
    const { getByRole } = render(
      <DefaultRepoBranchPicker
        onChange={jest.fn()}
        state={{ branch: 'main' }}
        rawErrors={[]}
      />,
    );

    expect(getByRole('textbox')).toBeInTheDocument();
    expect(getByRole('textbox')).toHaveValue('main');
  });

  it('input field disabled', () => {
    render(
      <DefaultRepoBranchPicker
        onChange={jest.fn()}
        isDisabled
        state={{ branch: 'main' }}
        rawErrors={[]}
      />,
    );

    const input = screen.getByRole('textbox');

    // Expect input to be disabled
    expect(input).toBeDisabled();
    expect(input).toHaveValue('main');
  });

  it('calls onChange when the input field changes', () => {
    const onChange = jest.fn();

    const { getByRole } = render(
      <DefaultRepoBranchPicker
        onChange={onChange}
        state={{ branch: 'main' }}
        rawErrors={[]}
      />,
    );

    const input = getByRole('textbox');

    fireEvent.change(input, {
      target: { value: 'develop' },
    });

    expect(onChange).toHaveBeenCalledWith({ branch: 'develop' });
  });
});
