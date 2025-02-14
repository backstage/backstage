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

import {
  SessionManager,
  SessionScopesFunc,
  SessionShouldRefreshFunc,
  GetSessionOptions,
} from './types';
import { AuthConnector } from '../AuthConnector';
import { SessionScopeHelper, hasScopes } from './common';
import { SessionStateTracker } from './SessionStateTracker';

type Options<T> = {
  /** The connector used for acting on the auth session */
  connector: AuthConnector<T>;
  /** Used to get the scope of the session */
  sessionScopes: SessionScopesFunc<T>;
  /** Used to check if the session needs to be refreshed */
  sessionShouldRefresh: SessionShouldRefreshFunc<T>;
  /** The default scopes that should always be present in a session, defaults to none. */
  defaultScopes?: Set<string>;
};

/**
 * RefreshingAuthSessionManager manages an underlying session that has
 * and expiration time and needs to be refreshed periodically.
 */
export class RefreshingAuthSessionManager<T> implements SessionManager<T> {
  private readonly connector: AuthConnector<T>;
  private readonly helper: SessionScopeHelper<T>;
  private readonly sessionScopesFunc: SessionScopesFunc<T>;
  private readonly sessionShouldRefreshFunc: SessionShouldRefreshFunc<T>;
  private readonly stateTracker = new SessionStateTracker();

  private refreshPromise?: Promise<T>;
  private currentSession: T | undefined;

  constructor(options: Options<T>) {
    const {
      connector,
      defaultScopes = new Set(),
      sessionScopes,
      sessionShouldRefresh,
    } = options;

    this.connector = connector;
    this.sessionScopesFunc = sessionScopes;
    this.sessionShouldRefreshFunc = sessionShouldRefresh;
    this.helper = new SessionScopeHelper({ sessionScopes, defaultScopes });
  }

  async getSession(options: GetSessionOptions): Promise<T | undefined> {
    let alreadyTriedToRefreshSession = false;
    if (
      this.helper.sessionExistsAndHasScope(this.currentSession, options.scopes)
    ) {
      const shouldRefresh = this.sessionShouldRefreshFunc(this.currentSession!);
      if (!shouldRefresh) {
        return this.currentSession!;
      }

      alreadyTriedToRefreshSession = true;

      try {
        const refreshedSession = await this.collapsedSessionRefresh(
          options.scopes,
        );
        const currentScopes = this.sessionScopesFunc(this.currentSession!);
        const refreshedScopes = this.sessionScopesFunc(refreshedSession);
        if (hasScopes(refreshedScopes, currentScopes)) {
          this.currentSession = refreshedSession;
        }
        return refreshedSession;
      } catch (error) {
        this.removeLocalSession();

        if (options.optional) {
          return undefined;
        }
        // If the refresh attempt fails we assume we don't have a session, so continue to create one
      }
    }

    // The user may still have a valid refresh token in their cookies. Attempt to
    // initiate a fresh session through the backend using that refresh token.
    //
    // We can still try to refresh even if client requested instant popup.
    // With instant popup option, the client is responsible for providing the user login prompt modal window.
    // If control flow executes this code and client requested instant popup, it means that
    // must have clicked sign in on the login prompt. The browser allows asynchronous code to open a popup
    // if it is caused by a user interaction, clicking on a sign-in button, for example.
    if (!alreadyTriedToRefreshSession) {
      try {
        const newSession = await this.collapsedSessionRefresh(options.scopes);
        this.currentSession = newSession;
        // The session might not have the scopes requested so go back and check again
        return this.getSession(options);
      } catch {
        this.removeLocalSession();
        // If the refresh attempt fails we assume we don't have a session, so continue to create one.
      }
    }

    // If we continue here we will show a popup, so exit if this is an optional session request.
    if (options.optional) {
      return undefined;
    }

    // We can call authRequester multiple times, the returned session will contain all requested scopes.
    this.currentSession = await this.connector.createSession({
      ...options,
      scopes: this.helper.getExtendedScope(this.currentSession, options.scopes),
    });
    this.stateTracker.setIsSignedIn(true);
    return this.currentSession;
  }

  /**
   * Sets `undefined` to this.{@link currentSession} and tells this.{@link stateTracker}, session state tracker,
   * that a user has signed out.
   *
   * Does not propagate session removal to the connector like {@link removeSession}().
   *
   */
  removeLocalSession() {
    this.currentSession = undefined;
    this.stateTracker.setIsSignedIn(false);
  }

  async removeSession() {
    this.currentSession = undefined;
    await this.connector.removeSession();
    this.stateTracker.setIsSignedIn(false);
  }

  sessionState$() {
    return this.stateTracker.sessionState$();
  }

  private async collapsedSessionRefresh(scopes?: Set<string>): Promise<T> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.connector.refreshSession(
      this.helper.getExtendedScope(this.currentSession, scopes),
    );

    try {
      const session = await this.refreshPromise;
      if (!this.helper.sessionExistsAndHasScope(session, scopes)) {
        throw new Error(
          'Refreshed session did not receive the required scopes',
        );
      }
      this.stateTracker.setIsSignedIn(true);
      return session;
    } finally {
      delete this.refreshPromise;
    }
  }
}
