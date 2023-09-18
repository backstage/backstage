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
import { Config } from '@backstage/config';
import { resolveUserEmailSuffix } from './config';
import { Filter } from '@backstage/plugin-jira-dashboard-common';

const getUsernameFromRef = (userRef: string) => {
  return userRef?.split('/').slice(1)[0];
};

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

export const getDefaultFilters = (
  config: Config,
  userRef?: string,
): Filter[] => {
  if (!userRef) {
    return [openFilter, incomingFilter];
  }
  const username = getUsernameFromRef(userRef);

  if (!username) {
    return [openFilter, incomingFilter];
  }

  const assignedToMeFilter: Filter = {
    name: 'Assigned to me',
    shortName: 'ME',
    query: `assignee = "${username}${resolveUserEmailSuffix(
      config,
    )}" AND resolution = Unresolved ORDER BY updated DESC`,
  };

  return [openFilter, incomingFilter, assignedToMeFilter];
};
