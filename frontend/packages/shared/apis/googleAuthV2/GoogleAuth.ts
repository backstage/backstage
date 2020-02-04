import Api from 'shared/pluginApi/Api';
import { OAuthScopes } from '../oauth/types';
import { AuthHelper, googleAuthHelper } from './GoogleAuthHelper';
import GoogleScopes from './GoogleScopes';
import { GoogleAuthApi, GoogleSession, IdTokenOptions } from './types';

class GoogleAuth implements GoogleAuthApi {
  private currentSession: GoogleSession | undefined;
  private newSessionPromise: Promise<GoogleSession | undefined> | undefined;

  constructor(private readonly helper: AuthHelper) {}

  async getAccessToken(scope?: string | string[]) {
    const session = await this.getSession({ optional: false, scope });
    return session.accessToken;
  }

  async getIdToken({ optional }: IdTokenOptions = {}) {
    const session = await this.getSession({ optional: optional || false });
    if (session) {
      return session.idToken;
    } else {
      return '';
    }
  }

  async getSession(options: { optional: false; scope?: string | string[] }): Promise<GoogleSession>;
  async getSession(options: { optional?: boolean; scope?: string | string[] }): Promise<GoogleSession | undefined>;
  async getSession(options: { optional?: boolean; scope?: string | string[] }): Promise<GoogleSession | undefined> {
    if (this.sessionExistsAndHasScope(this.currentSession, options.scope)) {
      if (!this.sessionWillExpire(this.currentSession!)) {
        return this.currentSession!;
      }

      // Is a session refresh already in progress? If so, at this point we know that
      // that refresh was for a set of scopes that is at least as large as what we need.
      // So just return that ongoing refresh promise, it'll suffice for the user's needs.
      while (this.newSessionPromise) {
        const newSession = await this.newSessionPromise;
        if (newSession) {
          return newSession;
        }
      }

      this.newSessionPromise = this.helper.refreshSession();
      try {
        const newSession = await this.newSessionPromise;
        this.currentSession = newSession;
        return newSession;
      } finally {
        this.newSessionPromise = undefined;
      }
    }

    if (this.newSessionPromise) {
      try {
        await this.newSessionPromise;
      } catch (error) {
        if (error.name === 'RejectedError') {
          throw error;
        }
      }
      return this.getSession(options);
    }

    // The user may still have a valid refresh token in their cookies. Attempt to
    // initiate a fresh session through the backend using that refresh token.
    if (!this.currentSession) {
      try {
        // This is an "optional" session request, meaning it will return undefined if we don't have a session.
        this.newSessionPromise = this.helper.refreshSession(true);
        try {
          const newSession = await this.newSessionPromise;
          this.currentSession = newSession;
        } finally {
          this.newSessionPromise = undefined;
        }
      } catch (error) {
        throw new Error(`Initial session request failed, ${error}`);
      }

      // We may not have received a session in the above request, and missing session won't throw
      if (this.currentSession) {
        // The session might not have the scopes requested so go back and check again
        return this.getSession(options);
      }

      // If we continue here we will show a popup, so exit if this is an optional session request.
      if (options.optional) {
        return;
      }
    }

    this.newSessionPromise = this.helper.createSession(this.getExtendedScope(options.scope));
    try {
      const newSession = await this.newSessionPromise;
      this.currentSession = newSession;
      return newSession;
    } finally {
      this.newSessionPromise = undefined;
    }
  }

  async logout() {
    await this.helper.removeSession();
    window.location.reload();
  }

  private sessionExistsAndHasScope(session: GoogleSession | undefined, scope?: string | string[]): boolean {
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
    return newScope.toString();
  }
}

export const googleAuthApiToken = new Api<GoogleAuthApi>({
  id: 'googleAuth',
  title: 'Google Auth',
  description: 'Provides Google tokens and manages a Google session',
});

export const googleAuth = new GoogleAuth(googleAuthHelper);

export default GoogleAuth;
