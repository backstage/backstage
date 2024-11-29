/*
 * Copyright 2020 The Backstage Authors
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
  EntityProvider,
  EntityProviderConnection,
} from '@backstage/plugin-catalog-node';
import { EventParams, EventsService } from '@backstage/plugin-events-node';
import { Logger } from 'winston';

export class DemoEventBasedEntityProvider implements EntityProvider {
  private readonly logger: Logger;
  private readonly events: EventsService;
  private readonly topics: string[];

  constructor(opts: {
    events: EventsService;
    logger: Logger;
    topics: string[];
  }) {
    this.events = opts.events;
    this.logger = opts.logger;
    this.topics = opts.topics;
  }

  async subscribe() {
    await this.events.subscribe({
      id: 'DemoEventBasedEntityProvider',
      topics: this.topics,
      onEvent: async (params: EventParams): Promise<void> => {
        this.logger.info(
          `onEvent: topic=${params.topic}, metadata=${JSON.stringify(
            params.metadata,
          )}, payload=${JSON.stringify(params.eventPayload)}`,
        );
      },
    });
  }

  async connect(_: EntityProviderConnection): Promise<void> {
    // not doing anything here
  }

  getProviderName(): string {
    return DemoEventBasedEntityProvider.name;
  }
}
