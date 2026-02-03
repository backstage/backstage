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
import {
  TestApiProvider,
  renderInTestApp,
  mockApis,
} from '@backstage/test-utils';
import { identityApiRef } from '@backstage/core-plugin-api';
import { CookieAuthRedirect } from './CookieAuthRedirect';

describe('CookieAuthRedirect', () => {
  const identityApiMock = mockApis.identity.mock();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render an error message if token is not available', async () => {
    identityApiMock.getCredentials.mockResolvedValue({ token: undefined });

    await renderInTestApp(
      <TestApiProvider apis={[[identityApiRef, identityApiMock]]}>
        <CookieAuthRedirect />
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(
        screen.getByText(
          'An error occurred: Expected Backstage token in sign-in response',
        ),
      ).toBeInTheDocument(),
    );
  });

  it('should render a form with token if token is available', async () => {
    identityApiMock.getCredentials.mockResolvedValue({ token: 'test-token' });

    await renderInTestApp(
      <TestApiProvider apis={[[identityApiRef, identityApiMock]]}>
        <CookieAuthRedirect />
      </TestApiProvider>,
    );

    await waitFor(() =>
      expect(screen.getByText('Continue')).toBeInTheDocument(),
    );

    expect(screen.getByDisplayValue('sign-in')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test-token')).toBeInTheDocument();
  });
});
