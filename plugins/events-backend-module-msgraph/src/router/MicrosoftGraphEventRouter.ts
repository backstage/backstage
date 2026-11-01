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
import {
  MICROSOFT_GRAPH_TOPIC,
  TOPIC_MICROSOFT_GRAPH_DELETE,
  TOPIC_MICROSOFT_GRAPH_UPSERT,
} from '../topics';
import type { EventParams, EventsService } from '@backstage/plugin-events-node';
import { groupNotifications } from './groupNotifications';

/**
 * Subscribes to the generic `msgraph` topic
 * and republishes the original event payload under the upsert and delete sub-topics.
 *
 * @public
 */
export class MicrosoftGraphEventRouter {
  private subscribed: boolean = false;
  private readonly events: EventsService;
  private readonly logger: LoggerService;

  constructor(options: { events: EventsService; logger: LoggerService }) {
    this.events = options.events;
    this.logger = options.logger.child({
      class: MicrosoftGraphEventRouter.prototype.constructor.name,
    });
  }

  /**
   * Subscribes itself to the topics,
   * after which events potentially can be received
   * and processed by {@link EventRouter.onEvent}.
   */
  async subscribe(): Promise<void> {
    if (this.subscribed) {
      return;
    }

    this.subscribed = true;

    await this.events.subscribe({
      id: 'MicrosoftGraphEventRouter',
      topics: [MICROSOFT_GRAPH_TOPIC],
      onEvent: this.onEvent.bind(this),
    });
  }

  async onEvent(event: EventParams): Promise<void> {
    const groupedNotifications = groupNotifications({
      event,
      logger: this.logger,
    });

    if (!groupedNotifications) {
      return;
    }

    const { deleteNotifications, upsertNotifications } = groupedNotifications;

    if (upsertNotifications.length > 0) {
      this.logger.debug(
        `Forwarding ${upsertNotifications.length} upsert notifications`,
      );

      await this.events.publish({
        topic: TOPIC_MICROSOFT_GRAPH_UPSERT,
        eventPayload: upsertNotifications,
      });
    }

    if (deleteNotifications.length > 0) {
      this.logger.debug(
        `Forwarding ${deleteNotifications.length} delete notifications`,
      );

      await this.events.publish({
        topic: TOPIC_MICROSOFT_GRAPH_DELETE,
        eventPayload: deleteNotifications,
      });
    }
  }
}
