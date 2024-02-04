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
import { useApiHolder } from '@backstage/core-plugin-api';
import { JsonObject } from '@backstage/types';
import { useEffect, useMemo, useState } from 'react';

/** @public */
export const useSignal = (channel: string) => {
  const apiHolder = useApiHolder();
  // Use apiHolder instead useApi in case signalApi is not available in the
  // backstage instance this is used
  const signals = apiHolder.get(signalApiRef);
  const [lastSignal, setLastSignal] = useState<JsonObject | null>(null);
  useEffect(() => {
    let unsub: null | (() => void) = null;
    if (signals) {
      const { unsubscribe } = signals.subscribe(channel, (msg: JsonObject) => {
        setLastSignal(msg);
      });
      unsub = unsubscribe;
    }
    return () => {
      if (signals && unsub) {
        unsub();
      }
    };
  }, [signals, channel]);

  // Can be used to fallback (for example to long polling) if signals are not available in the system
  const isSignalsAvailable = useMemo(() => !signals, [signals]);

  return { lastSignal, isSignalsAvailable };
};
