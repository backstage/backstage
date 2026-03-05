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
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CatalogExportButton } from './CatalogExportButton';
import { useStreamingExport } from './file-download';
import {
  catalogApiRef,
  EntityListProvider,
} from '@backstage/plugin-catalog-react';
import { MemoryRouter } from 'react-router-dom';
import { TestApiProvider } from '@backstage/test-utils';
import { alertApiRef } from '@backstage/core-plugin-api';

const mockAlertApi = {
  post: jest.fn(),
};

jest.mock('./file-download/useStreamingExport', () => ({
  useStreamingExport: jest.fn(),
}));
const useStreamingExportMock = useStreamingExport as jest.Mock;
const mockExportStream = jest.fn();

const getComponent = (
  settings?: Parameters<typeof CatalogExportButton>[0]['settings'],
) => (
  <TestApiProvider
    apis={[
      [alertApiRef, mockAlertApi],
      [catalogApiRef, {}],
    ]}
  >
    <MemoryRouter>
      <EntityListProvider>
        <CatalogExportButton settings={settings} />
      </EntityListProvider>
    </MemoryRouter>
  </TestApiProvider>
);

describe('CatalogExportButton', () => {
  beforeEach(() => {
    useStreamingExportMock.mockReturnValue({
      exportStream: mockExportStream,
      loading: false,
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the export button', () => {
    render(getComponent());
    expect(
      screen.getByRole('button', { name: /Export selection/i }),
    ).toBeInTheDocument();
  });

  it('opens and closes the dialog', async () => {
    render(getComponent());
    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Export catalog selection')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('handles successful export', async () => {
    mockExportStream.mockResolvedValueOnce(undefined);

    render(getComponent());

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );
    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    await waitFor(() => {
      expect(mockExportStream).toHaveBeenCalledTimes(1);
      expect(mockAlertApi.post).toHaveBeenCalledWith({
        message: 'Catalog exported successfully',
        severity: 'success',
      });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('calls onSuccess callback if provided', async () => {
    mockExportStream.mockResolvedValueOnce(undefined);
    const onSuccess = jest.fn();

    render(getComponent({ onSuccess }));

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );
    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
      // Alert should not be shown when callback is provided
      expect(mockAlertApi.post).not.toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Catalog exported successfully',
        }),
      );
    });
  });

  it('handles failed export', async () => {
    const testError = new Error('Network error');

    useStreamingExportMock.mockReturnValue({
      exportStream: mockExportStream,
      loading: false,
      error: testError,
    });

    render(getComponent());

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );
    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    await waitFor(() => {
      expect(mockExportStream).toHaveBeenCalledTimes(1);
      expect(mockAlertApi.post).toHaveBeenCalledWith({
        message: `Failed to export catalog: ${testError.message}`,
        severity: 'error',
      });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('calls onError callback if provided on failure', async () => {
    const testError = new Error('Network error');
    const onError = jest.fn();

    useStreamingExportMock.mockReturnValue({
      exportStream: mockExportStream,
      loading: false,
      error: testError,
    });

    render(getComponent({ onError }));

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );
    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith(testError);
      // Alert should not be shown when callback is provided
      expect(mockAlertApi.post).not.toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Failed to export'),
        }),
      );
    });
  });

  it('allows changing the export format and calls exportStream with it', async () => {
    render(getComponent());

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );

    const formatSelect = screen.getByTestId('format-select');
    await waitFor(() => {
      expect(formatSelect).toHaveTextContent('CSV');
    });

    const selectButton = within(formatSelect).getByRole('button');
    await userEvent.click(selectButton);

    await userEvent.click(await screen.findByRole('option', { name: 'JSON' }));

    await waitFor(() => {
      expect(formatSelect).toHaveTextContent('JSON');
    });

    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    await waitFor(() => {
      expect(mockExportStream).toHaveBeenCalledWith({
        exportFormat: 'json',
        filename: 'catalog-export.json',
        columns: [
          { entityFilterKey: 'metadata.name', title: 'Name' },
          { entityFilterKey: 'spec.type', title: 'Type' },
          { entityFilterKey: 'spec.owner', title: 'Owner' },
          { entityFilterKey: 'metadata.description', title: 'Description' },
        ],
        streamRequest: undefined,
      });
    });
  });

  it('passes custom columns to exportStream if provided', async () => {
    const customColumns = [
      { entityFilterKey: 'metadata.name', title: 'Name' },
      { entityFilterKey: 'metadata.namespace', title: 'Namespace' },
    ];

    mockExportStream.mockClear();
    useStreamingExportMock.mockReturnValue({
      exportStream: mockExportStream,
      loading: false,
      error: null,
    });

    render(getComponent({ columns: customColumns }));

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );
    mockExportStream.mockResolvedValueOnce(undefined);
    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    await waitFor(() => {
      expect(mockExportStream).toHaveBeenCalledWith(
        expect.objectContaining({
          columns: customColumns,
        }),
      );
    });
  });

  it('shows column checkboxes for default columns in the dialog', async () => {
    render(getComponent());

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );

    expect(screen.getByRole('checkbox', { name: 'Name' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Type' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Owner' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Description' })).toBeChecked();
  });

  it('excludes deselected columns from the export', async () => {
    mockExportStream.mockResolvedValueOnce(undefined);
    render(getComponent());

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );

    await userEvent.click(screen.getByRole('checkbox', { name: 'Type' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Owner' }));

    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    await waitFor(() => {
      expect(mockExportStream).toHaveBeenCalledWith(
        expect.objectContaining({
          columns: [
            { entityFilterKey: 'metadata.name', title: 'Name' },
            { entityFilterKey: 'metadata.description', title: 'Description' },
          ],
        }),
      );
    });
  });

  it('disables the Confirm button when no columns are selected', async () => {
    render(getComponent());

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );

    await userEvent.click(screen.getByRole('checkbox', { name: 'Name' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Type' }));
    await userEvent.click(screen.getByRole('checkbox', { name: 'Owner' }));
    await userEvent.click(
      screen.getByRole('checkbox', { name: 'Description' }),
    );

    expect(screen.getByRole('button', { name: /Confirm/i })).toBeDisabled();
  });

  it('resets column selection when dialog is reopened', async () => {
    render(getComponent());

    // Open dialog, deselect a column, close
    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );
    await userEvent.click(screen.getByRole('checkbox', { name: 'Type' }));
    expect(screen.getByRole('checkbox', { name: 'Type' })).not.toBeChecked();
    await userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Reopen, column should be checked again
    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );
    expect(screen.getByRole('checkbox', { name: 'Type' })).toBeChecked();
  });

  it('shows column checkboxes for custom columns in the dialog', async () => {
    const customColumns = [
      { entityFilterKey: 'metadata.name', title: 'Name' },
      { entityFilterKey: 'metadata.namespace', title: 'Namespace' },
    ];

    render(getComponent({ columns: customColumns }));

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );

    expect(screen.getByRole('checkbox', { name: 'Name' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Namespace' })).toBeChecked();
    expect(
      screen.queryByRole('checkbox', { name: 'Type' }),
    ).not.toBeInTheDocument();
  });

  it('shows custom export types in the dialog', async () => {
    const customExporters = {
      xml: jest.fn(),
      yaml: jest.fn(),
    };

    render(getComponent({ customExporters }));

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );

    const formatSelect = screen.getByTestId('format-select');
    const selectButton = within(formatSelect).getByRole('button');
    await userEvent.click(selectButton);

    // Check that both built-in and custom export types are available
    await waitFor(() => {
      expect(screen.getByRole('option', { name: 'CSV' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'JSON' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'XML' })).toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'YAML' })).toBeInTheDocument();
    });
  });

  it('passes custom exporter to exportStream when custom type is selected', async () => {
    const mockCustomExporter = jest.fn();
    const customExporters = {
      xml: mockCustomExporter,
    };

    mockExportStream.mockClear();
    useStreamingExportMock.mockReturnValue({
      exportStream: mockExportStream,
      loading: false,
      error: null,
    });

    render(getComponent({ customExporters }));

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );

    const formatSelect = screen.getByTestId('format-select');
    const selectButton = within(formatSelect).getByRole('button');
    await userEvent.click(selectButton);

    await userEvent.click(screen.getByRole('option', { name: 'XML' }));

    mockExportStream.mockResolvedValueOnce(undefined);
    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    await waitFor(() => {
      expect(mockExportStream).toHaveBeenCalledWith(
        expect.objectContaining({
          exportFormat: 'xml',
          customExporter: mockCustomExporter,
        }),
      );
    });
  });
});
