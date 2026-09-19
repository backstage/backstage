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

import { httpJson } from './httpJson';

export type SearchQueryInput = {
  term: string;
  types?: string[];
  filters?: Record<string, unknown>;
  pageLimit?: number;
  pageCursor?: string;
};

export type SearchQueryResult = {
  results: Array<Record<string, unknown>>;
  nextPageCursor?: string;
  numberOfResults?: number;
};

function buildQueryUrl(baseUrl: string, input: SearchQueryInput): string {
  const url = new URL('/api/search/query', baseUrl);
  url.searchParams.set('term', input.term);
  for (const type of input.types ?? []) {
    url.searchParams.append('types', type);
  }
  if (input.pageLimit !== undefined) {
    url.searchParams.set('pageLimit', String(input.pageLimit));
  }
  if (input.pageCursor) {
    url.searchParams.set('pageCursor', input.pageCursor);
  }
  for (const [key, value] of Object.entries(input.filters ?? {})) {
    url.searchParams.set(`filters[${key}]`, String(value));
  }
  return url.toString();
}

/**
 * A thin client that talks directly to the search plugin's REST API of the
 * given Backstage instance.
 */
export class SearchClient {
  constructor(
    private readonly baseUrl: string,
    private readonly accessToken: string,
  ) {}

  async query(input: SearchQueryInput): Promise<SearchQueryResult> {
    return httpJson<SearchQueryResult>(buildQueryUrl(this.baseUrl, input), {
      method: 'GET',
      headers: { Authorization: `Bearer ${this.accessToken}` },
      signal: AbortSignal.timeout(30_000),
    });
  }
}
