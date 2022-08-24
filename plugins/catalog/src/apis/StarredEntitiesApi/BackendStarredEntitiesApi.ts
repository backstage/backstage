/*
 * Copyright 2022 The Backstage Authors
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
import { parseEntityRef } from '@backstage/catalog-model';
import {
  DiscoveryApi,
  ErrorApi,
  IdentityApi,
  StorageApi,
} from '@backstage/core-plugin-api';
import { ForwardedError, ResponseError } from '@backstage/errors';
import { StarredEntitiesApi } from '@backstage/plugin-catalog-react';
import { JsonArray, Observable } from '@backstage/types';
import limiterFactory from 'p-limit';
import ObservableImpl from 'zen-observable';

export class BackendStarredEntitiesApi implements StarredEntitiesApi {
  private readonly settingsStore: StorageApi;
  private readonly discoveryApi: DiscoveryApi;
  private readonly identityApi: IdentityApi;
  private readonly errorApi: ErrorApi;
  private starredEntities: Set<string>;

  private readonly observable: Observable<Set<string>>;
  private readonly subscribers = new Set<
    ZenObservable.SubscriptionObserver<Set<string>>
  >();

  // used in the tests
  isSynced = false;

  constructor(opts: {
    storageApi: StorageApi;
    discoveryApi: DiscoveryApi;
    identityApi: IdentityApi;
    errorApi: ErrorApi;
  }) {
    this.settingsStore = opts.storageApi.forBucket('starredEntities');
    this.discoveryApi = opts.discoveryApi;
    this.identityApi = opts.identityApi;
    this.errorApi = opts.errorApi;

    this.observable = new ObservableImpl<Set<string>>(subscriber => {
      // forward the the latest value
      subscriber.next(this.starredEntities);

      this.subscribers.add(subscriber);
      return () => {
        this.subscribers.delete(subscriber);
      };
    });

    this.starredEntities = new Set(
      this.settingsStore.snapshot<string[]>('entityRefs').value ?? [],
    );

    // migrate the local starred entities to the backend if needed
    this.performMigration().then(() => {
      // initially load from the server
      this.loadFromServer().then(() => {
        this.isSynced = true;
      });
    });

    this.settingsStore.observe$<string[]>('entityRefs').subscribe({
      next: next => {
        this.starredEntities = new Set(next.value ?? []);
        this.notifyChanges();
      },
    });
  }

  async toggleStarred(entityRef: string): Promise<void> {
    const { namespace, kind, name } = parseEntityRef(entityRef);

    const response = await this.fetch(`/${namespace}/${kind}/${name}/toggle`, {
      method: 'POST',
    });

    if (!response.ok) {
      this.errorApi.post(
        new ForwardedError(
          `Could not star/unstar entity ${entityRef}`,
          await ResponseError.fromResponse(response),
        ),
      );
      return;
    }

    const { starredEntities = [] } = await response.json();

    // update the storage (which will trigger observe$)
    await this.settingsStore.set(
      'entityRefs',
      Array.from(starredEntities) as JsonArray,
    );
  }

  starredEntitie$(): Observable<Set<string>> {
    return this.observable;
  }

  private notifyChanges() {
    for (const subscription of this.subscribers) {
      subscription.next(this.starredEntities);
    }
  }

  private async fetch(path: string, init?: RequestInit): Promise<Response> {
    const { token } = await this.identityApi.getCredentials();
    const baseUrl = await this.discoveryApi.getBaseUrl('starred-entities');

    return await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: {
        ...init?.headers,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });
  }

  async loadFromServer(): Promise<void> {
    const response = await this.fetch('');

    if (!response.ok) {
      this.errorApi.post(await ResponseError.fromResponse(response), {
        hidden: true,
      });
      return;
    }

    const { starredEntities = [] } = await response.json();

    // update the storage (which will trigger observe$)
    await this.settingsStore.set(
      'entityRefs',
      Array.from(starredEntities) as JsonArray,
    );
  }

  async performMigration(): Promise<void> {
    const limiter = limiterFactory(5);

    if (
      !this.settingsStore.snapshot('migratedToStarredEntitiesBackend').value
    ) {
      const oldEntities =
        this.settingsStore.snapshot<string[]>('entityRefs').value ?? [];

      await Promise.all(
        oldEntities
          .map(e => {
            try {
              return parseEntityRef(e);
            } catch (_) {
              return undefined;
            }
          })
          .filter(notUndefined)
          .map(({ kind, namespace, name }) =>
            limiter(() =>
              this.fetch(`/${namespace}/${kind}/${name}/star`, {
                method: 'POST',
              }),
            ),
          ),
      );

      await this.settingsStore.set('migratedToStarredEntitiesBackend', true);
    }
  }
}

/**
 * A type guard to check that an entry is not undefined
 * @param input - the value to check
 */
function notUndefined<T>(input: T | undefined): input is T {
  return Boolean(input);
}
