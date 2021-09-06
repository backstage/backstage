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
import {
  SessionManager,
  MutableSessionManager,
  GetSessionOptions,
} from './types';
import { SessionStateTracker } from './SessionStateTracker';

type Options<T> = {
  /**
   * A callback that is called to determine whether a given session supports refresh
   */
  sessionCanRefresh: (session: T) => boolean;

  /**
   * The session manager that is used if the a session does not support refresh.
   */
  staticSessionManager: MutableSessionManager<T>;

  /**
   * The session manager that is used if the a session supports refresh.
   */
  refreshingSessionManager: SessionManager<T>;
};

/**
 * OptionalRefreshSessionManagerMux wraps two different session managers, one for
 * static session storage and another one that supports refresh. For each session
 * that is retrieved is checked for whether it supports refresh. If it does, the
 * refreshing session manager is used, otherwise the static session manager is used.
 */
export class OptionalRefreshSessionManagerMux<T> implements SessionManager<T> {
  private readonly stateTracker = new SessionStateTracker();

  private readonly sessionCanRefresh: (session: T) => boolean;
  private readonly staticSessionManager: MutableSessionManager<T>;
  private readonly refreshingSessionManager: SessionManager<T>;

  constructor(options: Options<T>) {
    this.sessionCanRefresh = options.sessionCanRefresh;
    this.staticSessionManager = options.staticSessionManager;
    this.refreshingSessionManager = options.refreshingSessionManager;
  }

  async getSession(options: GetSessionOptions): Promise<T | undefined> {
    // First we check if there is an existing static session, using an optional request
    const staticSession = await this.staticSessionManager.getSession({
      ...options,
      optional: true,
    });
    if (staticSession) {
      this.stateTracker.setIsSignedIn(true);
      return staticSession;
    }

    // If there is no static session available, we ask the refresh manager to get a session
    const session = await this.refreshingSessionManager.getSession(options);

    // Handling the case where the session request is optional
    if (!session) {
      this.stateTracker.setIsSignedIn(false);
      return undefined;
    }

    // Next we check if the session we received from the refreshing manager can actually
    // be refreshed. If it can, we use this session without storing it in the static manager.
    if (this.sessionCanRefresh(session)) {
      this.stateTracker.setIsSignedIn(true);
      return session;
    }

    // If the session can't be refreshed, we store it in the static manager
    this.staticSessionManager.setSession(session);
    this.stateTracker.setIsSignedIn(true);
    return session;
  }

  async removeSession(): Promise<void> {
    await Promise.all([
      this.refreshingSessionManager.removeSession(),
      this.staticSessionManager.removeSession(),
    ]);
    this.stateTracker.setIsSignedIn(false);
  }

  sessionState$(): Observable<SessionState> {
    return this.stateTracker.sessionState$();
  }
}
