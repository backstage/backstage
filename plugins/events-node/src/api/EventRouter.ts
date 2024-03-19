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

import { EventParams } from './EventParams';
import { EventsService } from './EventsService';

/**
 * Subscribes to a topic and - depending on a set of conditions -
 * republishes the event to another topic.
 *
 * @see {@link https://www.enterpriseintegrationpatterns.com/MessageRouter.html | Message Router pattern}.
 * @public
 */
export abstract class EventRouter {
  private readonly events: EventsService;
  private readonly topics: string[];
  private subscribed: boolean = false;

  protected constructor(options: { events: EventsService; topics: string[] }) {
    this.events = options.events;
    this.topics = options.topics;
  }

  protected abstract getSubscriberId(): string;

  protected abstract determineDestinationTopic(
    params: EventParams,
  ): string | undefined;

  /**
   * Subscribes itself to the topic(s),
   * after which events potentially can be received
   * and processed by {@link EventRouter.onEvent}.
   */
  async subscribe(): Promise<void> {
    if (this.subscribed) {
      return;
    }

    this.subscribed = true;

    await this.events.subscribe({
      id: this.getSubscriberId(),
      topics: this.topics,
      onEvent: this.onEvent.bind(this),
    });
  }

  async onEvent(params: EventParams): Promise<void> {
    const topic = this.determineDestinationTopic(params);

    if (!topic) {
      return;
    }

    // republish to different topic
    await this.events.publish({
      ...params,
      topic,
    });
  }
}
