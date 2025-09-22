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

import { TestApiRegistry, renderInTestApp } from '@backstage/test-utils';
import { fireEvent, screen } from '@testing-library/react';
import { UserSettingsAuthProviders } from './UserSettingsAuthProviders';

import { ApiProvider, ConfigReader } from '@backstage/core-app-api';
import { configApiRef, googleAuthApiRef } from '@backstage/core-plugin-api';

const mockSignInHandler = jest.fn().mockReturnValue(Promise.resolve());
const mockGoogleAuth = {
  sessionState$: () => ({
    [Symbol.observable]: jest.fn(),
    subscribe: () => ({
      closed: false,
      unsubscribe: () => null,
    }),
  }),
  signIn: mockSignInHandler,
};

const createConfig = () =>
  new ConfigReader({
    auth: {
      providers: {
        google: { development: {} },
      },
    },
  });

const config = createConfig();

const apiRegistry = TestApiRegistry.from(
  [configApiRef, config],
  [googleAuthApiRef, mockGoogleAuth],
);

describe('<UserSettingsAuthProviders />', () => {
  it('displays a provider and calls its sign-in handler on click', async () => {
    await renderInTestApp(
      <ApiProvider apis={apiRegistry}>
        <UserSettingsAuthProviders />
      </ApiProvider>,
    );

    expect(screen.getByText('Google')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Provides authentication towards Google APIs and identities',
      ),
    ).toBeInTheDocument();

    const button = screen.getByTitle('Sign in to Google');
    fireEvent.click(button);
    expect(mockSignInHandler).toHaveBeenCalledTimes(1);
  });
});
