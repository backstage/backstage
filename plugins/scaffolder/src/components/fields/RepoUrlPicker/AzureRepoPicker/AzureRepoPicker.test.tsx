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
import { act } from 'react-dom/test-utils';

jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: jest.fn().mockReturnValue({
    allowedOrganizations: () => Promise.resolve([{ name: 'org' }]),
    allowedOwners: () => Promise.resolve([{ name: 'owner' }]),
  }),
}));

afterAll(() => {
  jest.resetAllMocks();
});

describe('AzureRepoPicker', () => {
  it('renders the two input fields', async () => {
    await act(async () => {
      const { getAllByRole } = render(
        <AzureRepoPicker onChange={jest.fn()} rawErrors={[]} state={{}} />,
      );

      const allInputs = getAllByRole('textbox');

      expect(allInputs).toHaveLength(2);
    });
  });

  describe('org field', () => {
    it('calls onChange when the organization changes', async () => {
      const onChange = jest.fn();
      let getAllByRole: any = () => ({});

      await act(async () => {
        getAllByRole = render(
          <AzureRepoPicker onChange={onChange} rawErrors={[]} state={{}} />,
        ).getAllByRole;
      });
      const orgInput = getAllByRole('textbox')[0];
      act(() => {
        fireEvent.change(orgInput, { target: { value: 'org' } });
      });

      expect(onChange).toHaveBeenCalledWith({ organization: 'org' });
    });
  });

  describe('owner field', () => {
    it('calls onChange when the owner changes', async () => {
      const onChange = jest.fn();
      let getAllByRole: any = () => ({});

      await act(async () => {
        getAllByRole = render(
          <AzureRepoPicker onChange={onChange} rawErrors={[]} state={{}} />,
        ).getAllByRole;
      });

      const ownerInput = getAllByRole('textbox')[1];
      act(() => {
        fireEvent.change(ownerInput, { target: { value: 'owner' } });
      });

      expect(onChange).toHaveBeenCalledWith({ owner: 'owner' });
    });
  });
});
