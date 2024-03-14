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

import { useEffect, useCallback } from 'react';
import {
  discoveryApiRef,
  fetchApiRef,
  storageApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { useAsync, useMountEffect } from '@react-hookz/web';
import { ResponseError } from '@backstage/errors';

/**
 * @public
 * A hook that will refresh the cookie when it is about to expire.
 */
export function useCookieAuthRefresh(params: {
  // The plugin ID to used for discovering the API origin
  pluginId: string;
  // Options for configuring the refresh cookie endpoint
  options?: {
    // The path to used for calling the refresh cookie endpoint, default to '/cookie'
    path?: string;
  };
}) {
  const { pluginId, options: { path = '/cookie' } = {} } = params;

  const fetchApi = useApi(fetchApiRef);
  const storageApi = useApi(storageApiRef);
  const discoveryApi = useApi(discoveryApiRef);

  const store = storageApi.forBucket(`${pluginId}-auth-cookie-storage`);

  const [state, actions] = useAsync<{ expiresAt: string }>(async () => {
    const apiOrigin = await discoveryApi.getBaseUrl(pluginId);
    const requestUrl = `${apiOrigin}${path}`;
    const response = await fetchApi.fetch(`${requestUrl}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      throw await ResponseError.fromResponse(response);
    }
    return await response.json();
  });

  useMountEffect(actions.execute);

  const refresh = useCallback(
    (options: { expiresAt: string }) => {
      // Randomize the refreshing margin to avoid all tabs refreshing at the same time
      const margin = (1 + 3 * Math.random()) * 60000;
      const delay = Date.parse(options.expiresAt) - Date.now() - margin;
      const timeout = setTimeout(actions.execute, delay);
      return () => clearTimeout(timeout);
    },
    [actions],
  );

  useEffect(() => {
    if (!state.result) return () => {};

    store.set('expiresAt', state.result.expiresAt);

    let cancel = refresh(state.result);

    const observable = store.observe$<string>('expiresAt');
    const subscription = observable.subscribe(({ value }) => {
      if (!value) return;
      cancel();
      cancel = refresh({ expiresAt: value });
    });

    return () => {
      cancel();
      subscription.unsubscribe();
    };
  }, [state, refresh, store]);

  return {
    loading: state.status === 'loading',
    error: state.error,
    value: state.result,
    retry: actions.execute,
  };
}
