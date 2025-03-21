/*
 * Copyright 2021 The Backstage Authors
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
import { RepoUrlPickerHost } from './RepoUrlPickerHost';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import { fireEvent, within } from '@testing-library/react';

describe('RepoUrlPickerHostField', () => {
  it('renders the default host properly', async () => {
    const mockOnChange = jest.fn();
    const mockScaffolderApi = {
      getIntegrationsList: jest.fn().mockResolvedValue({
        integrations: [
          { host: 'github.com', title: 'github.com', type: 'github' },
        ],
      }),
    };
    const { getByText } = await renderInTestApp(
      <TestApiProvider apis={[[scaffolderApiRef, mockScaffolderApi]]}>
        <RepoUrlPickerHost
          hosts={['github.com']}
          onChange={mockOnChange}
          rawErrors={[]}
        />
      </TestApiProvider>,
    );

    expect(getByText('github.com')).toBeInTheDocument();
    expect(mockOnChange).toHaveBeenCalledWith('github.com');
  });

  it('should provide a dropdown when multiple hosts are returned that can be selected', async () => {
    const mockOnChange = jest.fn();
    const mockScaffolderApi = {
      getIntegrationsList: jest.fn().mockResolvedValue({
        integrations: [
          { host: 'github.com', title: 'github.com', type: 'github' },
          { host: 'gitlab.com', title: 'gitlab.com', type: 'gitlab' },
        ],
      }),
    };

    const { getByRole, getByText, getByTestId } = await renderInTestApp(
      <TestApiProvider apis={[[scaffolderApiRef, mockScaffolderApi]]}>
        <RepoUrlPickerHost
          hosts={['github.com', 'gitlab.com']}
          onChange={mockOnChange}
          rawErrors={[]}
        />
      </TestApiProvider>,
    );

    fireEvent.mouseDown(getByTestId('host-select'));
    expect(getByText('gitlab.com')).toBeInTheDocument();

    const listbox = within(getByRole('combobox'));

    expect(listbox.getAllByRole('option')).toHaveLength(2);
  });

  it('should not display hosts that dont have integration config set correctly', async () => {
    const mockOnChange = jest.fn();
    const mockScaffolderApi = {
      getIntegrationsList: jest.fn().mockResolvedValue({
        integrations: [
          { host: 'github.com', title: 'github.com', type: 'github' },
          { host: 'gitlab.com', title: 'gitlab.com', type: 'gitlab' },
        ],
      }),
    };

    const { getByRole, getByText, getByTestId } = await renderInTestApp(
      <TestApiProvider apis={[[scaffolderApiRef, mockScaffolderApi]]}>
        <RepoUrlPickerHost
          hosts={['github.com', 'gitlab.com', 'notfound.host']}
          onChange={mockOnChange}
          rawErrors={[]}
        />
      </TestApiProvider>,
    );

    fireEvent.mouseDown(getByTestId('host-select'));
    expect(getByText('gitlab.com')).toBeInTheDocument();

    const listbox = within(getByRole('combobox'));

    expect(listbox.getAllByRole('option')).toHaveLength(2);
  });

  it('disables the host select when isDisabled is true', async () => {
    const mockOnChange = jest.fn();
    const mockScaffolderApi = {
      getIntegrationsList: jest.fn().mockResolvedValue({
        integrations: [
          { host: 'github.com', title: 'github.com', type: 'github' },
          { host: 'gitlab.com', title: 'gitlab.com', type: 'gitlab' },
        ],
      }),
    };

    const { getByTestId } = await renderInTestApp(
      <TestApiProvider apis={[[scaffolderApiRef, mockScaffolderApi]]}>
        <RepoUrlPickerHost
          hosts={['github.com', 'gitlab.com']}
          onChange={mockOnChange}
          rawErrors={[]}
          isDisabled
        />
      </TestApiProvider>,
    );

    const selectElement = getByTestId('host-select').querySelector('select');

    expect(selectElement).toBeDisabled();
  });
});
