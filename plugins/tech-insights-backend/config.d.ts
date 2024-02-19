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

import { HumanDuration } from '@backstage/types';

export interface Config {
  /** Configuration options for the tech-insights plugin */
  techInsights?: {
    /** Configuration options for fact retrievers */
    factRetrievers?: {
      /** Configuration for a fact retriever and its registration identified by its name. */
      [name: string]: {
        /** A cron expression to indicate when the fact retriever should be triggered. */
        cadence: string;
        /** Optional duration of the initial delay. */
        initialDelay?: HumanDuration;
        /** Optional lifecycle definition indicating the cleanup logic of facts when this retriever is run. */
        lifecycle?: { timeToLive: HumanDuration } | { maxItems: number };
        /** Optional duration to determine how long the fact retriever should be allowed to run, defaults to 5 minutes. */
        timeout?: HumanDuration;
      };
    };
  };
}
