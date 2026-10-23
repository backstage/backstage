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

import { IdentityApiSignOutProxy } from './IdentityApiSignOutProxy';

describe('IdentityApiSignOutProxy', () => {
  const mockIdentityApi = {
    getUserId: jest.fn(),
    getIdToken: jest.fn(),
    getProfile: jest.fn(),
    getProfileInfo: jest.fn(),
    getBackstageIdentity: jest.fn(),
    getCredentials: jest.fn(),
    signOut: jest.fn(),
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('should forward options in signOut', async () => {
    const signOut = jest.fn().mockResolvedValue(undefined);
    const proxy = IdentityApiSignOutProxy.from({
      identityApi: mockIdentityApi,
      signOut,
    });

    await (proxy as any).signOut({ preserveLocation: true });

    expect(signOut).toHaveBeenCalledWith({ preserveLocation: true });
  });

  it('should call signOut without options', async () => {
    const signOut = jest.fn().mockResolvedValue(undefined);
    const proxy = IdentityApiSignOutProxy.from({
      identityApi: mockIdentityApi,
      signOut,
    });

    await proxy.signOut();

    expect(signOut).toHaveBeenCalled();
  });
});
