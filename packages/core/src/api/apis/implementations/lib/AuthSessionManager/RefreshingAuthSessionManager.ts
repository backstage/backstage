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
import { BaseAuthSession, GenericAuthHelper } from '../AuthHelper';

type Options<AuthSession extends BaseAuthSession> = {
  helper: GenericAuthHelper<AuthSession>;
  defaultScopes?: Set<string>;
};

/**
 * RefreshingAuthSessionManager manages an underlying session that has
 * and expiration time and needs to be refreshed periodically.
 */
export class RefreshingAuthSessionManager<AuthSession extends BaseAuthSession>
  implements SessionManager<AuthSession> {
  private readonly helper: GenericAuthHelper<AuthSession>;
  private readonly defaultScopes?: Set<string>;

  private refreshPromise?: Promise<AuthSession>;
  private currentSession: AuthSession | undefined;

  constructor(options: Options<AuthSession>) {
    const { helper, defaultScopes = new Set() } = options;

    this.helper = helper;
    this.defaultScopes = defaultScopes;
  }

  async getSession(options: {
    optional: false;
    scope?: Set<string>;
  }): Promise<AuthSession>;
  async getSession(options: {
    optional?: boolean;
    scope?: Set<string>;
  }): Promise<AuthSession | undefined>;
  async getSession(options: {
    optional?: boolean;
    scope?: Set<string>;
  }): Promise<AuthSession | undefined> {
    if (this.sessionExistsAndHasScope(this.currentSession, options.scope)) {
      if (!this.sessionWillExpire(this.currentSession!)) {
        return this.currentSession!;
      }

      try {
        const refreshedSession = await this.collapsedSessionRefresh();
        if (hasScopes(refreshedSession.scopes, this.currentSession!.scopes)) {
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
    this.currentSession = await this.helper.createSession(
      this.getExtendedScope(options.scope),
    );
    return this.currentSession;
  }

  async removeSession() {
    await this.helper.removeSession();
    window.location.reload(); // TODO(Rugvip): make this work without reload?
  }

  private sessionExistsAndHasScope(
    session: AuthSession | undefined,
    scope?: Set<string>,
  ): boolean {
    if (!session) {
      return false;
    }
    if (!scope) {
      return true;
    }
    return hasScopes(session.scopes, scope);
  }

  private sessionWillExpire(session: AuthSession) {
    const expiresInSec = (session.expiresAt.getTime() - Date.now()) / 1000;
    return expiresInSec < 60 * 5;
  }

  private getExtendedScope(scopes?: Set<string>) {
    const newScope = new Set(this.defaultScopes);
    if (this.currentSession) {
      for (const scope of this.currentSession.scopes) {
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

    this.refreshPromise = this.helper.refreshSession();

    try {
      return await this.refreshPromise;
    } finally {
      delete this.refreshPromise;
    }
  }
}
