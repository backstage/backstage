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
import {
  catalogApiRef,
  EntityListProvider,
} from '@backstage/plugin-catalog-react';
import { MemoryRouter } from 'react-router-dom';
import { TestApiProvider } from '@backstage/test-utils';
import { alertApiRef, discoveryApiRef } from '@backstage/core-plugin-api';

const mockAlertApi = {
  post: jest.fn(),
};

jest.mock('./file-download/useBackstageStreamedDownload', () => ({
  useBackstageStreamedDownload: jest.fn(),
}));
const useBackstageStreamedDownloadMock =
  useBackstageStreamedDownload as jest.Mock;
const mockDownload = jest.fn();

const getComponent = () => (
  <TestApiProvider
    apis={[
      [
        discoveryApiRef,
        { getBaseUrl: (_: string) => Promise.resolve('/api/catalog') },
      ],
      [alertApiRef, mockAlertApi],
      [catalogApiRef, {}],
    ]}
  >
    <MemoryRouter>
      <EntityListProvider>
        <CatalogExportButton />
      </EntityListProvider>
    </MemoryRouter>
  </TestApiProvider>
);

describe('CatalogExportButton', () => {
  beforeEach(() => {
    useBackstageStreamedDownloadMock.mockReturnValue({
      download: mockDownload,
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
    mockDownload.mockResolvedValueOnce(undefined);

    render(getComponent());

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );
    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    await waitFor(() => {
      expect(mockDownload).toHaveBeenCalledTimes(1);
      expect(mockAlertApi.post).toHaveBeenCalledWith({
        message: 'Catalog exported successfully',
        severity: 'success',
      });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('handles failed export', async () => {
    const testError = new Error('Network error');

    useBackstageStreamedDownloadMock.mockReturnValue({
      download: mockDownload,
      loading: false,
      error: testError,
    });

    render(getComponent());

    await userEvent.click(
      screen.getByRole('button', { name: /Export selection/i }),
    );
    await userEvent.click(screen.getByRole('button', { name: /Confirm/i }));

    await waitFor(() => {
      expect(mockDownload).toHaveBeenCalledTimes(1);
      expect(mockAlertApi.post).toHaveBeenCalledWith({
        message: `Failed to export catalog: ${testError.message}`,
        severity: 'error',
      });
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('allows changing the export format and calls download with it', async () => {
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

    const expectedParams = new URLSearchParams();
    expectedParams.set('exportFormat', 'json');

    expect(mockDownload).toHaveBeenCalledWith({
      url: '/api/catalog/export',
      filename: 'catalog-export.json',
      searchParams: expectedParams,
    });
  });
});
