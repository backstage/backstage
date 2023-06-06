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

import { useEffect, useState } from 'react';
import { SignalsClient } from './SignalsClient';
import {
  discoveryApiRef,
  identityApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { UseSignalsOptions } from './types';

/**
 * Global signals client for frontend
 *
 * @private
 */
let globalSignalsClient: SignalsClient | null;

/**
 * Use signals API to subscribe to events.
 *
 * @param pluginId - plugin id
 * @param onMessage - callback for message
 * @param options - additional options
 *
 * @public
 */
export function useSignals(options: UseSignalsOptions) {
  const [subscriptionKey, setSubscriptionKey] = useState<string | null>(null);
  const identityApi = useApi(identityApiRef);
  const discoveryApi = useApi(discoveryApiRef);

  if (!globalSignalsClient) {
    globalSignalsClient = SignalsClient.create({ identityApi, discoveryApi });
  }

  useEffect(() => {
    if (globalSignalsClient) {
      globalSignalsClient
        .subscribe(options)
        .then(key => setSubscriptionKey(key));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    return () => {
      if (globalSignalsClient && subscriptionKey) {
        globalSignalsClient.unsubscribe(subscriptionKey);
      }
    };
  }, [subscriptionKey]);

  return subscriptionKey;
}
