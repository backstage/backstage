/*
 * Copyright 2026 The Backstage Authors
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
  DiscoveryApi,
  FetchApi,
  IdentityApi,
} from '@backstage/core-plugin-api';
import { StarredEntitiesApi } from '@backstage/plugin-catalog-react';
import { Observable } from '@backstage/types';
import ObservableImpl from 'zen-observable';
import { ResponseError } from '@backstage/errors';
import { CatalogStarsApi } from './CatalogStarsApi';

/**
 * Options for creating a DatabaseStarredEntitiesApi
 * @public
 */
export interface DatabaseStarredEntitiesApiOptions {
  discoveryApi: DiscoveryApi;
  fetchApi: FetchApi;
  identityApi: IdentityApi;
}

/**
 * A database-backed implementation of the StarredEntitiesApi and CatalogStarsApi.
 *
 * @public
 */
export class DatabaseStarredEntitiesApi
  implements StarredEntitiesApi, CatalogStarsApi
{
  private readonly discoveryApi: DiscoveryApi;
  private readonly fetchApi: FetchApi;
  private readonly identityApi: IdentityApi;

  private starredEntities: Set<string>;
  private initializationPromise: Promise<void> | undefined;

  private readonly subscribers = new Set<
    ZenObservable.SubscriptionObserver<Set<string>>
  >();

  private readonly observable = new ObservableImpl<Set<string>>(subscriber => {
    subscriber.next(new Set(this.starredEntities));

    this.subscribers.add(subscriber);
    return () => {
      this.subscribers.delete(subscriber);
    };
  });

  constructor(options: DatabaseStarredEntitiesApiOptions) {
    this.discoveryApi = options.discoveryApi;
    this.fetchApi = options.fetchApi;
    this.identityApi = options.identityApi;
    this.starredEntities = new Set<string>();

    // Fire off initialization
    this.initializationPromise = this.initialize();
  }

  private async initialize(): Promise<void> {
    try {
      const baseUrl = await this.discoveryApi.getBaseUrl('catalog');
      const { fetch } = this.fetchApi;
      const { token } = await this.identityApi.getCredentials();

      const headers: Record<string, string> = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(`${baseUrl}/starred-entities`, { headers });
      if (!response.ok) {
        throw await ResponseError.fromResponse(response);
      }

      const data = await response.json();
      if (data && Array.isArray(data.items)) {
        this.starredEntities = new Set(data.items);
        this.notifyChanges();
      }
    } catch (error) {
      // Intentionally ignoring failure to fetch during init
      // We will fall back to an empty set and let subsequent actions happen
      // eslint-disable-next-line no-console
      console.warn('Failed to load starred entities from database', error);
    }
  }

  async toggleStarred(entityRef: string): Promise<void> {
    // Ensure we are initialized before mutating
    await this.initializationPromise;

    const baseUrl = await this.discoveryApi.getBaseUrl('catalog');
    const { fetch } = this.fetchApi;
    const { token } = await this.identityApi.getCredentials();

    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const isStarred = this.starredEntities.has(entityRef);

    if (isStarred) {
      const response = await fetch(
        `${baseUrl}/starred-entities/${encodeURIComponent(entityRef)}`,
        {
          method: 'DELETE',
          headers,
        },
      );

      if (!response.ok) {
        throw await ResponseError.fromResponse(response);
      }

      this.starredEntities.delete(entityRef);
    } else {
      const response = await fetch(
        `${baseUrl}/starred-entities/${encodeURIComponent(entityRef)}`,
        {
          method: 'PUT',
          headers,
        },
      );

      if (!response.ok) {
        throw await ResponseError.fromResponse(response);
      }

      this.starredEntities.add(entityRef);
    }

    this.notifyChanges();
  }

  starredEntitie$(): Observable<Set<string>> {
    return this.observable;
  }

  async getStarCount(entityRef: string): Promise<number> {
    const baseUrl = await this.discoveryApi.getBaseUrl('catalog');
    const { fetch } = this.fetchApi;
    const { token } = await this.identityApi.getCredentials();

    const headers: Record<string, string> = {};
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(
      `${baseUrl}/starred-entities/count/${encodeURIComponent(entityRef)}`,
      { headers },
    );
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }

    const data = await response.json();
    return typeof data.count === 'number' ? data.count : 0;
  }

  private notifyChanges() {
    for (const subscription of this.subscribers) {
      subscription.next(new Set(this.starredEntities));
    }
  }
}
