/*
 * Copyright 2023 The Backstage Authors
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
import { IdentityApi, StorageApi } from '@backstage/core-plugin-api';
import {
  Visit,
  VisitsApi,
  VisitsApiQueryParams,
  VisitsApiSaveParams,
} from './VisitsApi';

/** @public */
export type VisitsStorageApiOptions = {
  limit?: number;
  storageApi: StorageApi;
  identityApi: IdentityApi;
};

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

/**
 * @public
 * This is an implementation of VisitsApi that relies on a StorageApi.
 * Beware that filtering and ordering are done in memory therefore it is
 * prudent to keep limit to a reasonable size.
 */
export class VisitsStorageApi implements VisitsApi {
  private readonly limit: number;
  private readonly storageApi: StorageApi;
  private readonly storageKeyPrefix = '@backstage/plugin-home:visits';
  private readonly identityApi: IdentityApi;

  static create(options: VisitsStorageApiOptions) {
    return new VisitsStorageApi(options);
  }

  private constructor(options: VisitsStorageApiOptions) {
    this.limit = Math.abs(options.limit ?? 100);
    this.storageApi = options.storageApi;
    this.identityApi = options.identityApi;
  }

  /**
   * Returns a list of visits through the visitsApi
   */
  async list(queryParams?: VisitsApiQueryParams): Promise<Visit[]> {
    let visits = [...(await this.retrieveAll())];

    // reversing order to guarantee orderBy priority
    (queryParams?.orderBy ?? []).reverse().forEach(order => {
      if (order.direction === 'asc') {
        visits.sort((a, b) => this.compare(order, a, b));
      } else {
        visits.sort((a, b) => this.compare(order, b, a));
      }
    });

    // reversing order to guarantee filterBy priority
    (queryParams?.filterBy ?? []).reverse().forEach(filter => {
      visits = visits.filter(visit => {
        const field = visit[filter.field] as number | string;
        if (filter.operator === '>') return field > filter.value;
        if (filter.operator === '>=') return field >= filter.value;
        if (filter.operator === '<') return field < filter.value;
        if (filter.operator === '<=') return field <= filter.value;
        if (filter.operator === '==') return field === filter.value;
        if (filter.operator === '!=') return field !== filter.value;
        if (filter.operator === 'contains')
          return `${field}`.includes(`${filter.value}`);
        return false;
      });
    });

    return visits;
  }

  /**
   * Saves a visit through the visitsApi
   */
  async save(saveParams: VisitsApiSaveParams): Promise<Visit> {
    const visits: Visit[] = [...(await this.retrieveAll())];

    const visit: Visit = {
      ...saveParams.visit,
      id: window.crypto.randomUUID(),
      hits: 1,
      timestamp: Date.now(),
    };

    // Updates entry if pathname is already registered
    const visitIndex = visits.findIndex(e => e.pathname === visit.pathname);
    if (visitIndex >= 0) {
      visit.id = visits[visitIndex].id;
      visit.hits = visits[visitIndex].hits + 1;
      visits[visitIndex] = visit;
    } else {
      visits.push(visit);
    }

    // Sort by time, most recent first
    visits.sort((a, b) => b.timestamp - a.timestamp);
    // Keep the most recent items up to limit
    await this.persistAll(visits.splice(0, this.limit));
    return visit;
  }

  private async persistAll(visits: Array<Visit>) {
    const storageKey = await this.getStorageKey();
    return this.storageApi.set<Array<Visit>>(storageKey, visits);
  }

  private async retrieveAll(): Promise<Array<Visit>> {
    const storageKey = await this.getStorageKey();
    // Handles for case when snapshot is and is not referenced per storaged type used
    const snapshot = this.storageApi.snapshot<Array<Visit>>(storageKey);
    if (snapshot?.presence !== 'unknown') {
      return snapshot?.value ?? [];
    }

    return new Promise((resolve, reject) => {
      const subscription = this.storageApi
        .observe$<Visit[]>(storageKey)
        .subscribe({
          next: next => {
            const visits = next.value ?? [];
            subscription.unsubscribe();
            resolve(visits);
          },
          error: err => {
            subscription.unsubscribe();
            reject(err);
          },
        });
    });
  }

  private async getStorageKey(): Promise<string> {
    const { userEntityRef } = await this.identityApi.getBackstageIdentity();
    const storageKey = `${this.storageKeyPrefix}:${userEntityRef}`;
    return storageKey;
  }

  // This assumes Visit fields are either numbers or strings
  private compare(
    order: ArrayElement<VisitsApiQueryParams['orderBy']>,
    a: Visit,
    b: Visit,
  ): number {
    const isNumber = typeof a[order.field] === 'number';
    return isNumber
      ? (a[order.field] as number) - (b[order.field] as number)
      : `${a[order.field]}`.localeCompare(`${b[order.field]}`);
  }
}
