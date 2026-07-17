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
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CatalogExportButton } from './CatalogExportButton';
import { useStreamingExport } from './file-download';
import {
  catalogApiRef,
  EntityListProvider,
} from '@backstage/plugin-catalog-react';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { toastApiRef } from '@backstage/frontend-plugin-api';

const mockToastApi = {
  post: jest.fn(),
};

jest.mock('./file-download/useStreamingExport', () => ({
  useStreamingExport: jest.fn(),
}));
const useStreamingExportMock = useStreamingExport as jest.Mock;
const mockExportStream = jest.fn();

const renderComponent = (
  settings?: Parameters<typeof CatalogExportButton>[0]['settings'],
  iconOnly?: Parameters<typeof CatalogExportButton>[0]['iconOnly'],
) =>
  renderInTestApp(
    <TestApiProvider
      apis={[
        [toastApiRef, mockToastApi],
        [catalogApiRef, {}],
      ]}
    >
      <EntityListProvider>
        <CatalogExportButton settings={settings} iconOnly={iconOnly} />
      </EntityListProvider>
    </TestApiProvider>,
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

  it('renders the export button', async () => {
    await renderComponent();
    expect(
      screen.getByRole('button', { name: /Export selection/i }),
    ).toBeInTheDocument();
  });

  it('renders an accessible icon-only export button', async () => {
    await renderComponent(undefined, true);

    const button = screen.getByRole('button', { name: /Export selection/i });
    expect(button).toHaveClass('bui-ButtonIcon');
    expect(button).not.toHaveTextContent('Export selection');
  });

  it('opens and closes the dialog', async () => {
    await renderComponent();
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

    await renderComponent();

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );
    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    await waitFor(() => {
      expect(mockExportStream).toHaveBeenCalledTimes(1);
      expect(mockToastApi.post).toHaveBeenCalledWith({
        title: 'Catalog exported successfully',
        status: 'success',
      });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('calls onSuccess callback if provided', async () => {
    mockExportStream.mockResolvedValueOnce(undefined);
    const onSuccess = jest.fn();

    await renderComponent({ onSuccess });

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );
    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    await waitFor(() => {
      expect(onSuccess).toHaveBeenCalled();
      // Alert should not be shown when callback is provided
      expect(mockToastApi.post).not.toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Catalog exported successfully',
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

    await renderComponent();

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );
    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    await waitFor(() => {
      expect(mockExportStream).toHaveBeenCalledTimes(1);
      expect(mockToastApi.post).toHaveBeenCalledWith({
        title: `Failed to export catalog: ${testError.message}`,
        status: 'danger',
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

    await renderComponent({ onError });

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );
    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    await waitFor(() => {
      expect(onError).toHaveBeenCalledWith({ error: testError });
      // Alert should not be shown when callback is provided
      expect(mockToastApi.post).not.toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Failed to export'),
        }),
      );
    });
  });

  it('allows changing the export format and calls exportStream with it', async () => {
    await renderComponent();

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
      expect(mockExportStream).toHaveBeenCalledWith(
        expect.objectContaining({
          exportFormat: 'json',
          filename: 'catalog-export.json',
          columns: [
            { entityFilterKey: 'metadata.name', title: 'Name' },
            { entityFilterKey: 'spec.type', title: 'Type' },
            { entityFilterKey: 'spec.owner', title: 'Owner' },
            { entityFilterKey: 'metadata.description', title: 'Description' },
          ],
        }),
      );
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

    await renderComponent({ columns: customColumns });

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
    await renderComponent();

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
    await renderComponent();

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
    await renderComponent();

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
    await renderComponent();

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

    await renderComponent({ columns: customColumns });

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );

    expect(screen.getByRole('checkbox', { name: 'Name' })).toBeChecked();
    expect(screen.getByRole('checkbox', { name: 'Namespace' })).toBeChecked();
    expect(
      screen.queryByRole('checkbox', { name: 'Type' }),
    ).not.toBeInTheDocument();
  });

  it('hides built-in export types when disableBuiltinExporters is true', async () => {
    const exporters = {
      xml: { exporter: jest.fn(), label: 'XML' },
    };

    await renderComponent({ disableBuiltinExporters: true, exporters });

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );

    const formatSelect = screen.getByTestId('format-select');
    const selectButton = within(formatSelect).getByRole('button');
    await userEvent.click(selectButton);

    await waitFor(() => {
      expect(
        screen.queryByRole('option', { name: 'CSV' }),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByRole('option', { name: 'JSON' }),
      ).not.toBeInTheDocument();
      expect(screen.getByRole('option', { name: 'XML' })).toBeInTheDocument();
    });
  });

  it('shows custom export types in the dialog', async () => {
    const exporters = {
      xml: { exporter: jest.fn(), label: 'XML' },
      yaml: { exporter: jest.fn(), label: 'YAML' },
    };

    await renderComponent({ exporters });

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

  it('disables confirm button when disableBuiltinExporters is true and no exporters are provided', async () => {
    await renderComponent({ disableBuiltinExporters: true });

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );

    expect(screen.getByRole('button', { name: /Confirm/i })).toBeDisabled();
  });

  it('passes custom exporter fn to exportStream when custom type is selected', async () => {
    const mockCustomExporterFn = jest.fn();
    const exporters = {
      xml: { exporter: mockCustomExporterFn },
    };

    mockExportStream.mockClear();
    useStreamingExportMock.mockReturnValue({
      exportStream: mockExportStream,
      loading: false,
      error: null,
    });

    await renderComponent({ exporters });

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
          exporter: mockCustomExporterFn,
        }),
      );
    });
  });
});
