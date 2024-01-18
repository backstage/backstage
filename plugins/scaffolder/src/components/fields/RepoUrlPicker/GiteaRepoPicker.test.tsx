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
import { render, fireEvent } from '@testing-library/react';

describe('GiteaRepoPicker', () => {
  describe('owner input field', () => {
    it('calls onChange when the owner input changes', () => {
      const onChange = jest.fn();
      const { getAllByRole } = render(
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
