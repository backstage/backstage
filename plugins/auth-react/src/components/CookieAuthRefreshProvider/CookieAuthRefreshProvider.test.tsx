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
import userEvent from '@testing-library/user-event';
import { CookieAuthRefreshProvider } from './CookieAuthRefreshProvider';
import { TestApiProvider, renderInTestApp } from '@backstage/test-utils';
import { createApiRef } from '@backstage/core-plugin-api';
import { AuthApi } from '../../types';

describe('CookieAuthRefreshProvider', () => {
  function getExpiresAtInFuture() {
    const tenMinutesInMilliseconds = 10 * 60 * 1000;
    return new Date(Date.now() + tenMinutesInMilliseconds).toISOString();
  }

  global.BroadcastChannel = jest.fn().mockImplementation(() => ({
    postMessage: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
  }));

  it('should render a progress bar', async () => {
    const apiRef = createApiRef<AuthApi>({ id: 'auth-test' });
    const apiMock = {
      getCookie: jest.fn().mockReturnValue(new Promise(() => {})),
    };

    await renderInTestApp(
      <TestApiProvider apis={[[apiRef, apiMock]]}>
        <CookieAuthRefreshProvider apiRef={apiRef}>
          <div>Test Content</div>
        </CookieAuthRefreshProvider>
      </TestApiProvider>,
    );

    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('should render a error panel', async () => {
    const apiRef = createApiRef<AuthApi>({ id: 'auth-test' });
    const error = new Error('Failed to get cookie');
    const apiMock = {
      getCookie: jest.fn().mockRejectedValue(error),
    };

    await renderInTestApp(
      <TestApiProvider apis={[[apiRef, apiMock]]}>
        <CookieAuthRefreshProvider apiRef={apiRef}>
          <div>Test Content</div>
        </CookieAuthRefreshProvider>
      </TestApiProvider>,
    );

    expect(screen.getByText(error.message)).toBeInTheDocument();
  });

  it('should call the api again when retry is clicked', async () => {
    const apiRef = createApiRef<AuthApi>({ id: 'auth-test' });
    const error = new Error('Failed to get cookie');
    const apiMock = {
      getCookie: jest.fn().mockRejectedValueOnce(error).mockResolvedValue({
        expiresAt: getExpiresAtInFuture(),
      }),
    };

    await renderInTestApp(
      <TestApiProvider apis={[[apiRef, apiMock]]}>
        <CookieAuthRefreshProvider apiRef={apiRef}>
          <div>Test Content</div>
        </CookieAuthRefreshProvider>
      </TestApiProvider>,
    );

    expect(apiMock.getCookie).toHaveBeenCalledTimes(1);

    expect(screen.getByText(error.message)).toBeInTheDocument();

    await userEvent.click(screen.getByText('Retry'));

    expect(apiMock.getCookie).toHaveBeenCalledTimes(2);

    await waitFor(() =>
      expect(screen.getByText('Test Content')).toBeInTheDocument(),
    );
  });

  it('should render the children', async () => {
    const apiRef = createApiRef<AuthApi>({ id: 'auth-test' });
    const apiMock = {
      getCookie: jest.fn().mockResolvedValue({
        expiresAt: {
          expiresAt: getExpiresAtInFuture(),
        },
      }),
    };

    await renderInTestApp(
      <TestApiProvider apis={[[apiRef, apiMock]]}>
        <CookieAuthRefreshProvider apiRef={apiRef}>
          <div>Test Content</div>
        </CookieAuthRefreshProvider>
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText('Test Content')).toBeInTheDocument(),
    );
  });
});
