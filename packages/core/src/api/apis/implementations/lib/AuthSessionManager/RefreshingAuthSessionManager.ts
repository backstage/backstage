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

import {
  SessionManager,
  SessionScopesFunc,
  SessionShouldRefreshFunc,
} from './types';
import { AuthConnector } from '../AuthConnector';
import { SessionScopeHelper } from './common';
import { hasScopes } from '../../OAuthRequestManager/OAuthPendingRequests';

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

  async getSession(options: {
    optional: false;
    scopes?: Set<string>;
  }): Promise<T>;
  async getSession(options: {
    optional?: boolean;
    scopes?: Set<string>;
  }): Promise<T | undefined>;
  async getSession(options: {
    optional?: boolean;
    scopes?: Set<string>;
  }): Promise<T | undefined> {
    if (
      this.helper.sessionExistsAndHasScope(this.currentSession, options.scopes)
    ) {
      const shouldRefresh = this.sessionShouldRefreshFunc(this.currentSession!);
      if (!shouldRefresh) {
        return this.currentSession!;
      }

      try {
        const refreshedSession = await this.collapsedSessionRefresh();
        const currentScopes = this.sessionScopesFunc(this.currentSession!);
        const refreshedScopes = this.sessionScopesFunc(refreshedSession);
        if (hasScopes(refreshedScopes, currentScopes)) {
          this.currentSession = refreshedSession;
        }
        return refreshedSession;
      } catch (error) {
        if (options.optional) {
          return undefined;
        }
        throw error;
      }
    }

    // The user may still have a valid refresh token in their cookies. Attempt to
    // initiate a fresh session through the backend using that refresh token.
    if (!this.currentSession) {
      try {
        const newSession = await this.collapsedSessionRefresh();
        this.currentSession = newSession;
        // The session might not have the scopes requested so go back and check again
        return this.getSession(options);
      } catch {
        // If the refresh attempt fails we assume we don't have a session, so continue to create one.
      }
    }

    // If we continue here we will show a popup, so exit if this is an optional session request.
    if (options.optional) {
      return undefined;
    }

    // We can call authRequester multiple times, the returned session will contain all requested scopes.
    this.currentSession = await this.connector.createSession(
      this.helper.getExtendedScope(this.currentSession, options.scopes),
    );
    return this.currentSession;
  }

  async removeSession() {
    await this.connector.removeSession();
    window.location.reload(); // TODO(Rugvip): make this work without reload?
  }

  private async collapsedSessionRefresh(): Promise<T> {
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.connector.refreshSession();

    try {
      return await this.refreshPromise;
    } finally {
      delete this.refreshPromise;
    }
  }
}
