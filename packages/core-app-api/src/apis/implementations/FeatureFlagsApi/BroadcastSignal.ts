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

import ZenObservable from 'zen-observable';

import { FeatureFlagState } from '@backstage/core-plugin-api';
import type { Observable } from '@backstage/types';

type MessageData = {
  name: string;
  state: FeatureFlagState;
  persisted: boolean;
};

function isValidMessage(ev: MessageEvent): ev is MessageEvent<MessageData> {
  return (
    ev.data &&
    typeof ev.data.name === 'string' &&
    typeof ev.data.state === 'number' &&
    typeof ev.data.persisted === 'boolean'
  );
}

export class BroadcastSignal {
  #listenBroadcast: BroadcastChannel;
  #postBroadcast: BroadcastChannel;

  constructor(
    onUpdate: (
      name: string,
      state: FeatureFlagState,
      persisted: boolean,
    ) => void,
  ) {
    this.#postBroadcast = new BroadcastChannel('feature-flags');

    this.#listenBroadcast = new BroadcastChannel('feature-flags');
    this.#listenBroadcast.addEventListener('message', ev => {
      if (isValidMessage(ev)) {
        onUpdate(ev.data.name, ev.data.state, ev.data.persisted);
      }
    });
  }

  signal(name: string, state: FeatureFlagState, persisted: boolean) {
    this.#postBroadcast.postMessage({ name, state, persisted });
  }

  observe$(name: string): Observable<boolean> {
    return new ZenObservable(subscriber => {
      const handleMessage = (ev: MessageEvent) => {
        if (isValidMessage(ev) && ev.data.name === name) {
          subscriber.next(ev.data.state === FeatureFlagState.Active);
        }
      };
      this.#listenBroadcast.addEventListener('message', handleMessage);
      return () => {
        this.#listenBroadcast.removeEventListener('message', handleMessage);
      };
    });
  }
}
