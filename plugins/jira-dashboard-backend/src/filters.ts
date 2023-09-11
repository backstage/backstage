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
import type { Filter } from './types';

export const getDefaultFilters = (userRef?: string): Filter[] => {
  const openFilter: Filter = {
    name: 'Open Issues',
    shortName: 'OPEN',
    query: 'resolution = Unresolved ORDER BY updated DESC',
  };

  const incomingFilter: Filter = {
    name: 'Incoming Issues',
    shortName: 'INCOMING',
    query: 'status = New ORDER BY created ASC',
  };

  const username = userRef?.split('/').slice(1);

  if (!username) {
    return [openFilter, incomingFilter];
  }

  const assignedToMeFilter: Filter = {
    name: 'Assigned to me',
    shortName: 'ME',
    query: `assignee = "${username}@axis.com" AND resolution = Unresolved ORDER BY updated DESC`,
  };

  return [openFilter, incomingFilter, assignedToMeFilter];
};
