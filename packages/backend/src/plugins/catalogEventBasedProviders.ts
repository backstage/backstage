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
import { EventParams, EventSubscriber } from '@backstage/plugin-events-node';
import { Logger } from 'winston';
import { PluginEnvironment } from '../types';

class DemoEventBasedEntityProvider implements EntityProvider, EventSubscriber {
  constructor(
    private readonly logger: Logger,
    private readonly topics: string[],
  ) {}

  async onEvent(params: EventParams): Promise<void> {
    this.logger.info(
      `onEvent: topic=${params.topic}, metadata=${JSON.stringify(
        params.metadata,
      )}, payload=${JSON.stringify(params.eventPayload)}`,
    );
  }

  supportsEventTopics(): string[] {
    return this.topics;
  }

  async connect(_: EntityProviderConnection): Promise<void> {
    // not doing anything here
  }

  getProviderName(): string {
    return DemoEventBasedEntityProvider.name;
  }
}

export default async function createCatalogEventBasedProviders(
  env: PluginEnvironment,
): Promise<Array<EntityProvider & EventSubscriber>> {
  const providers: Array<
    (EntityProvider & EventSubscriber) | Array<EntityProvider & EventSubscriber>
  > = [];
  providers.push(new DemoEventBasedEntityProvider(env.logger, ['example']));
  // add your event-based entity providers here
  return providers.flat();
}
