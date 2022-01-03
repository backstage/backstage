/*
 * Copyright 2021 The Backstage Authors
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
  BackstageUserIdentity,
  discoveryApiRef,
  errorApiRef,
  fetchApiRef,
  IdentityApi,
  ProfileInfo,
} from '@backstage/core-plugin-api';
import { ResponseError } from '@backstage/errors';
import { DelegatedSession, delegatedSessionSchema } from './types';

const DEFAULTS = {
  // How often we retry a failed auth refresh call
  retryRefreshFrequencyMillis: 5_000,
  // The amount of time between token refreshes, if we fail to get an actual
  // value out of the exp claim
  defaultTokenExpiryMillis: 30_000,
  // The amount of time before the actual expiry of the Backstage token, that we
  // shall start trying to get a new one
  tokenExpiryMarginMillis: 30_000,
};

// The amount of time to wait until trying to refresh the auth session
function tokenToExpiryMillis(token: string | undefined): number {
  if (typeof token !== 'string') {
    return DEFAULTS.retryRefreshFrequencyMillis;
  }

  const [_header, rawPayload, _signature] = token.split('.');
  const payload = JSON.parse(atob(rawPayload));
  const expiresInMillis = payload.exp * 1000 - Date.now();

  return Math.max(
    expiresInMillis - DEFAULTS.tokenExpiryMarginMillis,
    DEFAULTS.defaultTokenExpiryMillis,
  );
}

// Sleeps for a given duration, unless interrupted by signal
async function sleep(durationMillis: number, signal: AbortSignal) {
  if (!signal.aborted) {
    await new Promise<void>(resolve => {
      const timeoutHandle = setTimeout(done, durationMillis);
      signal.addEventListener('abort', done);
      function done() {
        clearTimeout(timeoutHandle);
        signal.removeEventListener('abort', done);
        resolve();
      }
    });
  }
}

type DelegatedSignInIdentityOptions = {
  provider: string;
  discoveryApi: typeof discoveryApiRef.T;
  fetchApi: typeof fetchApiRef.T;
  errorApi: typeof errorApiRef.T;
};

/**
 * An identity API that keeps itself up to date solely based on getting session
 * information from a `/refresh` endpoint.
 */
export class DelegatedSignInIdentity implements IdentityApi {
  private readonly options: DelegatedSignInIdentityOptions;
  private readonly abortController: AbortController;
  private session: DelegatedSession | undefined;

  constructor(options: DelegatedSignInIdentityOptions) {
    this.options = options;
    this.abortController = new AbortController();
    this.session = undefined;
  }

  async start() {
    // Try first refresh and bubble up any errors to the caller
    await this.refresh(false);

    let signalErrors = true;
    let pause: number;

    const refreshLoop = async () => {
      while (!this.abortController.signal.aborted) {
        try {
          await this.refresh(signalErrors);
          signalErrors = true;
          pause = tokenToExpiryMillis(this.session?.backstageIdentity.token);
        } catch {
          signalErrors = false; // Only signal first failure in a row
          pause = DEFAULTS.retryRefreshFrequencyMillis;
        }
        await sleep(pause, this.abortController.signal);
      }
    };

    refreshLoop();
  }

  /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.getUserId} */
  getUserId(): string {
    return this.getSession().backstageIdentity.id;
  }

  /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.getIdToken} */
  async getIdToken(): Promise<string | undefined> {
    return this.getSession().backstageIdentity.token;
  }

  /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.getProfile} */
  getProfile(): ProfileInfo {
    return this.getSession().profile;
  }

  /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.getProfileInfo} */
  async getProfileInfo(): Promise<ProfileInfo> {
    return this.getSession().profile;
  }

  /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.getBackstageIdentity} */
  async getBackstageIdentity(): Promise<BackstageUserIdentity> {
    return this.getSession().backstageIdentity.identity;
  }

  /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.getCredentials} */
  async getCredentials(): Promise<{ token?: string | undefined }> {
    return { token: this.getSession().backstageIdentity.token };
  }

  /** {@inheritdoc @backstage/core-plugin-api#IdentityApi.signOut} */
  async signOut(): Promise<void> {
    this.abortController.abort();
  }

  getSession(): DelegatedSession {
    if (!this.session) {
      throw new Error('No session available');
    }
    return this.session;
  }

  async refresh(notifyErrors: boolean) {
    try {
      const baseUrl = await this.options.discoveryApi.getBaseUrl('auth');

      const response = await this.options.fetchApi.fetch(
        `${baseUrl}/${this.options.provider}/refresh`,
        {
          signal: this.abortController.signal,
          headers: { 'x-requested-with': 'XMLHttpRequest' },
          credentials: 'include',
        },
      );

      if (!response.ok) {
        throw await ResponseError.fromResponse(response);
      }

      const session = delegatedSessionSchema.parse(await response.json());
      this.session = session;
    } catch (e) {
      if (this.abortController.signal.aborted) {
        return;
      }

      if (notifyErrors) {
        this.options.errorApi.post(
          new Error(
            `Failed to refresh browser session, ${e}. Try reloading your browser page.`,
          ),
        );
      }

      throw e;
    }
  }
}
