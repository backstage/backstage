/*
 * Copyright 2024 The Backstage Authors
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
  HistoryConsumer,
  HistoryConsumerConnection,
  SubscriptionEvent,
} from '../consumers/types';

export function createMockConsumer(subscriptionId: string): HistoryConsumer & {
  received: SubscriptionEvent[];
} {
  const received: SubscriptionEvent[] = [];

  return {
    getConsumerName(): string {
      return subscriptionId;
    },
    async connect(connection: HistoryConsumerConnection) {
      const subscription = connection.subscribe({
        subscriptionId,
        startAt: 'beginning',
      });
      for await (const page of subscription) {
        for (const entry of page) {
          received.push(entry);
        }
      }
    },
    received,
  };
}
