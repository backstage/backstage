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

import { Observable, SessionState } from '@backstage/core-plugin-api';
import { OptionalRefreshSessionManagerMux } from './OptionalRefreshSessionManagerMux';
import { MutableSessionManager, SessionManager } from './types';

class MockManager implements MutableSessionManager<string> {
  constructor(public session?: string) {}

  setSession(session: string | undefined): void {
    this.session = session;
  }
  async getSession(): Promise<string | undefined> {
    return this.session;
  }
  async removeSession(): Promise<void> {
    delete this.session;
  }
  sessionState$(): Observable<SessionState> {
    throw new Error('Method not implemented.');
  }
}

function trackState(manager: SessionManager<any>) {
  const states = new Array<boolean>();
  manager
    .sessionState$()
    .subscribe(state => states.push(state === SessionState.SignedIn));
  return states;
}

describe('OptionalRefreshSessionManagerMux', () => {
  it('finds no session', async () => {
    const mux = new OptionalRefreshSessionManagerMux({
      staticSessionManager: new MockManager(),
      refreshingSessionManager: new MockManager(),
      sessionCanRefresh: () => false,
    });

    const states = trackState(mux);
    await expect(mux.getSession({})).resolves.toBe(undefined);
    expect(states).toEqual([false]);
  });

  it('prioritizes a static session', async () => {
    const mux = new OptionalRefreshSessionManagerMux({
      staticSessionManager: new MockManager('static'),
      refreshingSessionManager: new MockManager('refreshing'),
      sessionCanRefresh: () => false,
    });

    const states = trackState(mux);
    await expect(mux.getSession({})).resolves.toBe('static');
    expect(states).toEqual([false, true]);
  });

  it('transfers a refreshing session to the static manager', async () => {
    const staticSessionManager = new MockManager();
    const refreshingSessionManager = new MockManager('refreshing');
    const mux = new OptionalRefreshSessionManagerMux({
      staticSessionManager,
      refreshingSessionManager,
      sessionCanRefresh: () => false,
    });

    const states = trackState(mux);
    expect(staticSessionManager.session).toBeUndefined();
    await expect(mux.getSession({})).resolves.toBe('refreshing');
    expect(staticSessionManager.session).toBe('refreshing');
    expect(states).toEqual([false, true]);
  });

  it('relies on the refreshing manager if refresh is available', async () => {
    const staticSessionManager = new MockManager();
    const refreshingSessionManager = new MockManager('refreshing');
    const mux = new OptionalRefreshSessionManagerMux({
      staticSessionManager,
      refreshingSessionManager,
      sessionCanRefresh: () => true,
    });

    const states = trackState(mux);
    await expect(mux.getSession({})).resolves.toBe('refreshing');
    expect(staticSessionManager.session).toBeUndefined();
    expect(states).toEqual([false, true]);
  });

  it('can switch between refreshing and static sessions', async () => {
    let canRefresh = true;
    const staticSessionManager = new MockManager();
    const refreshingSessionManager = new MockManager('refreshing');
    const mux = new OptionalRefreshSessionManagerMux({
      staticSessionManager,
      refreshingSessionManager,
      sessionCanRefresh: () => canRefresh,
    });

    const states = trackState(mux);
    await expect(mux.getSession({})).resolves.toBe('refreshing');
    expect(staticSessionManager.session).toBeUndefined();
    canRefresh = false;
    await expect(mux.getSession({})).resolves.toBe('refreshing');
    expect(staticSessionManager.session).toBe('refreshing');

    expect(states).toEqual([false, true]);
  });

  it('removes sessions from both managers', async () => {
    const staticSessionManager = new MockManager('static');
    const refreshingSessionManager = new MockManager('refreshing');
    const mux = new OptionalRefreshSessionManagerMux({
      staticSessionManager,
      refreshingSessionManager,
      sessionCanRefresh: () => true,
    });

    const states = trackState(mux);
    await expect(mux.getSession({})).resolves.toBe('static');
    await mux.removeSession();
    expect(staticSessionManager.session).toBeUndefined();
    expect(refreshingSessionManager.session).toBeUndefined();
    expect(states).toEqual([false, true, false]);
  });
});
