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

import { Models } from './models';

/** @public */
export type PaginationOptions = {
  page?: number;
  pagelen?: number;
};

/** @public */
export class WithPagination<
  TPage extends Models.Paginated<TResultItem>,
  TResultItem,
> {
  constructor(
    private readonly createUrl: (options: PaginationOptions) => URL,
    private readonly fetch: (url: URL) => Promise<TPage>,
  ) {}

  getPage(options?: PaginationOptions): Promise<TPage> {
    const opts = { page: 1, pagelen: 100, ...options };
    const url = this.createUrl(opts);
    return this.fetch(url);
  }

  async *iteratePages(
    options?: PaginationOptions,
  ): AsyncGenerator<TPage, void> {
    const opts = { page: 1, pagelen: 100, ...options };
    let url: URL | undefined = this.createUrl(opts);
    let res;
    do {
      res = await this.fetch(url);
      url = res.next ? new URL(res.next) : undefined;
      yield res;
    } while (url);
  }

  async *iterateResults(options?: PaginationOptions) {
    const opts = { page: 1, pagelen: 100, ...options };
    let url: URL | undefined = this.createUrl(opts);
    let res;
    do {
      res = await this.fetch(url);
      url = res.next ? new URL(res.next) : undefined;
      for (const item of res.values ?? []) {
        yield item;
      }
    } while (url);
  }
}
