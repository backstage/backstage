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
import { Config } from '@backstage/config';
import { EventBroker, EventsService } from '@backstage/plugin-events-node';
import { CATALOG_ENTITY_LIFECYCLE_TOPIC } from '../constants';
import { EntityLifecycleEventsPayload } from '../catalog/types';
import { EntityLifecycleEvents } from './types';

export interface EntityLifecycleEventsOptions {
  events: EventsService | EventBroker;
}

export class DefaultEntityLifecycleEvents implements EntityLifecycleEvents {
  private constructor(private readonly events: EventsService | EventBroker) {}
  public static fromConfig(
    config: Config,
    options: EntityLifecycleEventsOptions,
  ) {
    const { events } = options;
    if (
      !(
        config.getOptionalBoolean('catalog.publishEntityLifecycleEvents') ??
        false
      )
    ) {
      return undefined;
    }

    return new DefaultEntityLifecycleEvents(events);
  }

  private async publishEvent(
    eventPayload: EntityLifecycleEventsPayload,
  ): Promise<void> {
    // Don't publish events without any refs.
    if (eventPayload.entityRefs.length === 0) return;
    await this.events.publish({
      topic: CATALOG_ENTITY_LIFECYCLE_TOPIC,
      eventPayload,
    });
  }

  public async publishUpsertedEvent(entityRefs: string[]): Promise<void> {
    return this.publishEvent({ action: 'upserted', entityRefs });
  }

  public async publishDeletedEvent(entityRefs: string[]): Promise<void> {
    return this.publishEvent({ action: 'deleted', entityRefs });
  }
}
