/*
 * Copyright 2023 The Backstage Authors
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
import { renderHook } from '@testing-library/react';
import { act } from 'react-dom/test-utils';

import {
  useLogoutDisconnectedUserEffect,
  UseLogoutDisconnectedUserEffectProps,
} from './disconnectedUsers';

const mockIdentityApi = {
  signOut: jest.fn(),
  getProfileInfo: jest.fn(),
  getBackstageIdentity: jest.fn(),
  getCredentials: jest.fn(),
};

const mockTimestampStore = {
  get: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('useLogoutDisconnectedUserEffect', () => {
  it('should not do anything if effect is not enabled', () => {
    const props: UseLogoutDisconnectedUserEffectProps = {
      enableEffect: false,
      autologoutIsEnabled: true,
      idleTimeoutSeconds: 300,
      lastSeenOnlineStore: mockTimestampStore,
      identityApi: mockIdentityApi,
    };

    renderHook(() => useLogoutDisconnectedUserEffect(props));

    expect(mockTimestampStore.get).not.toHaveBeenCalled();
    expect(mockIdentityApi.signOut).not.toHaveBeenCalled();
  });

  it('should delete the store if autologout is not enabled', () => {
    const props: UseLogoutDisconnectedUserEffectProps = {
      enableEffect: true,
      autologoutIsEnabled: false,
      idleTimeoutSeconds: 300,
      lastSeenOnlineStore: mockTimestampStore,
      identityApi: mockIdentityApi,
    };

    renderHook(() => useLogoutDisconnectedUserEffect(props));

    expect(mockTimestampStore.delete).toHaveBeenCalled();
  });

  it('should call signOut if idle timeout passed', () => {
    jest.useFakeTimers();

    const props: UseLogoutDisconnectedUserEffectProps = {
      enableEffect: true,
      autologoutIsEnabled: true,
      idleTimeoutSeconds: 1,
      lastSeenOnlineStore: {
        ...mockTimestampStore,
        get: jest.fn().mockReturnValue(new Date(Date.now() - 2000)), // 2 seconds before now
      },
      identityApi: mockIdentityApi,
    };

    renderHook(() => useLogoutDisconnectedUserEffect(props));

    act(() => {
      jest.advanceTimersByTime(2000);
    });

    expect(mockIdentityApi.signOut).toHaveBeenCalled();

    jest.useRealTimers();
  });

  it('should save the current time to the store when app is loaded', () => {
    const props: UseLogoutDisconnectedUserEffectProps = {
      enableEffect: true,
      autologoutIsEnabled: true,
      idleTimeoutSeconds: 300,
      lastSeenOnlineStore: mockTimestampStore,
      identityApi: mockIdentityApi,
    };

    renderHook(() => useLogoutDisconnectedUserEffect(props));

    expect(mockTimestampStore.get).toHaveBeenCalled();
    expect(mockTimestampStore.save).toHaveBeenCalled();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
