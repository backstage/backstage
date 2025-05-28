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

import { Config, readDurationFromConfig } from '@backstage/config';
import { HumanDuration } from '@backstage/types';
import lodash from 'lodash';

export interface HistoryConfig {
  /**
   * The amount of time that a blocked call is held by default while waiting for
   * events.
   */
  blockDuration: HumanDuration;

  /**
   * How often to poll for events in a blocked call, when using a polling
   * strategy rather than an event based one.
   */
  blockPollFrequency: HumanDuration;

  /**
   * The maximum amount of time that catalog history events are retained.
   *
   * @remarks
   *
   * This deletion happens on a per-event basis, i.e. you will see old
   * individual events being deleted but newer ones stay around. Note that
   * this applies to all event types, meaning that the creation events will
   * be removed first.
   */
  eventMaxRetentionTime: HumanDuration | undefined;

  /**
   * The amount of time that catalog history events are retained, after the
   * deletion of an entity.
   *
   * @remarks
   *
   * This deletion does not happen on a per-event basis; rather, the entire
   * history is deleted all at once when the most recent event is older than
   * this limit.
   *
   * Deletion happens by entity ref. Registering a new entity with the same
   * ref (but not necessarilyt he same ID) as a deleted entity will
   * contribute to renewing the retention of history events for that entity
   * ref. This way you can keep track of entities being re-appropriated in
   * a new place after deletion etc.
   */
  eventRetentionTimeAfterDeletion: HumanDuration | undefined;

  /**
   * The amount of time that a subscription will wait for an acknowledgement
   * before a delivery is considered failed and gets marked for re-delivery.
   */
  subscriptionAckTimeout: HumanDuration;

  /**
   * The amount of time that catalog history subscriptions are kept around
   * after no activity is detected on them.
   */
  subscriptionRetentionTimeAfterInactive: HumanDuration;
}

const defaults: HistoryConfig = {
  blockDuration:
    process.env.NODE_ENV === 'test' ? { seconds: 3 } : { seconds: 10 },
  blockPollFrequency:
    process.env.NODE_ENV === 'test' ? { milliseconds: 100 } : { seconds: 1 },
  eventMaxRetentionTime: undefined,
  eventRetentionTimeAfterDeletion: undefined,
  subscriptionAckTimeout: { seconds: 30 },
  subscriptionRetentionTimeAfterInactive: { days: 30 },
};

export function getHistoryConfig(options?: {
  config?: Config;
  overrides?: Partial<HistoryConfig>;
}): HistoryConfig {
  function optionalDuration(key: string): HumanDuration | undefined {
    return options?.config?.has(key)
      ? readDurationFromConfig(options.config, { key })
      : undefined;
  }

  const configured: Partial<HistoryConfig> = {
    eventMaxRetentionTime: optionalDuration(
      'catalog.history.eventMaxRetentionTime',
    ),
    eventRetentionTimeAfterDeletion: optionalDuration(
      'catalog.history.eventRetentionTimeAfterDeletion',
    ),
    subscriptionAckTimeout: optionalDuration(
      'catalog.history.subscriptionAckTimeout',
    ),
    subscriptionRetentionTimeAfterInactive: optionalDuration(
      'catalog.history.subscriptionRetentionTimeAfterInactive',
    ),
  };

  return {
    ...defaults,
    ...lodash.pickBy(configured, value => value !== undefined),
    ...options?.overrides,
  };
}
