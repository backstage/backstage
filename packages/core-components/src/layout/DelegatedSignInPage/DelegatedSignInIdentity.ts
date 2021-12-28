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

type DelegatedSignInIdentityOptions = {
  provider: string;
  refreshFrequencyMillis: number;
  retryRefreshFrequencyMillis: number;
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
    await this.refresh(false);

    let signalErrors = true;
    const refreshLoop = async () => {
      if (!this.abortController.signal.aborted) {
        try {
          await this.refresh(signalErrors);
          signalErrors = true;
          setTimeout(refreshLoop, this.options.refreshFrequencyMillis);
        } catch {
          signalErrors = false;
          setTimeout(refreshLoop, this.options.retryRefreshFrequencyMillis);
        }
      }
    };

    setTimeout(refreshLoop, this.options.refreshFrequencyMillis);
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
