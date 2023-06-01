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

import { SignalsService } from '@backstage/backend-plugin-api';

/** @public */
export class TestSignalsService implements SignalsService {
  readonly published: {
    message: unknown;
    topic?: string;
    entityRefs?: string[];
  }[] = [];
  readonly subscribed: {
    pluginId: string;
    topic?: string;
  }[] = [];
  isConnected: boolean = false;

  async connect() {
    this.isConnected = true;
  }

  async disconnect() {
    this.isConnected = false;
  }

  async publish(
    message: unknown,
    target?: {
      topic?: string;
      entityRefs?: string[];
    },
  ) {
    this.published.push({
      message,
      topic: target?.topic,
      entityRefs: target?.entityRefs,
    });
  }

  async subscribe(
    pluginId: string,
    _: (data: unknown) => void,
    topic?: string,
  ) {
    this.subscribed.push({ pluginId, topic });
  }

  async unsubscribe(pluginId: string, topic?: string) {
    const idx = this.subscribed.findIndex(
      s => s.pluginId === pluginId && s.topic === topic,
    );
    if (idx >= 0) {
      this.subscribed.splice(idx, 1);
    }
  }
}
