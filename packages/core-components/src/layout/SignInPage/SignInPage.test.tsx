/*
 * Copyright 2026 The Backstage Authors
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

import { fireEvent, render, screen } from '@testing-library/react';
import {
  mockApis,
  TestApiProvider,
  wrapInTestApp,
} from '@backstage/test-utils';
import {
  BackstageIdentityApi,
  configApiRef,
  createApiRef,
  ProfileInfoApi,
  SessionApi,
} from '@backstage/core-plugin-api';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { SignInPage } from './SignInPage';
import { SignInProviderConfig } from './types';

const testAuthApiRef = createApiRef<
  ProfileInfoApi & BackstageIdentityApi & SessionApi
>({
  id: 'test.auth',
});

const provider: SignInProviderConfig = {
  id: 'test',
  title: 'Test Provider',
  message: 'Sign in with the test provider',
  apiRef: testAuthApiRef,
};

const getBackstageIdentity = jest.fn();
const getProfile = jest.fn();

const LocationProbe = () => {
  const { search } = useLocation();
  return <div>{`Current search: ${search || '(empty)'}`}</div>;
};

const Subject = ({ auto }: { auto?: boolean }) => {
  const [signedIn, setSignedIn] = useState(false);

  if (signedIn) {
    return <div>Signed in</div>;
  }

  return (
    <TestApiProvider
      apis={[
        [
          configApiRef,
          mockApis.config({ data: { app: { title: 'Test App' } } }),
        ],
        [
          testAuthApiRef,
          {
            getBackstageIdentity,
            getProfile,
            signOut: async () => {},
          },
        ],
      ]}
    >
      <SignInPage
        provider={provider}
        auto={auto}
        onSignInSuccess={() => setSignedIn(true)}
      />
      <LocationProbe />
    </TestApiProvider>
  );
};

describe('SignInPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    getProfile.mockResolvedValue({
      email: 'user@example.com',
      displayName: 'Test User',
    });
    // No existing session, but starting a new sign-in attempt succeeds
    getBackstageIdentity.mockImplementation(
      async (options?: { optional?: boolean; instantPopup?: boolean }) => {
        if (options?.instantPopup) {
          return {
            identity: {
              type: 'user',
              userEntityRef: 'user:default/user',
              ownershipEntityRefs: ['user:default/user'],
            },
            token: 'test-token',
          };
        }
        return undefined;
      },
    );
  });

  it('shows an error from the URL without auto sign-in, and removes the error from the URL', async () => {
    render(
      wrapInTestApp(<Subject auto />, {
        routeEntries: ['/?error=Auth+response+is+missing+cookie+nonce'],
      }),
    );

    // The error from the redirect flow is displayed
    await expect(
      screen.findByText('Auth response is missing cookie nonce'),
    ).resolves.toBeInTheDocument();

    // The sign-in page is shown, but auto sign-in was not started while the
    // error is displayed, as that would cause a redirect loop
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(getBackstageIdentity).toHaveBeenCalledWith({ optional: true });
    expect(getBackstageIdentity).not.toHaveBeenCalledWith({
      instantPopup: true,
    });

    // The error param has been removed from the URL, so a reload no longer
    // carries the stale error
    await expect(
      screen.findByText('Current search: (empty)'),
    ).resolves.toBeInTheDocument();
  });

  it('starts a new sign-in attempt when Sign In is clicked while an error is shown', async () => {
    render(
      wrapInTestApp(<Subject auto />, {
        routeEntries: ['/?error=Auth+response+is+missing+cookie+nonce'],
      }),
    );

    fireEvent.click(await screen.findByRole('button', { name: 'Sign In' }));

    // The manual click starts a new sign-in attempt even though an error is
    // being shown, and the successful attempt signs the user in
    await expect(screen.findByText('Signed in')).resolves.toBeInTheDocument();
    expect(getBackstageIdentity).toHaveBeenCalledWith({
      instantPopup: true,
    });
  });

  it('starts auto sign-in on mount when there is no error in the URL', async () => {
    render(wrapInTestApp(<Subject auto />, { routeEntries: ['/'] }));

    await expect(screen.findByText('Signed in')).resolves.toBeInTheDocument();
    expect(getBackstageIdentity).toHaveBeenCalledWith({
      instantPopup: true,
    });
  });
});
