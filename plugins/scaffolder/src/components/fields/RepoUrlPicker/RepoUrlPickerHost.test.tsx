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
// Polyfill pointer capture for JSDOM — required by Radix Select/Popover
if (!Element.prototype.hasPointerCapture) {
  Element.prototype.hasPointerCapture = function () {
    return false;
  };
}
if (!Element.prototype.setPointerCapture) {
  Element.prototype.setPointerCapture = function () {};
}
if (!Element.prototype.releasePointerCapture) {
  Element.prototype.releasePointerCapture = function () {};
}
// Polyfill scrollIntoView for JSDOM — required by Radix Select
if (!Element.prototype.scrollIntoView) {
  Element.prototype.scrollIntoView = function () {};
}

import { RepoUrlPickerHost } from './RepoUrlPickerHost';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { scaffolderApiRef } from '@backstage/plugin-scaffolder-react';
import { screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';

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
    await renderInTestApp(
      <TestApiProvider apis={[[scaffolderApiRef, mockScaffolderApi]]}>
        <RepoUrlPickerHost
          hosts={['github.com']}
          onChange={mockOnChange}
          rawErrors={[]}
        />
      </TestApiProvider>,
    );

    // Wait for the async integrations to load and onChange to be triggered
    // with the auto-selected first host
    await waitFor(() => {
      expect(mockOnChange).toHaveBeenCalledWith('github.com');
    });
    // The select trigger should exist and be disabled for single-host
    expect(screen.getByTestId('host-select')).toBeDisabled();
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

    await renderInTestApp(
      <TestApiProvider apis={[[scaffolderApiRef, mockScaffolderApi]]}>
        <RepoUrlPickerHost
          hosts={['github.com', 'gitlab.com']}
          onChange={mockOnChange}
          rawErrors={[]}
        />
      </TestApiProvider>,
    );

    // Wait for async load
    await waitFor(() => {
      expect(screen.getByTestId('host-select')).toBeInTheDocument();
    });

    // Open the Radix Select by clicking the trigger
    await userEvent.click(screen.getByTestId('host-select'));

    // Radix Select options are rendered in a portal with role="option"
    await waitFor(() => {
      expect(screen.getAllByRole('option')).toHaveLength(2);
    });
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

    await renderInTestApp(
      <TestApiProvider apis={[[scaffolderApiRef, mockScaffolderApi]]}>
        <RepoUrlPickerHost
          hosts={['github.com', 'gitlab.com', 'notfound.host']}
          onChange={mockOnChange}
          rawErrors={[]}
        />
      </TestApiProvider>,
    );

    // Wait for async load
    await waitFor(() => {
      expect(screen.getByTestId('host-select')).toBeInTheDocument();
    });

    // Open the Radix Select
    await userEvent.click(screen.getByTestId('host-select'));

    // Only hosts with matching integrations appear as options
    await waitFor(() => {
      expect(screen.getAllByRole('option')).toHaveLength(2);
    });
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

    await renderInTestApp(
      <TestApiProvider apis={[[scaffolderApiRef, mockScaffolderApi]]}>
        <RepoUrlPickerHost
          hosts={['github.com', 'gitlab.com']}
          onChange={mockOnChange}
          rawErrors={[]}
          isDisabled
        />
      </TestApiProvider>,
    );

    // Wait for async load, then check the Radix SelectTrigger is disabled
    await waitFor(() => {
      expect(screen.getByTestId('host-select')).toBeDisabled();
    });
  });
});
