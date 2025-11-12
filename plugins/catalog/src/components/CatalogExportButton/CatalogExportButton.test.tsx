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
import { useBackstageStreamedDownload } from './file-download';

const mockAlertApi = {
  post: jest.fn(),
};
jest.mock('@backstage/core-plugin-api', () => ({
  ...jest.requireActual('@backstage/core-plugin-api'),
  useApi: () => mockAlertApi,
}));

jest.mock('./file-download/useBackstageStreamedDownload', () => ({
  useBackstageStreamedDownload: jest.fn(),
}));
const useBackstageStreamedDownloadMock =
  useBackstageStreamedDownload as jest.Mock;
const mockDownload = jest.fn();

describe('CatalogExportButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useBackstageStreamedDownloadMock.mockReturnValue({
      download: mockDownload,
      loading: false,
      error: null,
    });
  });

  it('renders the export button', () => {
    render(<CatalogExportButton />);
    expect(
      screen.getByRole('button', { name: /Export selection/i }),
    ).toBeInTheDocument();
  });

  it('opens and closes the dialog', async () => {
    render(<CatalogExportButton />);
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
    const { rerender } = render(<CatalogExportButton />);

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );

    useBackstageStreamedDownloadMock.mockReturnValue({
      download: mockDownload,
      loading: true,
      error: null,
    });

    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    useBackstageStreamedDownloadMock.mockReturnValue({
      download: mockDownload,
      loading: false,
      error: null,
    });
    rerender(<CatalogExportButton />);

    await waitFor(() => {
      expect(mockAlertApi.post).toHaveBeenCalledWith({
        message: 'Catalog exported successfully',
        severity: 'success',
      });
    });

    expect(mockDownload).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('handles failed export', async () => {
    const testError = new Error('Network error');
    useBackstageStreamedDownloadMock.mockReturnValue({
      download: mockDownload,
      loading: false,
      error: null,
    });

    const { rerender } = render(<CatalogExportButton />);

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );

    useBackstageStreamedDownloadMock.mockReturnValue({
      download: mockDownload,
      loading: true,
      error: null,
    });

    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    useBackstageStreamedDownloadMock.mockReturnValue({
      download: mockDownload,
      loading: false,
      error: testError,
    });

    rerender(<CatalogExportButton />);

    await waitFor(() => {
      expect(mockAlertApi.post).toHaveBeenCalledWith({
        message: `Failed to export catalog: ${testError.message}`,
        severity: 'error',
      });
    });

    expect(mockDownload).toHaveBeenCalledTimes(1);
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('allows changing the export format and calls download with it', async () => {
    render(<CatalogExportButton />);

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

    const expectedParams = new URLSearchParams();
    expectedParams.set('exportFormat', 'json');

    expect(mockDownload).toHaveBeenCalledWith({
      url: '/api/catalog/export',
      filename: 'catalog-export.json',
      searchParams: expectedParams,
    });
  });
});
