/*
 * Copyright 2024 The Backstage Authors
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
import { NotificationProcessorFilters, NotificationSeverity } from './types';
import { notificationSeverities } from './constants';

/** @public */
export const getProcessorFiltersFromConfig = (config: Config) => {
  const filter: NotificationProcessorFilters = {};
  const minSeverity = config.getOptionalString(
    'filter.minSeverity',
  ) as NotificationSeverity;
  if (minSeverity) {
    if (notificationSeverities.includes(minSeverity)) {
      filter.minSeverity = minSeverity;
    } else {
      throw new Error(`Invalid minSeverity: ${minSeverity}`);
    }
  }
  const maxSeverity = config.getOptionalString(
    'filter.maxSeverity',
  ) as NotificationSeverity;
  if (maxSeverity) {
    if (notificationSeverities.includes(maxSeverity)) {
      filter.maxSeverity = maxSeverity;
    } else {
      throw new Error(`Invalid maxSeverity: ${maxSeverity}`);
    }
  }
  filter.excludedTopics = config.getOptionalStringArray(
    'filter.excludedTopics',
  );
  return filter;
};
