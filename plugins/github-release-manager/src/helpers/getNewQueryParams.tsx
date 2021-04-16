/*
 * Copyright 2021 Spotify AB
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

import qs from 'qs';

import { Project } from '../contexts/ProjectContext';

export function getParsedQuery({ query }: { query: URLSearchParams }) {
  const parsedQuery: Partial<Project> = qs.parse(query.toString());

  return parsedQuery;
}

export function getNewQueryParams({
  query,
  updates,
}: {
  query: URLSearchParams;
  updates: {
    key: keyof Project;
    value: string;
  }[];
}) {
  const queryParams = qs.parse(query.toString());

  for (const { key, value } of updates) {
    queryParams[key] = value;
  }

  return qs.stringify(queryParams);
}
