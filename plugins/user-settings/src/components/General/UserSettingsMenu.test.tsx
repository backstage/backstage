/*
 * Copyright 2020 The Backstage Authors
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

import {
  MockErrorApi,
  TestApiProvider,
  renderInTestApp,
  mockApis,
} from '@backstage/test-utils';
import { errorApiRef, identityApiRef } from '@backstage/core-plugin-api';
import { fireEvent, waitFor, screen } from '@testing-library/react';
import React from 'react';
import { UserSettingsMenu } from './UserSettingsMenu';

describe('<UserSettingsMenu />', () => {
  it('displays a menu button with a sign-out option', async () => {
    await renderInTestApp(<UserSettingsMenu />);

    const menuButton = screen.getByLabelText('more');
    fireEvent.click(menuButton);

    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('handles errors that occur when signing out', async () => {
    const failingIdentityApi = mockApis.identity.mock({
      signOut: () => Promise.reject(new Error('Logout error')),
    });
    const mockErrorApi = new MockErrorApi({ collect: true });
    await renderInTestApp(
      <TestApiProvider
        apis={[
          [errorApiRef, mockErrorApi],
          [identityApiRef, failingIdentityApi],
        ]}
      >
        <UserSettingsMenu />
      </TestApiProvider>,
    );

    const menuButton = screen.getByLabelText('more');
    fireEvent.click(menuButton);
    fireEvent.click(screen.getByText('Sign Out'));

    await waitFor(() => {
      expect(mockErrorApi.getErrors()).toHaveLength(1);
    });
  });
});
