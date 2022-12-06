/*
 * Copyright 2022 The Backstage Authors
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

import { EventBroker } from './EventBroker';
import { EventParams } from './EventParams';
import { EventPublisher } from './EventPublisher';
import { EventSubscriber } from './EventSubscriber';

/**
 * Subscribes to a topic and - depending on a set of conditions -
 * republishes the event to another topic.
 *
 * @see {@link https://www.enterpriseintegrationpatterns.com/MessageRouter.html | Message Router pattern}.
 * @public
 */
export abstract class EventRouter implements EventPublisher, EventSubscriber {
  private eventBroker?: EventBroker;

  protected abstract determineDestinationTopic(
    params: EventParams,
  ): string | undefined;

  async onEvent(params: EventParams): Promise<void> {
    const topic = this.determineDestinationTopic(params);

    if (!topic) {
      return;
    }

    // republish to different topic
    this.eventBroker?.publish({
      ...params,
      topic,
    });
  }

  async setEventBroker(eventBroker: EventBroker): Promise<void> {
    this.eventBroker = eventBroker;
  }

  abstract supportsEventTopics(): string[];
}
