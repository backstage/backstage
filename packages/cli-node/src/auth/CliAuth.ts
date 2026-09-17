/*
 * Copyright 2025 The Backstage Authors
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
  type StoredInstance,
  getSelectedInstance,
  getInstanceMetadata,
  updateInstanceMetadata,
  updateInstance,
  accessTokenNeedsRefresh,
} from './storage';
import { getSecretStore, type SecretStore } from './secretStore';
import { getAuthInstanceService } from './authIdentifiers';
import { httpJson } from './httpJson';
import { z } from 'zod/v3';

const TokenResponseSchema = z.object({
  access_token: z.string().min(1),
  token_type: z.string().min(1),
  expires_in: z.number().positive().finite(),
  refresh_token: z.string().min(1).optional(),
});

/**
 * Options for creating a {@link CliAuth} instance.
 *
 * @public
 */
export interface CliAuthCreateOptions {
  /**
   * An explicit instance name to resolve. When omitted the currently
   * selected instance is used.
   */
  instanceName?: string;
}

/**
 * Manages authentication state for Backstage CLI commands.
 *
 * Reads the currently selected (or explicitly named) auth instance from
 * the on-disk instance store, transparently refreshes expired access
 * tokens, and exposes helpers that other CLI modules need to talk to a
 * Backstage backend.
 *
 * @public
 */
export class CliAuth {
  readonly #secretStore: SecretStore;
  #instance: StoredInstance;

  /**
   * Resolve the current auth instance and return a ready-to-use
   * {@link CliAuth} object. Throws when no instance can be found.
   */
  static async create(options?: CliAuthCreateOptions): Promise<CliAuth> {
    const instance = await getSelectedInstance(options?.instanceName);
    const secretStore = await getSecretStore();
    return new CliAuth(instance, secretStore);
  }

  private constructor(instance: StoredInstance, secretStore: SecretStore) {
    this.#instance = instance;
    this.#secretStore = secretStore;
  }

  /** Returns the name of the resolved auth instance. */
  getInstanceName(): string {
    return this.#instance.name;
  }

  /** Returns the base URL of the resolved auth instance. */
  getBaseUrl(): string {
    return this.#instance.baseUrl;
  }

  /**
   * Returns a valid access token, refreshing it first if the current
   * token is expired or about to expire.
   */
  async getAccessToken(): Promise<string> {
    if (accessTokenNeedsRefresh(this.#instance)) {
      await this.#refreshAccessToken();
    }

    const service = getAuthInstanceService(this.#instance.name);
    const token = await this.#secretStore.get(service, 'accessToken');
    if (!token) {
      throw new Error(
        'No access token found. Run "auth login" to authenticate.',
      );
    }
    return token;
  }

  /**
   * Reads a per-instance metadata value previously stored by the
   * auth module (e.g. `pluginSources`).
   */
  async getMetadata(key: string): Promise<unknown> {
    return getInstanceMetadata(this.#instance.name, key);
  }

  /**
   * Writes a per-instance metadata value to the on-disk instance store.
   */
  async setMetadata(key: string, value: unknown): Promise<void> {
    return updateInstanceMetadata(this.#instance.name, key, value);
  }

  async #refreshAccessToken(): Promise<void> {
    const service = getAuthInstanceService(this.#instance.name);
    const refreshToken =
      (await this.#secretStore.get(service, 'refreshToken')) ?? '';
    if (!refreshToken) {
      throw new Error(
        'Access token is expired and no refresh token is available',
      );
    }

    const response = await httpJson<unknown>(
      `${this.#instance.baseUrl}/api/auth/v1/token`,
      {
        method: 'POST',
        body: {
          grant_type: 'refresh_token',
          refresh_token: refreshToken,
        },
        signal: AbortSignal.timeout(30_000),
      },
    );

    const parsed = TokenResponseSchema.safeParse(response);
    if (!parsed.success) {
      throw new Error(`Invalid token response: ${parsed.error.message}`);
    }
    const token = parsed.data;

    await this.#secretStore.set(service, 'accessToken', token.access_token);
    if (token.refresh_token) {
      await this.#secretStore.set(service, 'refreshToken', token.refresh_token);
    }
    const issuedAt = Date.now();
    const accessTokenExpiresAt = Date.now() + token.expires_in * 1000;
    this.#instance = { ...this.#instance, issuedAt, accessTokenExpiresAt };
    await updateInstance(this.#instance.name, {
      issuedAt,
      accessTokenExpiresAt,
    });
  }
}
