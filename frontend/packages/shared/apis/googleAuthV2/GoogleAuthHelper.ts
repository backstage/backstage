import { urls } from 'shared/apis/baseUrls';
import { env } from 'shared/apis/env';
import { OAuthPendingRequestsApi } from 'shared/apis/oauth/OAuthPendingRequests';
import { CLIENT_ID_DEV, getClientId, getSlingshotInfo, SlingshotInfo } from './clientIds';
import { googleAuthPendingRequests } from './GoogleAuthPendingRequests';
import GoogleScopes from './GoogleScopes';
import MockAuthHelper from './MockAuthHelper';
import { GoogleSession } from './types';

const API_PATH = '/api/backend/auth';

type Options = {
  clientId: string;
  slingshotInfo?: SlingshotInfo;
  apiOrigin: string;
  dev: boolean;
  pendingRequests: OAuthPendingRequestsApi<GoogleSession>;
};

export type GoogleAuthResponse = {
  accessToken: string;
  idToken: string;
  scopes: string;
  expiresInSeconds: number;
};

export type AuthHelper = {
  refreshSession(optional?: false): Promise<GoogleSession>;
  refreshSession(optional: true): Promise<GoogleSession | undefined>;
  removeSession(): Promise<void>;
  createSession(scope: string): Promise<GoogleSession>;
  showPopup(scope: string): Promise<GoogleSession>;
};

class GoogleAuthHelper implements AuthHelper {
  static create() {
    const clientId = getClientId();
    const slingshotInfo = getSlingshotInfo();

    return new GoogleAuthHelper({
      clientId,
      slingshotInfo,
      apiOrigin: urls.openProxy,
      dev: clientId === CLIENT_ID_DEV,
      pendingRequests: googleAuthPendingRequests,
    });
  }

  constructor(private readonly options: Options) {}

  async refreshSession(optional?: false): Promise<GoogleSession>;
  async refreshSession(optional: true): Promise<GoogleSession | undefined>;
  async refreshSession(optional?: boolean): Promise<GoogleSession | undefined> {
    const res = await fetch(this.buildUrl('/token', { optional }), {
      headers: {
        'x-requested-with': 'XMLHttpRequest',
      },
      credentials: 'include',
    }).catch(error => {
      throw new Error(`Auth refresh request failed, ${error}`);
    });

    if (!res.ok) {
      const error: any = new Error(`Auth refresh request failed with status ${res.statusText}`);
      error.status = res.status;
      throw error;
    }

    const authInfo = await res.json();

    if (optional && authInfo.error) {
      return undefined;
    }
    return GoogleAuthHelper.convertAuthInfo(authInfo);
  }

  async removeSession(): Promise<void> {
    const res = await fetch(this.buildUrl('/logout'), {
      method: 'POST',
      headers: {
        'x-requested-with': 'XMLHttpRequest',
      },
      credentials: 'include',
    });

    if (!res.ok) {
      throw new Error(`Logout request failed with status ${res.status}`);
    }
  }

  async createSession(scope: string): Promise<GoogleSession> {
    return this.options.pendingRequests.request(GoogleScopes.from(scope));
  }

  async showPopup(scope: string): Promise<GoogleSession> {
    const { slingshotInfo } = this.options;
    const slingshot = slingshotInfo && `${slingshotInfo.id}:${slingshotInfo.site}`;

    const popupUrl = this.buildUrl('/start', { slingshot, scope });

    return new Promise((resolve, reject) => {
      const width = 450;
      const height = 730;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const popup = window.open(
        popupUrl,
        'google-login',
        `menubar=no,location=no,resizable=no,scrollbars=no,status=no,width=${width},height=${height},top=${top},left=${left}`,
      );

      if (!popup || typeof popup.closed === 'undefined' || popup.closed) {
        reject(new Error('Failed to open google login popup.'));
        return;
      }

      if (!env.isTest) {
        window.focus();
      }

      const messageListener = (event: MessageEvent) => {
        if (event.source !== popup) {
          return;
        }
        if (event.origin !== this.options.apiOrigin) {
          return;
        }
        const { data } = event;
        if (data.type !== 'oauth-result') {
          return;
        }

        if (data.payload.error) {
          const error = new Error(data.payload.error.message);
          error.name = data.payload.error.name;
          // TODO: proper error type
          // error.extra = data.payload.error.extra;
          reject(error);
        } else {
          resolve(GoogleAuthHelper.convertAuthInfo(data.payload));
        }
        done();
      };

      const done = () => {
        window.removeEventListener('message', messageListener);
        clearInterval(intervalId);
      };

      const intervalId = setInterval(() => {
        if (popup.closed) {
          const error = new Error('Google login failed, popup was closed');
          error.name = 'PopupClosedError';
          reject(error);
          done();
        }
      }, 100);

      window.addEventListener('message', messageListener);
    });
  }

  private buildUrl(path: string, query?: { [key: string]: string | boolean | undefined }): string {
    const queryString = this.buildQueryString({ ...query, dev: this.options.dev });

    return `${this.options.apiOrigin}${API_PATH}${path}${queryString}`;
  }

  private buildQueryString(query?: { [key: string]: string | boolean | undefined }): string {
    if (!query) {
      return '';
    }

    const queryString = Object.entries<string | boolean | undefined>(query)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        } else if (value) {
          return encodeURIComponent(key);
        } else {
          return undefined;
        }
      })
      .filter(Boolean)
      .join('&');

    if (!queryString) {
      return '';
    }
    return `?${queryString}`;
  }

  private static convertAuthInfo(authInfo: GoogleAuthResponse): GoogleSession {
    return {
      idToken: authInfo.idToken,
      accessToken: authInfo.accessToken,
      scopes: GoogleScopes.from(authInfo.scopes),
      expiresAt: new Date(Date.now() + authInfo.expiresInSeconds * 1000),
    };
  }
}

export const googleAuthHelper = env.isTest ? new MockAuthHelper() : GoogleAuthHelper.create();

export default GoogleAuthHelper;
