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
  AuthorizeRequest,
  AuthorizeResponse,
  AuthorizeResult,
  PermissionClient,
} from '@backstage/plugin-permission-common';
import { SearchEngine } from '@backstage/plugin-search-backend-node';
import {
  QueryTranslator,
  IndexableDocument,
  SearchQuery,
  QueryOptions,
  SearchResultSet,
  SearchResult,
} from '@backstage/search-common';

export class PermissionFilteringEngine implements SearchEngine {
  constructor(
    private readonly engine: SearchEngine,
    private readonly permissionClient: PermissionClient,
  ) {}

  setTranslator = (translator: QueryTranslator): void =>
    this.engine.setTranslator(translator);

  index = (type: string, documents: IndexableDocument[]): Promise<void> =>
    this.engine.index(type, documents);

  async query(
    query: SearchQuery,
    options?: QueryOptions,
  ): Promise<SearchResultSet> {
    let resultSet = await this.engine.query(query, options);

    const pageSize = resultSet.results.length;

    resultSet = await this.filterAuthorized(resultSet, options);

    let nextPageCursor = resultSet.nextPageCursor;
    while (resultSet.results.length < pageSize && nextPageCursor) {
      let nextPage = await this.engine.query(
        { ...query, pageCursor: nextPageCursor },
        options,
      );
      nextPage = await this.filterAuthorized(nextPage, options);

      resultSet.results = resultSet.results.concat(nextPage.results);
      nextPageCursor = nextPage.nextPageCursor;
    }

    resultSet.results.length = Math.min(resultSet.results.length, pageSize);

    // TODO(mtlewis) when the user requests page 1, but no authorized entries are present
    // in page 2, the result set in page 1 is the same as page 2.

    return resultSet;
  }

  private async filterAuthorized(
    resultSet: SearchResultSet,
    options?: QueryOptions,
  ): Promise<SearchResultSet> {
    if (!resultSet.results.some(result => !!result.document.authorization)) {
      // no results have authorization requirements attached,
      // we can return the results without any extra work.
      return resultSet;
    }

    const authorizeRequests = resultSet.results
      .filter(result => result.document.authorization)
      .map(result => result.document.authorization!);

    const authorizeResponses = await this.permissionClient.authorize(
      authorizeRequests,
      options,
    );

    const authorizationMap = new Map<AuthorizeRequest, AuthorizeResponse>(
      authorizeRequests.map((request, i) => [request, authorizeResponses[i]]),
    );

    resultSet.results = resultSet.results.reduce((acc, result) => {
      if (!result.document.authorization) {
        acc.push(result);
      } else {
        const authorizeResult = authorizationMap.get(
          result.document.authorization,
        )?.result;

        if (authorizeResult === AuthorizeResult.ALLOW) {
          acc.push({
            ...result,
            document: {
              ...result.document,
              authorization: undefined,
            },
          });
        }
      }

      return acc;
    }, [] as SearchResult[]);

    return resultSet;
  }
}
