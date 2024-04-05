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
import { render, screen, waitFor } from '@testing-library/react';
import { discoveryApiRef, fetchApiRef } from '@backstage/core-plugin-api';
import { AppAuthProvider } from './AppAuthProvider';

const now = 1710316886171;
const tenMinutesInMilliseconds = 10 * 60 * 1000;
const tenMinutesFromNowInMilliseconds = now + tenMinutesInMilliseconds;
const expiresAt = new Date(tenMinutesFromNowInMilliseconds).toISOString();

jest.mock('@backstage/core-plugin-api', () => {
  return {
    ...jest.requireActual('@backstage/core-plugin-api'),
    useApp: jest.fn().mockReturnValue({
      getComponents: () => ({ Progress: () => <div data-testid="progress" /> }),
    }),
    useApi: jest.fn(ref => {
      if (ref === discoveryApiRef) {
        return {
          getBaseUrl: jest.fn().mockResolvedValue('http://localhost:7000/app'),
        };
      }

      if (ref === fetchApiRef) {
        return {
          fetch: jest.fn().mockResolvedValue({
            ok: true,
            json: jest.fn().mockResolvedValue({ expiresAt }),
          }),
        };
      }

      // componentsApiRef
      return {
        getComponent: jest
          .fn()
          .mockReturnValue(() => <div data-testid="progress" />),
      };
    }),
  };
});

describe('AppAuthProvider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers({ now });
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should render the children when app mode is undefined', async () => {
    render(<AppAuthProvider>Test content</AppAuthProvider>);
    await waitFor(() =>
      expect(screen.getByText('Test content')).toBeInTheDocument(),
    );
  });

  it('should render the children the app mode is public', async () => {
    render(
      <>
        <meta name="backstage-app-mode" content="public" />
        <AppAuthProvider>Test content</AppAuthProvider>
      </>,
    );
    await waitFor(() =>
      expect(screen.getByText('Test content')).toBeInTheDocument(),
    );
  });

  it('should render the children wrapped in the CookieAuthRefreshProvider', async () => {
    render(
      <>
        <meta name="backstage-app-mode" content="protected" />
        <AppAuthProvider>Test content</AppAuthProvider>
      </>,
    );
    await waitFor(() =>
      expect(screen.getByText('Test content')).toBeInTheDocument(),
    );
  });
});
