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
import { AzureRepoPicker } from './AzureRepoPicker';
import { render, fireEvent } from '@testing-library/react';

describe('AzureRepoPicker', () => {
  it('renders the three input fields', async () => {
    const { getAllByRole } = render(
      <AzureRepoPicker onChange={jest.fn()} rawErrors={[]} state={{}} />,
    );

    const allInputs = getAllByRole('textbox');

    expect(allInputs).toHaveLength(3);
  });

  describe('org field', () => {
    it('calls onChange when the organisation changes', () => {
      const onChange = jest.fn();
      const { getAllByRole } = render(
        <AzureRepoPicker onChange={onChange} rawErrors={[]} state={{}} />,
      );

      const orgInput = getAllByRole('textbox')[0];

      fireEvent.change(orgInput, { target: { value: 'org' } });

      expect(onChange).toHaveBeenCalledWith({ organization: 'org' });
    });
  });

  describe('owner field', () => {
    it('calls onChange when the owner changes', () => {
      const onChange = jest.fn();
      const { getAllByRole } = render(
        <AzureRepoPicker onChange={onChange} rawErrors={[]} state={{}} />,
      );

      const ownerInput = getAllByRole('textbox')[1];

      fireEvent.change(ownerInput, { target: { value: 'owner' } });

      expect(onChange).toHaveBeenCalledWith({ owner: 'owner' });
    });
  });

  describe('repoName field', () => {
    it('calls onChange when the repoName changes', () => {
      const onChange = jest.fn();
      const { getAllByRole } = render(
        <AzureRepoPicker onChange={onChange} rawErrors={[]} state={{}} />,
      );

      const repoNameInput = getAllByRole('textbox')[2];

      fireEvent.change(repoNameInput, { target: { value: 'repoName' } });

      expect(onChange).toHaveBeenCalledWith({ repoName: 'repoName' });
    });
  });
});
