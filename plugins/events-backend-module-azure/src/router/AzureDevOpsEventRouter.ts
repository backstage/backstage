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

import {
  EventParams,
  EventsService,
  SubTopicEventRouter,
} from '@backstage/plugin-events-node';

/**
 * Subscribes to the generic `azureDevOps` topic
 * and publishes the events under the more concrete sub-topic
 * depending on the `$.eventType` provided.
 *
 * @public
 */
export class AzureDevOpsEventRouter extends SubTopicEventRouter {
  constructor(options: { events: EventsService }) {
    super({
      events: options.events,
      topic: 'azureDevOps',
    });
  }

  protected getSubscriberId(): string {
    return 'AzureDevOpsEventRouter';
  }

  protected determineSubTopic(params: EventParams): string | undefined {
    if ('eventType' in (params.eventPayload as object)) {
      const payload = params.eventPayload as { eventType: string };
      return payload.eventType;
    }

    return undefined;
  }
}
