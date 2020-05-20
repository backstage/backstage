/*
 * Copyright 2020 Spotify AB
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

const theFuture = new Date(Date.now() + 3600000);
const thePast = new Date(Date.now() - 10);

describe('RefreshingAuthSessionManager', () => {
  it('should save result form createSession', async () => {
    const createSession = jest.fn().mockResolvedValue({ expiresAt: theFuture });
    const refreshSession = jest.fn().mockRejectedValue(new Error('NOPE'));
    const manager = new RefreshingAuthSessionManager({
      helper: { createSession, refreshSession },
    } as any);

    await manager.getSession({});
    expect(createSession).toBeCalledTimes(1);

    await manager.getSession({});
    expect(createSession).toBeCalledTimes(1);

    expect(refreshSession).toBeCalledTimes(1);
  });

  it('should ask consent only if scopes have changed', async () => {
    const createSession = jest.fn();
    const refreshSession = jest.fn().mockRejectedValue(new Error('NOPE'));
    const manager = new RefreshingAuthSessionManager({
      helper: { createSession, refreshSession },
    } as any);

    createSession.mockResolvedValue({
      scopes: new Set(['a']),
      expiresAt: theFuture,
    });
    await manager.getSession({ scope: new Set(['a']) });
    expect(createSession).toBeCalledTimes(1);

    await manager.getSession({ scope: new Set(['a']) });
    expect(createSession).toBeCalledTimes(1);

    await manager.getSession({ scope: new Set(['b']) });
    expect(createSession).toBeCalledTimes(2);
  });

  it('should check for session expiry', async () => {
    const createSession = jest.fn();
    const refreshSession = jest
      .fn()
      .mockRejectedValueOnce(new Error('NOPE'))
      .mockResolvedValue({ scopes: new Set(['a']) });
    const manager = new RefreshingAuthSessionManager({
      helper: { createSession, refreshSession },
    } as any);

    createSession.mockResolvedValue({
      scopes: new Set(['a']),
      expiresAt: thePast,
    });

    await manager.getSession({ scope: new Set(['a']) });
    expect(createSession).toBeCalledTimes(1);
    expect(refreshSession).toBeCalledTimes(1);

    await manager.getSession({ scope: new Set(['a']) });
    expect(createSession).toBeCalledTimes(1);
    expect(refreshSession).toBeCalledTimes(2);
  });

  it('should handle user closed popup', async () => {
    const createSession = jest.fn();
    const refreshSession = jest.fn().mockRejectedValue(new Error('NOPE'));
    const manager = new RefreshingAuthSessionManager({
      helper: { createSession, refreshSession },
    } as any);

    createSession.mockRejectedValueOnce(new Error('some error'));
    await expect(manager.getSession({ scope: new Set(['a']) })).rejects.toThrow(
      'some error',
    );
  });

  it('should not get optional session', async () => {
    const createSession = jest.fn();
    const refreshSession = jest.fn().mockRejectedValue(new Error('NOPE'));
    const manager = new RefreshingAuthSessionManager({
      helper: { createSession, refreshSession },
    } as any);

    expect(await manager.getSession({ optional: true })).toBe(undefined);
    expect(createSession).toBeCalledTimes(0);
    expect(refreshSession).toBeCalledTimes(1);
  });

  it('should remove session and reload', async () => {
    // This is a workaround that is used by Facebook and the Jest core team
    // It is a limitation with the newest versions of JSDOM, and newer browser standards
    // where window.location and all of its properties are read-only. So we re-construct it!
    // See https://github.com/facebook/jest/issues/890#issuecomment-209698782
    const location = { ...window.location };
    delete window.location;
    window.location = location;
    jest.spyOn(window.location, 'reload').mockImplementation();

    const removeSession = jest.fn();
    const manager = new RefreshingAuthSessionManager({
      helper: { removeSession },
    } as any);

    await manager.removeSession();
    expect(window.location.reload).toHaveBeenCalled();
    expect(removeSession).toHaveBeenCalled();
  });
});
