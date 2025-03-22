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

import { RefreshingAuthSessionManager } from './RefreshingAuthSessionManager';
import { SessionState } from '@backstage/core-plugin-api';

const defaultOptions = {
  sessionScopes: (session: { scopes: Set<string> }) => session.scopes,
  sessionShouldRefresh: (session: { expired: boolean }) => session.expired,
};

describe('RefreshingAuthSessionManager', () => {
  it('should save result from createSession', async () => {
    const createSession = jest.fn().mockResolvedValue({ expired: false });
    const refreshSession = jest.fn().mockRejectedValue(new Error('NOPE'));
    const removeSession = jest.fn();
    const manager = new RefreshingAuthSessionManager({
      connector: { createSession, refreshSession, removeSession },
      ...defaultOptions,
    } as any);
    const stateSubscriber = jest.fn();
    manager.sessionState$().subscribe(stateSubscriber);

    await Promise.resolve(); // Wait a tick for observer to post a value

    expect(stateSubscriber.mock.calls).toEqual([[SessionState.SignedOut]]);
    await manager.getSession({});
    expect(createSession).toHaveBeenCalledTimes(1);

    expect(stateSubscriber.mock.calls).toEqual([
      [SessionState.SignedOut],
      [SessionState.SignedIn],
    ]);
    await manager.getSession({});
    expect(createSession).toHaveBeenCalledTimes(1);

    expect(refreshSession).toHaveBeenCalledWith(new Set());
    expect(stateSubscriber.mock.calls).toEqual([
      [SessionState.SignedOut],
      [SessionState.SignedIn],
    ]);

    expect(removeSession).toHaveBeenCalledTimes(0);
    await manager.removeSession();
    expect(removeSession).toHaveBeenCalledTimes(1);
    expect(stateSubscriber.mock.calls).toEqual([
      [SessionState.SignedOut],
      [SessionState.SignedIn],
      [SessionState.SignedOut],
    ]);
  });

  it('should ask consent only if scopes have changed', async () => {
    const createSession = jest.fn();
    const refreshSession = jest.fn().mockRejectedValue(new Error('NOPE'));
    const manager = new RefreshingAuthSessionManager({
      connector: { createSession, refreshSession },
      ...defaultOptions,
    } as any);

    createSession.mockResolvedValue({
      scopes: new Set(['a']),
      expired: false,
    });
    await manager.getSession({ scopes: new Set(['a']) });
    expect(createSession).toHaveBeenCalledTimes(1);

    await manager.getSession({ scopes: new Set(['a']) });
    expect(createSession).toHaveBeenCalledTimes(1);

    await manager.getSession({ scopes: new Set(['b']) });
    expect(createSession).toHaveBeenCalledTimes(2);
  });

  it('should check for session expiry', async () => {
    const createSession = jest.fn();
    const refreshSession = jest
      .fn()
      .mockRejectedValueOnce(new Error('NOPE'))
      .mockResolvedValue({ scopes: new Set(['a']) });
    const manager = new RefreshingAuthSessionManager({
      connector: { createSession, refreshSession },
      ...defaultOptions,
    } as any);

    createSession.mockResolvedValue({
      scopes: new Set(['a']),
      expired: true,
    });

    await manager.getSession({ scopes: new Set(['a']) });
    expect(createSession).toHaveBeenCalledTimes(1);
    expect(refreshSession).toHaveBeenCalledWith(new Set(['a']));

    await manager.getSession({ scopes: new Set(['a']) });
    expect(createSession).toHaveBeenCalledTimes(1);
    expect(refreshSession).toHaveBeenCalledTimes(2);
  });

  it('should handle user closed popup', async () => {
    const createSession = jest.fn();
    const refreshSession = jest.fn().mockRejectedValue(new Error('NOPE'));
    const manager = new RefreshingAuthSessionManager({
      connector: { createSession, refreshSession },
      ...defaultOptions,
    } as any);

    createSession.mockRejectedValueOnce(new Error('some error'));
    await expect(
      manager.getSession({ scopes: new Set(['a']) }),
    ).rejects.toThrow('some error');
  });

  it('should not get optional session', async () => {
    const createSession = jest.fn();
    const refreshSession = jest.fn().mockRejectedValue(new Error('NOPE'));
    const manager = new RefreshingAuthSessionManager({
      connector: { createSession, refreshSession },
      ...defaultOptions,
    } as any);

    expect(await manager.getSession({ optional: true })).toBe(undefined);
    expect(createSession).toHaveBeenCalledTimes(0);
    expect(refreshSession).toHaveBeenCalledWith(new Set());
  });

  it('should forward option to instantly show auth popup after attempting refresh', async () => {
    const createSession = jest.fn();
    const refreshSession = jest.fn().mockRejectedValue(new Error('NOPE'));
    const manager = new RefreshingAuthSessionManager({
      connector: { createSession, refreshSession },
      ...defaultOptions,
    } as any);

    expect(await manager.getSession({ instantPopup: true })).toBe(undefined);
    expect(createSession).toHaveBeenCalledTimes(1);
    expect(createSession).toHaveBeenCalledWith({
      scopes: new Set(),
      instantPopup: true,
    });
    expect(refreshSession).toHaveBeenCalledTimes(1);
  });

  it('should remove session straight away', async () => {
    const removeSession = jest.fn();
    const manager = new RefreshingAuthSessionManager({
      connector: { removeSession },
      ...defaultOptions,
    } as any);

    await manager.removeSession();
    expect(removeSession).toHaveBeenCalled();
    expect(await manager.getSession({ optional: true })).toBe(undefined);
  });

  it('should handle two simultaneous session refreshes with same scopes', async () => {
    const createSession = jest.fn();
    const refreshSession = jest.fn(async (scopes?: Set<string>) => ({
      scopes: scopes ?? new Set(),
      expired: false,
    }));
    const manager = new RefreshingAuthSessionManager({
      connector: { createSession, refreshSession },
      ...defaultOptions,
    } as any);

    const sessionPromise1 = manager.getSession({ scopes: new Set(['a']) });
    const sessionPromise2 = manager.getSession({ scopes: new Set(['a']) });

    const [session1, session2] = await Promise.all([
      sessionPromise1,
      sessionPromise2,
    ]);

    expect(session1).toEqual({ scopes: new Set(['a']), expired: false });
    expect(session2).toEqual({ scopes: new Set(['a']), expired: false });
    expect(refreshSession).toHaveBeenCalledTimes(1);
  });

  it('should handle two simultaneous session refreshes with different scopes', async () => {
    const createSession = jest.fn();
    const refreshSession = jest.fn(async (scopes?: Set<string>) => ({
      scopes: scopes ?? new Set(),
      expired: false,
    }));
    const manager = new RefreshingAuthSessionManager({
      connector: { createSession, refreshSession },
      ...defaultOptions,
    } as any);

    const sessionPromise1 = manager.getSession({ scopes: new Set(['a']) });
    const sessionPromise2 = manager.getSession({ scopes: new Set(['b']) });

    const [session1, session2] = await Promise.all([
      sessionPromise1,
      sessionPromise2,
    ]);

    expect(session1).toEqual({ scopes: new Set(['a']), expired: false });
    expect(session2).toEqual({ scopes: new Set(['a', 'b']), expired: false });
    expect(refreshSession).toHaveBeenCalledTimes(2);
  });

  it('should handle multiple simultaneous session refreshes with different scopes', async () => {
    const createSession = jest.fn();
    const refreshSession = jest.fn(async (scopes?: Set<string>) => ({
      scopes: scopes ?? new Set(),
      expired: false,
    }));
    const manager = new RefreshingAuthSessionManager({
      connector: { createSession, refreshSession },
      ...defaultOptions,
    } as any);

    const sessionPromise1 = manager.getSession({ scopes: new Set(['a']) });
    const sessionPromise2 = manager.getSession({ scopes: new Set(['a', 'b']) });
    const sessionPromise3 = manager.getSession({ scopes: new Set(['b', 'c']) });
    const sessionPromise4 = manager.getSession({ scopes: new Set(['a', 'c']) });

    const [session1, session2, session3, session4] = await Promise.all([
      sessionPromise1,
      sessionPromise2,
      sessionPromise3,
      sessionPromise4,
    ]);

    expect(session1).toEqual({ scopes: new Set(['a']), expired: false });
    expect(session2).toEqual({ scopes: new Set(['a', 'b']), expired: false });
    expect(session3).toEqual({
      scopes: new Set(['a', 'b', 'c']),
      expired: false,
    });
    expect(session4).toEqual({
      scopes: new Set(['a', 'b', 'c']),
      expired: false,
    });
    expect(refreshSession).toHaveBeenCalledTimes(3);
  });

  it("should fall back to create a new session if refresh doesn't provide the correct scopes", async () => {
    const createSession = jest
      .fn()
      .mockResolvedValue({ scopes: new Set(['c']), expired: false });
    const refreshSession = jest
      .fn()
      .mockResolvedValue({ scopes: new Set(['b']), expired: false });
    const manager = new RefreshingAuthSessionManager({
      connector: { createSession, refreshSession },
      ...defaultOptions,
    } as any);

    const session = await manager.getSession({ scopes: new Set(['a']) });

    expect(session).toEqual({ scopes: new Set(['c']), expired: false });
    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(createSession).toHaveBeenCalledTimes(1);
  });

  it('should create a new session if refresh fails with existing expired session', async () => {
    const createSession = jest.fn();
    const refreshSession = jest.fn().mockRejectedValue(new Error('NOPE'));
    const manager = new RefreshingAuthSessionManager({
      connector: { createSession, refreshSession },
      ...defaultOptions,
    } as any);

    createSession.mockResolvedValue({
      scopes: new Set(['a']),
      expired: true,
    });
    await manager.getSession({ scopes: new Set(['a']) });
    expect(refreshSession).toHaveBeenCalledTimes(1);
    expect(createSession).toHaveBeenCalledTimes(1);

    await manager.getSession({ scopes: new Set(['a']) });
    // call refresh session only once
    expect(refreshSession).toHaveBeenCalledTimes(2);
    expect(createSession).toHaveBeenCalledTimes(2);
  });
});
