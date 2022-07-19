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

import { compact, zipObject } from 'lodash';
import qs from 'qs';
import DataLoader from 'dataloader';
import {
  EvaluatePermissionResponse,
  EvaluatePermissionRequest,
  AuthorizeResult,
  isResourcePermission,
  PermissionEvaluator,
  AuthorizePermissionRequest,
  QueryPermissionRequest,
} from '@backstage/plugin-permission-common';
import {
  DocumentTypeInfo,
  IndexableResult,
  IndexableResultSet,
  QueryRequestOptions,
  QueryTranslator,
  SearchEngine,
  SearchQuery,
} from '@backstage/plugin-search-common';
import { Config } from '@backstage/config';
import { InputError } from '@backstage/errors';
import { Writable } from 'stream';

export function decodePageCursor(pageCursor?: string): { page: number } {
  if (!pageCursor) {
    return { page: 0 };
  }

  const page = Number(Buffer.from(pageCursor, 'base64').toString('utf-8'));
  if (isNaN(page)) {
    throw new InputError('Invalid page cursor');
  }

  if (page < 0) {
    throw new InputError('Invalid page cursor');
  }

  return {
    page,
  };
}

export function encodePageCursor({ page }: { page: number }): string {
  return Buffer.from(`${page}`, 'utf-8').toString('base64');
}

export class AuthorizedSearchEngine implements SearchEngine {
  private readonly pageSize = 25;
  private readonly queryLatencyBudgetMs: number;

  constructor(
    private readonly searchEngine: SearchEngine,
    private readonly types: Record<string, DocumentTypeInfo>,
    private readonly permissions: PermissionEvaluator,
    config: Config,
  ) {
    this.queryLatencyBudgetMs =
      config.getOptionalNumber('search.permissions.queryLatencyBudgetMs') ??
      1000;
  }

  setTranslator(translator: QueryTranslator): void {
    this.searchEngine.setTranslator(translator);
  }

  async getIndexer(type: string): Promise<Writable> {
    return this.searchEngine.getIndexer(type);
  }

  async query(
    query: SearchQuery,
    options: QueryRequestOptions,
  ): Promise<IndexableResultSet> {
    const queryStartTime = Date.now();

    const conditionFetcher = new DataLoader(
      (requests: readonly QueryPermissionRequest[]) =>
        this.permissions.authorizeConditional(requests.slice(), options),
      {
        cacheKeyFn: ({ permission: { name } }) => name,
      },
    );

    const authorizer = new DataLoader(
      (requests: readonly AuthorizePermissionRequest[]) =>
        this.permissions.authorize(requests.slice(), options),
      {
        // Serialize the permission name and resourceRef as
        // a query string to avoid collisions from overlapping
        // permission names and resourceRefs.
        cacheKeyFn: ({ permission: { name }, resourceRef }) =>
          qs.stringify({ name, resourceRef }),
      },
    );

    const requestedTypes = query.types || Object.keys(this.types);

    const typeDecisions = zipObject(
      requestedTypes,
      await Promise.all(
        requestedTypes.map(type => {
          const permission = this.types[type]?.visibilityPermission;

          // No permission configured for this document type - always allow.
          if (!permission) {
            return { result: AuthorizeResult.ALLOW as const };
          }

          // Resource permission supplied, so we need to check for conditional decisions.
          if (isResourcePermission(permission)) {
            return conditionFetcher.load({ permission });
          }

          // Non-resource permission supplied - we can perform a standard authorization.
          return authorizer.load({ permission });
        }),
      ),
    );

    const authorizedTypes = requestedTypes.filter(
      type => typeDecisions[type]?.result !== AuthorizeResult.DENY,
    );

    const resultByResultFilteringRequired = authorizedTypes.some(
      type => typeDecisions[type]?.result === AuthorizeResult.CONDITIONAL,
    );

    // When there are no CONDITIONAL decisions for any of the requested
    // result types, we can skip filtering result by result by simply
    // skipping the types the user is not permitted to see, which will
    // be much more efficient.
    //
    // Since it's not currently possible to configure the page size used
    // by search engines, this detail means that a single user might see
    // a different page size depending on whether their search required
    // result-by-result filtering or not. We can fix this minor
    // inconsistency by introducing a configurable page size.
    //
    // cf. https://github.com/backstage/backstage/issues/9162
    if (!resultByResultFilteringRequired) {
      return this.searchEngine.query(
        { ...query, types: authorizedTypes },
        options,
      );
    }

    const { page } = decodePageCursor(query.pageCursor);
    const targetResults = (page + 1) * this.pageSize;

    let filteredResults: IndexableResult[] = [];
    let nextPageCursor: string | undefined;
    let latencyBudgetExhausted = false;

    do {
      const nextPage = await this.searchEngine.query(
        { ...query, types: authorizedTypes, pageCursor: nextPageCursor },
        options,
      );

      filteredResults = filteredResults.concat(
        await this.filterResults(nextPage.results, typeDecisions, authorizer),
      );

      nextPageCursor = nextPage.nextPageCursor;
      latencyBudgetExhausted =
        Date.now() - queryStartTime > this.queryLatencyBudgetMs;
    } while (
      nextPageCursor &&
      filteredResults.length < targetResults &&
      !latencyBudgetExhausted
    );

    return {
      results: filteredResults
        .slice(page * this.pageSize, (page + 1) * this.pageSize)
        .map((result, index) => {
          // Overwrite any/all rank entries to avoid leaking knowledge of filtered results.
          return {
            ...result,
            rank: page * this.pageSize + index + 1,
          };
        }),
      previousPageCursor:
        page === 0 ? undefined : encodePageCursor({ page: page - 1 }),
      nextPageCursor:
        !latencyBudgetExhausted &&
        (nextPageCursor || filteredResults.length > targetResults)
          ? encodePageCursor({ page: page + 1 })
          : undefined,
    };
  }

  private async filterResults(
    results: IndexableResult[],
    typeDecisions: Record<string, EvaluatePermissionResponse>,
    authorizer: DataLoader<
      EvaluatePermissionRequest,
      EvaluatePermissionResponse
    >,
  ) {
    return compact(
      await Promise.all(
        results.map(result => {
          if (typeDecisions[result.type]?.result === AuthorizeResult.ALLOW) {
            return result;
          }

          const permission = this.types[result.type]?.visibilityPermission;
          const resourceRef = result.document.authorization?.resourceRef;

          if (!permission || !resourceRef) {
            return result;
          }

          // We only reach this point in the code for types where the initial
          // authorization returned CONDITIONAL -- ALLOWs return early
          // immediately above, and types where the decision was DENY get
          // filtered out entirely when querying.
          //
          // This means the call to isResourcePermission here is mostly about
          // narrowing the type of permission - the only way to get here with a
          // non-resource permission is if the PermissionPolicy returns a
          // CONDITIONAL decision for a non-resource permission, which can't
          // happen - it would throw an error during validation in the
          // permission-backend.
          if (!isResourcePermission(permission)) {
            throw new Error(
              `Unexpected conditional decision returned for non-resource permission "${permission.name}"`,
            );
          }

          return authorizer
            .load({ permission, resourceRef })
            .then(decision =>
              decision.result === AuthorizeResult.ALLOW ? result : undefined,
            );
        }),
      ),
    );
  }
}
