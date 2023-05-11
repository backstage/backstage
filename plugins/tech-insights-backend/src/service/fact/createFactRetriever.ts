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

import { HumanDuration } from '@backstage/types';
import {
  FactLifecycle,
  FactRetriever,
  FactRetrieverRegistration,
} from '@backstage/plugin-tech-insights-node';
import { Duration } from 'luxon';

/**
 * @public
 *
 * @param cadence - cron expression to indicate when the fact retriever should be triggered
 * @param factRetriever - Implementation of fact retriever consisting of at least id, version, schema and handler
 * @param lifecycle - Optional lifecycle definition indicating the cleanup logic of facts when this retriever is run
 * @param timeout - Optional duration to determine how long the fact retriever should be allowed to run, defaults to 5 minutes
 *
 */
export type FactRetrieverRegistrationOptions = {
  cadence: string;
  factRetriever: FactRetriever;
  lifecycle?: FactLifecycle;
  timeout?: Duration | HumanDuration;
  initialDelay?: Duration | HumanDuration;
};

/**
 * @public
 *
 * A helper function to construct fact retriever registrations.
 * @param cadence - Cron expression to indicate when the fact retriever should be triggered
 * @param factRetriever - Implementation of fact retriever consisting of at least id, version, schema and handler
 * @param lifecycle - Optional lifecycle definition indicating the cleanup logic of facts when this retriever is run
 * @param timeout - Optional duration to determine how long the fact retriever should be allowed to run, defaults to 5 minutes
 * @param initialDelay - Optional initial delay to determine how long the fact retriever should wait before the initial run, defaults to 5 seconds
 *
 *
 * @remarks
 *
 * Cron expressions help:
 * ┌────────────── second (optional)
 # │ ┌──────────── minute
 # │ │ ┌────────── hour
 # │ │ │ ┌──────── day of month
 # │ │ │ │ ┌────── month
 # │ │ │ │ │ ┌──── day of week
 # │ │ │ │ │ │
 # │ │ │ │ │ │
 # * * * * * *
 *
 * Valid lifecycle values:
 * \{ ttl: \{ weeks: 2 \} \} -- This fact retriever will remove items that are older than 2 weeks when it is run
 * \{ maxItems: 7 \} -- This fact retriever will leave 7 newest items in the database when it is run
 *
 */
export function createFactRetrieverRegistration(
  options: FactRetrieverRegistrationOptions,
): FactRetrieverRegistration {
  const { cadence, factRetriever, lifecycle, timeout, initialDelay } = options;
  return {
    cadence,
    factRetriever,
    lifecycle,
    timeout,
    initialDelay,
  };
}
