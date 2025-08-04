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

/**
 * @public
 * Type definition for visit data before it's saved (without auto-generated fields)
 */
export type VisitInput = {
  name: string;
  pathname: string;
  entityRef?: string;
};

/** @public */
export type VisitsStorageApiOptions = {
  limit?: number;
  storageApi: StorageApi;
  identityApi: IdentityApi;
  transformPathname?: (pathname: string) => string;
  canSave?: (visit: VisitInput) => boolean | Promise<boolean>;
  enrichVisit?: (
    visit: VisitInput,
  ) => Promise<Record<string, any>> | Record<string, any>;
};

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

const DEFAULT_LIST_LIMIT = 8;

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
  private readonly transformPathnameImpl?: (pathname: string) => string;
  private readonly canSaveImpl?: (
    visit: VisitInput,
  ) => boolean | Promise<boolean>;
  private readonly enrichVisitImpl?: (
    visit: VisitInput,
  ) => Promise<Record<string, any>> | Record<string, any>;

  static create(options: VisitsStorageApiOptions) {
    return new VisitsStorageApi(options);
  }

  private constructor(options: VisitsStorageApiOptions) {
    this.limit = Math.abs(options.limit ?? 100);
    this.storageApi = options.storageApi;
    this.identityApi = options.identityApi;
    this.transformPathnameImpl = options.transformPathname;
    this.canSaveImpl = options.canSave;
    this.enrichVisitImpl = options.enrichVisit;
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

    return visits.slice(0, queryParams?.limit ?? DEFAULT_LIST_LIMIT);
  }

  /**
   * Transform the pathname before it is considered for any other processing.
   * @param pathname - the original pathname
   * @returns the transformed pathname
   */
  transformPathname(pathname: string): string {
    return this.transformPathnameImpl?.(pathname) ?? pathname;
  }

  /**
   * Determine whether a visit should be saved.
   * @param visit - page visit data
   */
  async canSave(visit: VisitInput): Promise<boolean> {
    if (!this.canSaveImpl) {
      return true;
    }
    return Promise.resolve(this.canSaveImpl(visit));
  }

  /**
   * Add additional data to the visit before saving.
   * @param visit - page visit data
   */
  async enrichVisit(visit: VisitInput): Promise<Record<string, any>> {
    if (!this.enrichVisitImpl) {
      return {};
    }
    return Promise.resolve(this.enrichVisitImpl(visit));
  }

  /**
   * Saves a visit through the visitsApi
   */
  async save(saveParams: VisitsApiSaveParams): Promise<Visit> {
    let visit = saveParams.visit;

    // Transform pathname if needed
    visit = {
      ...visit,
      pathname: this.transformPathname(visit.pathname),
    };

    // Check if visit should be saved
    if (!(await this.canSave(visit))) {
      // Return a minimal visit object without saving
      return {
        ...visit,
        id: '',
        hits: 0,
        timestamp: Date.now(),
      };
    }

    // Enrich the visit
    const enrichedData = await this.enrichVisit(visit);
    const enrichedVisit = { ...visit, ...enrichedData };

    const visits: Visit[] = [...(await this.retrieveAll())];

    const visitToSave: Visit = {
      ...enrichedVisit,
      id: window.crypto.randomUUID(),
      hits: 1,
      timestamp: Date.now(),
    };

    // Updates entry if pathname is already registered
    const visitIndex = visits.findIndex(
      e => e.pathname === visitToSave.pathname,
    );
    if (visitIndex >= 0) {
      visitToSave.id = visits[visitIndex].id;
      visitToSave.hits = visits[visitIndex].hits + 1;
      visits[visitIndex] = visitToSave;
    } else {
      visits.push(visitToSave);
    }

    // Sort by time, most recent first
    visits.sort((a, b) => b.timestamp - a.timestamp);
    // Keep the most recent items up to limit
    await this.persistAll(visits.splice(0, this.limit));
    return visitToSave;
  }

  /**
   * Updates the name of an existing visit through the visitsApi
   */
  async updateName(pathname: string, name: string): Promise<void> {
    const visits: Visit[] = [...(await this.retrieveAll())];
    const visitIndex = visits.findIndex(visit => visit.pathname === pathname);
    if (visitIndex >= 0) {
      visits[visitIndex] = {
        ...visits[visitIndex],
        name,
      };
      await this.persistAll(visits);
    }
  }

  private async persistAll(visits: Array<Visit>) {
    const storageKey = await this.getStorageKey();
    return this.storageApi.set<Array<Visit>>(storageKey, visits);
  }

  private async retrieveAll(): Promise<Array<Visit>> {
    const storageKey = await this.getStorageKey();
    // Handles for case when snapshot is and is not referenced per storage type used
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
