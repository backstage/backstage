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

import cronstrue from 'cronstrue';

// Defined at https://kubernetes.io/docs/concepts/workloads/controllers/cron-jobs/
const k8sCronAliases = new Map([
  ['@yearly', '0 0 1 1 *'],
  ['@annually', '0 0 1 1 *'],
  ['@monthly', '0 0 1 * *'],
  ['@weekly', '0 0 * * 0'],
  ['@daily', '0 0 * * *'],
  ['@midnight', '0 0 * * *'],
  ['@hourly', '0 * * * *'],
]);

// humanizeCron takes into account the aliases provided by kubernetes before
// calling cronstrue. In an effort to not throw an error, it will return the
// original cron formatted schedule if the cronstrue call fails.
export const humanizeCron = (schedule: string): string => {
  const deAliasedSchedule = k8sCronAliases.get(schedule) || schedule;
  try {
    return cronstrue.toString(deAliasedSchedule);
  } catch (e) {
    return deAliasedSchedule;
  }
};
