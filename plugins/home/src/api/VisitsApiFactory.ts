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
import {
  Visit,
  VisitsApi,
  VisitsApiQueryParams,
  VisitsApiSaveParams,
} from './VisitsApi';

type ArrayElement<A> = A extends readonly (infer T)[] ? T : never;

/** @public */
export type VisitsApiFactoryOptions = {
  limit: number;
  retrieveAll?: () => Promise<Array<Visit>>;
  persistAll?: (visits: Array<Visit>) => Promise<void>;
};

/**
 * @public
 * This helps the creation of VisitApi implementations. Important to note
 * that it implements features like orderBy and filterBy on memory, therefore
 * is intended to handle few visits. The default is 100.
 * See LocalStorageVisitsApi for an usage example.
 */
export class VisitsApiFactory implements VisitsApi {
  protected readonly randomUUID = window.crypto.randomUUID;
  protected readonly limit: number;
  protected retrieveAll: () => Promise<Array<Visit>>;
  protected persistAll: (visits: Array<Visit>) => Promise<void>;

  protected constructor(options: VisitsApiFactoryOptions) {
    this.limit = Math.abs(options.limit ?? 100);
    this.retrieveAll = options.retrieveAll ?? (async () => []);
    this.persistAll = options.persistAll ?? (async () => {});
  }

  async list(queryParams?: VisitsApiQueryParams): Promise<Visit[]> {
    let visits = await this.retrieveAll();

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
        if (filter.operator === 'contains')
          return `${field}`.includes(`${filter.value}`);
        return false;
      });
    });

    return visits;
  }

  async save(saveParams: VisitsApiSaveParams): Promise<Visit> {
    const visits = await this.retrieveAll();

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
