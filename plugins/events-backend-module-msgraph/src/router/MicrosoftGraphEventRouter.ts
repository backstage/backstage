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

import type { AuthService, LoggerService } from '@backstage/backend-plugin-api';
import type { EntityFilterQuery } from '@backstage/catalog-client';
import {
  type CompoundEntityRef,
  getCompoundEntityRef,
} from '@backstage/catalog-model';
import { isError } from '@backstage/errors';
import type { CatalogService } from '@backstage/plugin-catalog-node';
import {
  TOPIC_MICROSOFT_GRAPH_DELETE,
  TOPIC_MICROSOFT_GRAPH_UPSERT,
  MICROSOFT_GRAPH_TOPIC,
} from '../topics';
import {
  type MicrosoftGraphDeleteEventPayload,
  type MicrosoftGraphUpsertEventPayload,
} from '../types';
import type {
  EventParams,
  EventRouter,
  EventsService,
} from '@backstage/plugin-events-node';
import { parseEvents } from './parseEvents';
import type { Change } from './types';

/**
 * Subscribes to the generic `msgraph` topic
 * and publishes the events under the more concrete sub-topics.
 * Group/user create/update events are published to {@link TOPIC_MICROSOFT_GRAPH_UPSERT}
 * with {@link MicrosoftGraphUpsertEventPayload} payload,
 * while group/user delete events are published to {@link TOPIC_MICROSOFT_GRAPH_DELETE}
 * with {@link CompoundEntityRef} payload.
 *
 * @public
 */
export class MicrosoftGraphEventRouter {
  private subscribed: boolean = false;
  private readonly events: EventsService;
  private readonly logger: LoggerService;
  private readonly auth: AuthService;
  private readonly catalog: CatalogService;

  constructor(options: {
    events: EventsService;
    logger: LoggerService;
    auth: AuthService;
    catalog: CatalogService;
  }) {
    this.auth = options.auth;
    this.catalog = options.catalog;
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
    const parsedEvents = parseEvents({ event, logger: this.logger });

    if (!parsedEvents) {
      return;
    }

    const { upsertedUsers, upsertedGroups, deletedUsers, deletedGroups } =
      parsedEvents;

    if (upsertedUsers.length > 0 || upsertedGroups.length > 0) {
      this.logger.debug(
        `Forwarding ${upsertedUsers.length} modified users and ${upsertedGroups.length} modified groups`,
      );

      // Republish payload as is - MS Graph provider will fetch the details by IDs
      this.events
        .publish({
          topic: TOPIC_MICROSOFT_GRAPH_UPSERT,
          eventPayload: [
            ...upsertedUsers.map(({ resourceId }) => ({
              resourceType: 'user',
              resourceId,
            })),
            ...upsertedGroups.map(({ resourceId }) => ({
              resourceType: 'group',
              resourceId,
            })),
          ],
        } as EventParams<MicrosoftGraphUpsertEventPayload>)
        .catch(err => {
          this.logger.error(
            `Failed to publish user/group upsert event: ${err}`,
            isError(err) ? err : undefined,
          );
        });
    }

    // For deleted entities Catalog is the only place to get the entityRefs by User/Group IDs
    if (deletedGroups.length > 0 || deletedUsers.length > 0) {
      const deletedEntityRefs = await this.getDeletedEntities({
        deletedGroups,
        deletedUsers,
      });

      if (deletedEntityRefs.length === 0) {
        // Nothing to republish - entities are not in the Catalog
        return;
      }

      this.logger.debug(
        `Forwarding ${deletedEntityRefs.length} deleted entities`,
      );

      this.events
        .publish({
          topic: TOPIC_MICROSOFT_GRAPH_DELETE,
          eventPayload: deletedEntityRefs.map(entityRef => ({ entityRef })),
        } as EventParams<MicrosoftGraphDeleteEventPayload>)
        .catch(err => {
          this.logger.error(
            `Failed to publish user/group delete event: ${err}`,
            isError(err) ? err : undefined,
          );
        });
    }
  }

  private async getDeletedEntities({
    deletedGroups,
    deletedUsers,
  }: Record<'deletedGroups' | 'deletedUsers', Change[]>): Promise<
    CompoundEntityRef[]
  > {
    const filter: EntityFilterQuery = [];
    if (deletedGroups.length > 0) {
      filter.push({
        kind: 'Group',
        'metadata.annotations.graph.microsoft.com/group-id': deletedGroups.map(
          dg => dg.resourceId,
        ),
      });
    }

    if (deletedUsers.length > 0) {
      filter.push({
        kind: 'User',
        'metadata.annotations.graph.microsoft.com/user-id': deletedUsers.map(
          du => du.resourceId,
        ),
      });
    }

    if (filter.length === 0) {
      return [];
    }

    const deletedEntities = await this.catalog.getEntities(
      {
        filter,
        fields: ['metadata.name', 'kind', 'spec.type'],
      },
      { credentials: await this.auth.getOwnServiceCredentials() },
    );

    return deletedEntities.items.map(getCompoundEntityRef);
  }
}
