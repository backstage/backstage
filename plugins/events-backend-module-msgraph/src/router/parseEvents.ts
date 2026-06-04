/*
 * Copyright 2026 The Backstage Authors
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

import type { LoggerService } from '@backstage/backend-plugin-api';
import type { ChangeNotificationCollection } from '@microsoft/microsoft-graph-types';
import type { EventParams } from '@backstage/plugin-events-node';
import { partition } from 'lodash';
import {
  and,
  changeTypeIs,
  or,
  type Predicate,
  resourceTypeIs,
} from './predicates';
import type { Change } from './types';

const CHANGE_CREATED = 'created';
const CHANGE_UPDATED = 'updated';
const CHANGE_DELETED = 'deleted';
const CHANGE_TYPES = [CHANGE_CREATED, CHANGE_UPDATED, CHANGE_DELETED];

/**
 * Partitions the given changes into multiple arrays based on the given predicate map.
 * Each key in the predicate map corresponds to an array in the result object,
 * containing all changes that match the associated predicate.
 *
 * @template P - A record type where keys are strings and values are Predicate functions.
 * @param changes - The array of changes to partition.
 * @param predicateMap - A record mapping keys to Predicate functions.
 * @returns An object where each key from the predicate map maps to an array of changes that match the corresponding predicate.
 * @internal
 */
export const multipartition = <P extends Record<string, Predicate>>(
  changes: Change[],
  predicateMap: P,
) =>
  Object.fromEntries(
    Object.entries(predicateMap).map(([key, predicate]) => [
      key,
      changes.filter(predicate),
    ]),
  ) as { [K in keyof P]: Change[] };

/**
 * Parses the event payload and extracts valid change notifications.
 * Partitions the changes into created, updated, and deleted users and groups.
 *
 * @param event - The event containing the payload to parse.
 * @param eventPayload
 * @param logger
 */
export function parseEvents({
  event: { eventPayload },
  logger,
}: {
  event: EventParams;
  logger: LoggerService;
}) {
  const { value: changeNotifications } =
    eventPayload as ChangeNotificationCollection;

  if (!changeNotifications || !Array.isArray(changeNotifications)) {
    logger.warn(
      `Received invalid event payload: ${JSON.stringify(eventPayload)}`,
    );
    return undefined;
  }

  const [valid, invalid] = partition(
    changeNotifications,
    ({ changeType, resource }) =>
      changeType &&
      CHANGE_TYPES.includes(changeType.toLowerCase()) &&
      resource &&
      resource.split('/').length === 2,
  );

  if (invalid.length > 0) {
    logger.warn(
      `Received ${
        invalid.length
      } invalid change notifications: ${JSON.stringify(invalid)}`,
    );
  }

  if (valid.length === 0) {
    logger.info('No valid change notifications to process');
    return undefined;
  }

  const changes = valid.map(({ changeType, resource }) => {
    const [resourceType, resourceId] = resource!.toLocaleLowerCase().split('/');
    return {
      changeType: changeType!.toLowerCase(),
      resourceType,
      resourceId,
    };
  });

  return multipartition(changes, {
    deletedUsers: and(resourceTypeIs('users'), changeTypeIs(CHANGE_DELETED)),
    deletedGroups: and(resourceTypeIs('groups'), changeTypeIs(CHANGE_DELETED)),
    upsertedUsers: and(
      resourceTypeIs('users'),
      or(changeTypeIs(CHANGE_CREATED), changeTypeIs(CHANGE_UPDATED)),
    ),
    upsertedGroups: and(
      resourceTypeIs('groups'),
      or(changeTypeIs(CHANGE_CREATED), changeTypeIs(CHANGE_UPDATED)),
    ),
  });
}
