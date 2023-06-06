/*
 * Copyright 2023 The Backstage Authors
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

import { EventBroker, EventPublisher } from '@backstage/plugin-events-node';
import { Logger } from 'winston';
import { SignalsApi } from './SignalsApi';

/**
 * Signals client for backend plugins
 *
 * @public
 */
export class DefaultSignalsClient implements SignalsApi, EventPublisher {
  private constructor(
    private readonly pluginId: string,
    private readonly logger?: Logger,
    private eventBroker?: EventBroker,
  ) {}

  static forPlugin(
    pluginId: string,
    deps?: {
      logger: Logger;
      eventBroker: EventBroker;
    },
  ): DefaultSignalsClient {
    return new DefaultSignalsClient(pluginId, deps?.logger, deps?.eventBroker);
  }

  async publish(
    data: any,
    target?: { topic?: string; targetOwnershipEntityRefs?: string[] },
  ) {
    if (!this.eventBroker) {
      throw new Error('EventBroker not initialized');
    }

    this.logger?.debug(`Publishing signal from ${this.pluginId}`);

    await this.eventBroker.publish({
      topic: 'signals',
      eventPayload: data,
      metadata: {
        pluginId: this.pluginId,
        topic: target?.topic,
        targetOwnershipEntityRefs: target?.targetOwnershipEntityRefs,
      },
    });
  }

  async setEventBroker(eventBroker: EventBroker): Promise<void> {
    this.eventBroker = eventBroker;
  }
}
