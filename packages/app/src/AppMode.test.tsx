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

import React from 'react';
import { screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  MockConfigApi,
  TestApiProvider,
  renderInTestApp,
  setupRequestMockHandlers,
} from '@backstage/test-utils';
import { AppMode } from './AppMode';
import {
  configApiRef,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';

describe('AppMode', () => {
  const worker = setupServer();
  setupRequestMockHandlers(worker);

  const configApiMock = new MockConfigApi({
    backend: {
      baseUrl: 'http://localhost:7000',
    },
  });

  const fetchApiMock = {
    fetch: jest.fn(),
  };

  const discoveryApiMock = {
    getBaseUrl: jest.fn().mockResolvedValue('http://localhost:7000/app'),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the progress component while loading', async () => {
    fetchApiMock.fetch.mockReturnValueOnce(new Promise(() => {}));
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [fetchApiRef, fetchApiMock],
        ]}
      >
        <AppMode>Test content</AppMode>
      </TestApiProvider>,
    );
    expect(screen.getByTestId('progress')).toBeVisible();
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });

  it('should render the children even when there is an error', async () => {
    const error = new Error('Failed to fetch');
    fetchApiMock.fetch.mockRejectedValueOnce(error);
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [fetchApiRef, fetchApiMock],
        ]}
      >
        <AppMode>Test content</AppMode>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(screen.getByText('Test content')).toBeInTheDocument(),
    );
    expect(screen.queryByTestId('progress')).not.toBeInTheDocument();
    expect(screen.queryByText('Failed to fetch')).not.toBeInTheDocument();
  });

  it('should render the children even when the public index is not available', async () => {
    fetchApiMock.fetch.mockResolvedValueOnce({ ok: false });
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [fetchApiRef, fetchApiMock],
        ]}
      >
        <AppMode>Test content</AppMode>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(screen.getByText('Test content')).toBeInTheDocument(),
    );
    expect(screen.queryByTestId('progress')).not.toBeInTheDocument();
  });

  it('should render the children also when the public index is available', async () => {
    fetchApiMock.fetch.mockResolvedValueOnce({ ok: true });
    await renderInTestApp(<AppMode>Test content</AppMode>);
    await waitFor(() =>
      expect(screen.getByText('Test content')).toBeInTheDocument(),
    );
    expect(screen.queryByTestId('progress')).not.toBeInTheDocument();
  });

  it('should render the children wrapped in the CookieAuthRefreshProvider', async () => {
    worker.use(
      rest.get('http://localhost:7000/public/index.html', (_, res, ctx) => {
        return res(ctx.status(200));
      }),
      rest.get(
        'http://localhost:7000/app/.backstage/v1-cookie',
        (_, res, ctx) => {
          return res(
            ctx.status(200),
            ctx.json({ expiresAt: Date.now() + 10 * 60 * 1000 }),
          );
        },
      ),
    );
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [configApiRef, configApiMock],
          [discoveryApiRef, discoveryApiMock],
        ]}
      >
        <AppMode>Test content</AppMode>
      </TestApiProvider>,
    );
    await waitFor(() =>
      expect(screen.getByText('Test content')).toBeInTheDocument(),
    );
  });
});
