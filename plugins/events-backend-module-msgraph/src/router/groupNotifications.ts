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
import type {
  ChangeNotification,
  ChangeNotificationCollection,
} from '@microsoft/microsoft-graph-types';
import type { EventParams } from '@backstage/plugin-events-node';

const CHANGE_UPDATED = 'updated';
const CHANGE_DELETED = 'deleted';

/**
 * Parses the event payload and groups valid notifications by change type (upsert or delete).
 * According to https://learn.microsoft.com/en-us/graph/api/resources/subscription?view=graph-rest-1.0&utm_source=chatgpt.com
 * Creation and updates of groups and users trigger the updated changeType,
 * this is why both created and updated changeTypes are grouped into the upsertNotifications array.
 *
 * @param event - The event containing the payload to parse.
 * @param eventPayload
 * @param logger
 */
export function groupNotifications({
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

  const upsertNotifications: ChangeNotification[] = [];
  const deleteNotifications: ChangeNotification[] = [];
  const invalidNotifications: ChangeNotification[] = [];

  for (const notification of changeNotifications) {
    const normalizedChangeType = notification.changeType?.toLowerCase();

    if (normalizedChangeType === CHANGE_UPDATED) {
      // User and group creations and updates are both notified as 'updated' changeType
      upsertNotifications.push(notification);
    } else if (normalizedChangeType === CHANGE_DELETED) {
      deleteNotifications.push(notification);
    } else {
      invalidNotifications.push(notification);
    }
  }

  if (invalidNotifications.length > 0) {
    logger.warn(
      `Received ${
        invalidNotifications.length
      } invalid change notifications: ${JSON.stringify(invalidNotifications)}`,
    );
  }

  if (deleteNotifications.length === 0 && upsertNotifications.length === 0) {
    logger.info('No valid change notifications to process');
    return undefined;
  }

  return {
    deleteNotifications,
    upsertNotifications,
  };
}
