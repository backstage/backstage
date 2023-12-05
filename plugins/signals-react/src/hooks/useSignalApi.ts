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
import { signalApiRef } from '../api';
import { useApi } from '@backstage/core-plugin-api';
import { JsonObject } from '@backstage/types';
import { useEffect, useState } from 'react';

/** @public */
export const useSignalApi = (
  topic: string,
  onMessage: (message: JsonObject) => void,
) => {
  const signals = useApi(signalApiRef);
  const [subscription, setSubscription] = useState<null | string>(null);
  useEffect(() => {
    if (!subscription) {
      const sub = signals.subscribe(topic, onMessage);
      setSubscription(sub);
    }
  }, [subscription, signals, onMessage, topic]);

  useEffect(() => {
    return () => {
      if (subscription) {
        signals.unsubscribe(subscription);
      }
    };
  }, [subscription, signals, topic]);
};
