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

import { alertApiRef, identityApiRef } from '@backstage/core-plugin-api';
import { catalogApiRef } from '@backstage/plugin-catalog-react';
import { catalogApiMock } from '@backstage/plugin-catalog-react/testUtils';
import { mockApis, TestApiProvider } from '@backstage/test-utils';
import { renderHook, waitFor } from '@testing-library/react';
import { useUserProfile } from './useUserProfile';

describe('useUserProfile', () => {
  it('loads the user profile and uses the catalog picture as a fallback', async () => {
    const identityApi = mockApis.identity({
      userEntityRef: 'user:default/test-user',
      ownershipEntityRefs: ['group:default/test-team'],
      displayName: 'Test User',
      email: 'test@example.com',
    });
    const catalogApi = catalogApiMock({
      entities: [
        {
          apiVersion: 'backstage.io/v1beta1',
          kind: 'User',
          metadata: { name: 'test-user' },
          spec: {
            profile: { picture: 'https://example.com/avatar.png' },
          },
        },
      ],
    });

    const { result } = renderHook(() => useUserProfile(), {
      wrapper: ({ children }) => (
        <TestApiProvider
          apis={[
            [alertApiRef, { post: jest.fn() }],
            [identityApiRef, identityApi],
            [catalogApiRef, catalogApi],
          ]}
        >
          {children}
        </TestApiProvider>
      ),
    });

    expect(result.current).toEqual({
      profile: {},
      displayName: '',
      loading: true,
    });
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current).toEqual({
      profile: {
        displayName: 'Test User',
        email: 'test@example.com',
        picture: 'https://example.com/avatar.png',
      },
      backstageIdentity: {
        type: 'user',
        userEntityRef: 'user:default/test-user',
        ownershipEntityRefs: ['group:default/test-team'],
      },
      displayName: 'Test User',
      loading: false,
    });
  });

  it('posts an alert and returns an empty profile when loading fails', async () => {
    const error = new Error('profile unavailable');
    const alertApi = { post: jest.fn() };
    const identityApi = mockApis.identity.mock({
      getProfileInfo: () => Promise.reject(error),
    });

    const { result } = renderHook(() => useUserProfile(), {
      wrapper: ({ children }) => (
        <TestApiProvider
          apis={[
            [alertApiRef, alertApi],
            [identityApiRef, identityApi],
            [catalogApiRef, catalogApiMock.mock()],
          ]}
        >
          {children}
        </TestApiProvider>
      ),
    });

    await waitFor(() =>
      expect(alertApi.post).toHaveBeenCalledWith({
        message: 'Failed to load user identity: Error: profile unavailable',
        severity: 'error',
      }),
    );
    expect(result.current).toEqual({
      profile: {},
      displayName: '',
      loading: false,
    });
  });
});
