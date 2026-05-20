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
  IndexableResultSet,
  SearchResultSet,
} from '@backstage/plugin-search-common';
import { LoggerService } from '@backstage/backend-plugin-api';

const allowedLocationProtocols = ['http:', 'https:'];

/**
 * Converts an IndexableResultSet to a SearchResultSet by stripping internal
 * fields (e.g. authorization) that must not be exposed to callers.
 * @internal
 */
export const toSearchResults = (resultSet: IndexableResultSet) => ({
  ...resultSet,
  results: resultSet.results.map(result => ({
    ...result,
    document: {
      ...result.document,
      authorization: undefined,
    },
  })),
});

/**
 * Filters a SearchResultSet to remove results whose document location uses an
 * unsafe protocol (anything other than http: or https:).
 * @internal
 */
export const filterResultSet = <T extends SearchResultSet>(
  { results, ...resultSet }: T,
  logger: LoggerService,
): T =>
  ({
    ...resultSet,
    results: results.filter(result => {
      const protocol = new URL(result.document.location, 'https://example.com')
        .protocol;
      const isAllowed = allowedLocationProtocols.includes(protocol);
      if (!isAllowed) {
        logger.info(
          `Rejected search result for "${result.document.title}" as location protocol "${protocol}" is unsafe`,
        );
      }
      return isAllowed;
    }),
  } as T);
