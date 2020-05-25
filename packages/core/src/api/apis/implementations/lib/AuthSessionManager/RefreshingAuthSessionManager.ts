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

import { hasScopes } from '../../OAuthRequestManager/OAuthPendingRequests';
import { SessionManager } from './types';
import { AuthConnector } from '../AuthConnector';

type Options<AuthSession> = {
  /**
   * The connector used for acting on the auth session.
   */
  connector: AuthConnector<AuthSession>;
  /**
   * A function called to determine the scopes of the session.
   */
  sessionScopes: (session: AuthSession) => Set<string>;
  /**
   * A function called to determine whether it's time for a session to refresh.
   *
   * This should return true before the session expires, for example, if a session
   * expires after 60 minutes, you could return true if the session is older than 45 minutes.
   */
  sessionShouldRefresh: (session: AuthSession) => boolean;
  /**
   * The default scopes that should always be present in a session, defaults to none.
   */
  defaultScopes?: Set<string>;
};

/**
 * RefreshingAuthSessionManager manages an underlying session that has
 * and expiration time and needs to be refreshed periodically.
 */
export class RefreshingAuthSessionManager<AuthSession>
  implements SessionManager<AuthSession> {
  private readonly connector: AuthConnector<AuthSession>;
  private readonly defaultScopes?: Set<string>;
  private readonly sessionScopesFunc: (session: AuthSession) => Set<string>;
  private readonly sessionShouldRefreshFunc: (session: AuthSession) => boolean;

  private refreshPromise?: Promise<AuthSession>;
  private currentSession: AuthSession | undefined;

  constructor(options: Options<AuthSession>) {
    const {
      connector,
      defaultScopes = new Set(),
      sessionScopes,
      sessionShouldRefresh,
    } = options;

    this.connector = connector;
    this.defaultScopes = defaultScopes;
    this.sessionScopesFunc = sessionScopes;
    this.sessionShouldRefreshFunc = sessionShouldRefresh;
  }

  async getSession(options: {
    optional: false;
    scopes?: Set<string>;
  }): Promise<AuthSession>;
  async getSession(options: {
    optional?: boolean;
    scopes?: Set<string>;
  }): Promise<AuthSession | undefined>;
  async getSession(options: {
    optional?: boolean;
    scopes?: Set<string>;
  }): Promise<AuthSession | undefined> {
    if (this.sessionExistsAndHasScope(this.currentSession, options.scopes)) {
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
        // If the refresh attemp fails we assume we don't have a session, so continue to create one.
      }
    }

    // If we continue here we will show a popup, so exit if this is an optional session request.
    if (options.optional) {
      return undefined;
    }

    // We can call authRequester multiple times, the returned session will contain all requested scopes.
    this.currentSession = await this.connector.createSession(
      this.getExtendedScope(options.scopes),
    );
    return this.currentSession;
  }

  async removeSession() {
    await this.connector.removeSession();
    window.location.reload(); // TODO(Rugvip): make this work without reload?
  }

  private sessionExistsAndHasScope(
    session: AuthSession | undefined,
    scopes?: Set<string>,
  ): boolean {
    if (!session) {
      return false;
    }
    if (!scopes) {
      return true;
    }
    const sessionScopes = this.sessionScopesFunc(session);
    return hasScopes(sessionScopes, scopes);
  }

  private getExtendedScope(scopes?: Set<string>) {
    const newScope = new Set(this.defaultScopes);
    if (this.currentSession) {
      const sessionScopes = this.sessionScopesFunc(this.currentSession);
      for (const scope of sessionScopes) {
        newScope.add(scope);
      }
    }
    if (scopes) {
      for (const scope of scopes) {
        newScope.add(scope);
      }
    }
    return newScope;
  }

  private async collapsedSessionRefresh(): Promise<AuthSession> {
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
