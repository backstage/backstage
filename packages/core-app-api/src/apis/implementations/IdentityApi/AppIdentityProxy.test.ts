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

import { vi } from 'vitest';

import { withLogCollector } from '@backstage/test-utils';
import { AppIdentityProxy } from './AppIdentityProxy';

describe('AppIdentityProxy', () => {
  const mockIdentityApi = {
    getBackstageIdentity: vi.fn(),
    getProfileInfo: vi.fn(),
    getCredentials: vi.fn(),
    signOut: vi.fn(),
  };

  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('should forward user identities', async () => {
    const proxy = new AppIdentityProxy();
    proxy.setTarget(mockIdentityApi, { signOutTargetUrl: '/' });

    const logs = await withLogCollector(async () => {
      mockIdentityApi.getBackstageIdentity.mockResolvedValueOnce({
        type: 'user',
        userEntityRef: 'user:default/foo',
        ownershipEntityRefs: [],
      });
      await expect(proxy.getBackstageIdentity()).resolves.toEqual({
        type: 'user',
        userEntityRef: 'user:default/foo',
        ownershipEntityRefs: [],
      });
    });

    expect(logs).toEqual({
      log: [],
      warn: [],
      error: [],
    });
  });

  it('should warn about invalid user entity refs', async () => {
    const proxy = new AppIdentityProxy();
    proxy.setTarget(mockIdentityApi, { signOutTargetUrl: '/' });

    const logs = await withLogCollector(async () => {
      mockIdentityApi.getBackstageIdentity.mockResolvedValueOnce({
        type: 'user',
        userEntityRef: 'bar',
        ownershipEntityRefs: [],
      });
      await expect(proxy.getBackstageIdentity()).resolves.toEqual({
        type: 'user',
        userEntityRef: 'bar',
        ownershipEntityRefs: [],
      });
    });

    expect(logs).toEqual({
      log: [],
      warn: [
        `WARNING: The App IdentityApi provided an invalid userEntityRef, 'bar'. ` +
          `It must be a full Entity Reference of the form '<kind>:<namespace>/<name>'.`,
      ],
      error: [],
    });
  });

  it('should navigate to target URL on sign out', async () => {
    const proxy = new AppIdentityProxy();
    proxy.setTarget(mockIdentityApi, { signOutTargetUrl: '/foo' });

    const navigateSpy = vi.spyOn(proxy as any, 'navigateToUrl');
    await proxy.signOut();
    expect(navigateSpy).toHaveBeenCalledWith('/foo');
  });
});
