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
import { GiteaRepoPicker } from './GiteaRepoPicker';
import { fireEvent } from '@testing-library/react';
import { renderInTestApp } from '@backstage/test-utils';

describe('GiteaRepoPicker', () => {
  it('disables input fields when isDisabled is true', async () => {
    const { getAllByRole } = await renderInTestApp(
      <GiteaRepoPicker
        onChange={jest.fn()}
        rawErrors={[]}
        state={{}}
        isDisabled
      />,
    );

    const allInputs = getAllByRole('textbox');

    allInputs.forEach(input => {
      expect(input).toBeDisabled();
    });
  });
  describe('owner input field', () => {
    it('calls onChange when the owner input changes', async () => {
      const onChange = jest.fn();
      const { getAllByRole } = await renderInTestApp(
        <GiteaRepoPicker
          onChange={onChange}
          rawErrors={[]}
          state={{ host: 'gitea.com' }}
        />,
      );

      const ownerInput = getAllByRole('textbox')[0];

      fireEvent.change(ownerInput, { target: { value: 'test-owner' } });

      expect(onChange).toHaveBeenCalledWith({ owner: 'test-owner' });
    });
  });
});
