/*
 * Copyright 2024 The Backstage Authors
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

import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CookieAuthRefreshProvider } from './CookieAuthRefreshProvider';
import {
  mockApis,
  TestApiProvider,
  renderInTestApp,
} from '@backstage/test-utils';
import {
  discoveryApiRef,
  fetchApiRef,
  storageApiRef,
} from '@backstage/core-plugin-api';

describe('CookieAuthRefreshProvider', () => {
  const discoveryApiMock = mockApis.discovery();

  function getExpiresAtInFuture() {
    const tenMinutesInMilliseconds = 10 * 60 * 1000;
    return new Date(Date.now() + tenMinutesInMilliseconds).toISOString();
  }

  it('should render a progress bar', async () => {
    const fetchApiMock = {
      fetch: jest.fn().mockReturnValue(new Promise(() => {})),
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [fetchApiRef, fetchApiMock],
          [storageApiRef, mockApis.storage()],
          [discoveryApiRef, discoveryApiMock],
        ]}
      >
        <CookieAuthRefreshProvider pluginId="techdocs">
          <div>Test Content</div>
        </CookieAuthRefreshProvider>
      </TestApiProvider>,
    );

    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();

    expect(screen.getByTestId('progress')).toBeVisible();
  });

  it('should render an error panel', async () => {
    const error = new Error('Failed to get cookie');
    const fetchApiMock = {
      fetch: jest.fn().mockRejectedValue(error),
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [fetchApiRef, fetchApiMock],
          [storageApiRef, mockApis.storage()],
          [discoveryApiRef, discoveryApiMock],
        ]}
      >
        <CookieAuthRefreshProvider pluginId="techdocs">
          <div>Test Content</div>
        </CookieAuthRefreshProvider>
      </TestApiProvider>,
    );

    expect(screen.getByText(error.message)).toBeInTheDocument();
  });

  it('should call the api again when retry is clicked', async () => {
    const error = new Error('Failed to get cookie');
    const fetchApiMock = {
      fetch: jest
        .fn()
        .mockRejectedValueOnce(error)
        .mockResolvedValue({
          ok: true,
          json: jest.fn().mockResolvedValue({
            expiresAt: getExpiresAtInFuture(),
          }),
        }),
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [fetchApiRef, fetchApiMock],
          [storageApiRef, mockApis.storage()],
          [discoveryApiRef, discoveryApiMock],
        ]}
      >
        <CookieAuthRefreshProvider pluginId="techdocs">
          <div>Test Content</div>
        </CookieAuthRefreshProvider>
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(fetchApiMock.fetch).toHaveBeenCalledWith(
        'http://example.com/api/techdocs/.backstage/auth/v1/cookie',
        { credentials: 'include' },
      ),
    );

    expect(fetchApiMock.fetch).toHaveBeenCalledTimes(1);

    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();

    expect(screen.getByText(error.message)).toBeInTheDocument();

    await userEvent.click(screen.getByText('Retry'));

    expect(fetchApiMock.fetch).toHaveBeenCalledTimes(2);

    await waitFor(() =>
      expect(screen.getByText('Test Content')).toBeInTheDocument(),
    );
  });

  it('should render the children', async () => {
    const fetchApiMock = {
      fetch: jest.fn().mockResolvedValue({
        ok: true,
        json: jest.fn().mockResolvedValue({
          expiresAt: getExpiresAtInFuture(),
        }),
      }),
    };

    await renderInTestApp(
      <TestApiProvider
        apis={[
          [fetchApiRef, fetchApiMock],
          [storageApiRef, mockApis.storage()],
          [discoveryApiRef, discoveryApiMock],
        ]}
      >
        <CookieAuthRefreshProvider pluginId="techdocs">
          <div>Test Content</div>
        </CookieAuthRefreshProvider>
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText('Test Content')).toBeInTheDocument(),
    );
  });
});
