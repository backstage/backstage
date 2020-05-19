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

import GoogleIcon from '@material-ui/icons/AcUnit';
import { AuthHelper } from '../../lib/AuthHelper';
import GoogleScopes from './GoogleScopes';
import { GoogleSession } from './types';
import { OAuthScopes } from '../../..';
import {
  OAuthApi,
  OpenIdConnectApi,
  IdTokenOptions,
} from '../../../definitions/auth';
import { OAuthRequestApi } from '../../../definitions';
import { GenericAuthHelper } from '../../lib/AuthHelper/AuthHelper';

export type GoogleAuthResponse = {
  accessToken: string;
  idToken: string;
  scopes: string;
  expiresInSeconds: number;
};

class GoogleAuth implements OAuthApi, OpenIdConnectApi {
  private currentSession: GoogleSession | undefined;

  static create(oauthRequestApi: OAuthRequestApi) {
    const helper = new AuthHelper({
      providerPath: 'google/',
      environment: 'dev',
      provider: {
        title: 'Google',
        icon: GoogleIcon,
      },
      oauthRequestApi: oauthRequestApi,
      sessionTransform(res: GoogleAuthResponse): GoogleSession {
        return {
          idToken: res.idToken,
          accessToken: res.accessToken,
          scopes: GoogleScopes.from(res.scopes),
          expiresAt: new Date(Date.now() + res.expiresInSeconds * 1000),
        };
      },
    });

    return new GoogleAuth(helper);
  }

  constructor(private readonly helper: GenericAuthHelper<GoogleSession>) {}

  async getAccessToken(scope?: string | string[]) {
    const session = await this.getSession({ optional: false, scope });
    return session.accessToken;
  }

  async getIdToken({ optional }: IdTokenOptions = {}) {
    const session = await this.getSession({ optional: optional || false });
    if (session) {
      return session.idToken;
    }
    return '';
  }

  async getSession(options: {
    optional: false;
    scope?: string | string[];
  }): Promise<GoogleSession>;
  async getSession(options: {
    optional?: boolean;
    scope?: string | string[];
  }): Promise<GoogleSession | undefined>;
  async getSession(options: {
    optional?: boolean;
    scope?: string | string[];
  }): Promise<GoogleSession | undefined> {
    if (this.sessionExistsAndHasScope(this.currentSession, options.scope)) {
      if (!this.sessionWillExpire(this.currentSession!)) {
        return this.currentSession!;
      }

      try {
        const refreshedSession = await this.helper.refreshSession();
        if (refreshedSession.scopes.hasScopes(this.currentSession!.scopes)) {
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
        const newSession = await this.helper.refreshSession();
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

  async logout() {
    await this.helper.removeSession();
    window.location.reload();
  }

  private sessionExistsAndHasScope(
    session: GoogleSession | undefined,
    scope?: string | string[],
  ): boolean {
    if (!session) {
      return false;
    }
    if (!scope) {
      return true;
    }
    return session.scopes.hasScopes(scope);
  }

  private sessionWillExpire(session: GoogleSession) {
    const expiresInSec = (session.expiresAt.getTime() - Date.now()) / 1000;
    return expiresInSec < 60 * 5;
  }

  private getExtendedScope(scope?: string | string[]) {
    let newScope: OAuthScopes = GoogleScopes.default();
    if (this.currentSession) {
      newScope = this.currentSession.scopes;
    }
    if (scope) {
      newScope = newScope.extend(scope);
    }
    return newScope;
  }
}
export default GoogleAuth;
