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

import { useEffect, useCallback, useMemo } from 'react';
import {
  discoveryApiRef,
  fetchApiRef,
  useApi,
} from '@backstage/core-plugin-api';
import { useAsync, useMountEffect } from '@react-hookz/web';
import { ResponseError } from '@backstage/errors';

const COOKIE_PATH = '/.backstage/auth/v1/cookie';
const ONE_YEAR_MS = 365 * 24 * 3600_000;

/**
 * @public
 * A hook that will refresh the cookie when it is about to expire.
 * @param options - Options for configuring the refresh cookie endpoint
 */
export function useCookieAuthRefresh(options: {
  // The plugin id used for discovering the API origin
  pluginId: string;
}):
  | { status: 'loading' }
  | { status: 'error'; error: Error; retry: () => void }
  | { status: 'success'; data: { expiresAt: string } } {
  const { pluginId } = options ?? {};
  const fetchApi = useApi(fetchApiRef);
  const discoveryApi = useApi(discoveryApiRef);

  const channel = useMemo(() => {
    return 'BroadcastChannel' in window
      ? new BroadcastChannel(`${pluginId}-auth-cookie-expires-at`)
      : null;
  }, [pluginId]);

  const [state, actions] = useAsync<{ expiresAt: string }>(async () => {
    const apiOrigin = await discoveryApi.getBaseUrl(pluginId);
    const requestUrl = `${apiOrigin}${COOKIE_PATH}`;
    const response = await fetchApi.fetch(`${requestUrl}`, {
      credentials: 'include',
    });
    if (!response.ok) {
      // If we get a 404 from the cookie endpoint we assume that it does not
      // exist and cookie auth is not needed. For all active tabs we don't
      // schedule another refresh for the forseeable future, but new tabs will
      // still check if cookie auth has been added to the deployment.
      // TODO(Rugvip): Once the legacy backend system is no longer supported we should remove this check
      if (response.status === 404) {
        return { expiresAt: new Date(Date.now() + ONE_YEAR_MS) };
      }
      throw await ResponseError.fromResponse(response);
    }
    const data = await response.json();
    if (!data.expiresAt) {
      throw new Error('No expiration date found in response');
    }
    return data;
  });

  useMountEffect(actions.execute);

  const retry = useCallback(() => {
    actions.execute();
  }, [actions]);

  const refresh = useCallback(
    (params: { expiresAt: string }) => {
      // Randomize the refreshing margin with a margin of 1-4 minutes to avoid all tabs refreshing at the same time
      // It cannot be less than 5 minutes otherwise the backend will return the same expiration date
      const margin = (1 + 3 * Math.random()) * 60000;
      const delay = Date.parse(params.expiresAt) - Date.now() - margin;
      const timeout = setTimeout(retry, delay);
      return () => clearTimeout(timeout);
    },
    [retry],
  );

  useEffect(() => {
    // Only schedule a refresh if we have a successful response
    if (state.status !== 'success' || !state.result) {
      return () => {};
    }
    channel?.postMessage({
      action: 'COOKIE_REFRESH_SUCCESS',
      payload: state.result,
    });
    let cancel = refresh(state.result);
    const listener = (
      event: MessageEvent<{ action: string; payload: { expiresAt: string } }>,
    ) => {
      const { action, payload } = event.data;
      if (action === 'COOKIE_REFRESH_SUCCESS') {
        cancel();
        cancel = refresh(payload);
      }
    };
    channel?.addEventListener('message', listener);
    return () => {
      cancel();
      channel?.removeEventListener('message', listener);
    };
  }, [state, refresh, channel]);

  // Initialising
  if (state.status === 'not-executed') {
    return { status: 'loading' };
  }

  // First refresh or retrying without any success before
  // Possible state transitions:
  // e.g. not-executed -> loading (first-refresh)
  // e.g. not-executed -> loading (first-refresh) -> error -> loading (manual-retry)
  if (state.status === 'loading' && !state.result) {
    return { status: 'loading' };
  }

  // Retrying after having succeeding at least once
  // Current state is: { status: 'loading', result: {...}, error: undefined | Error }
  // e.g. not-executed -> loading (first-refresh) -> success -> loading (scheduled-refresh) -> error -> loading (manual-retry)
  if (state.status === 'loading' && state.error) {
    return { status: 'loading' };
  }

  // Something went wrong during any situation of a refresh
  if (state.status === 'error' && state.error) {
    return { status: 'error', error: state.error, retry };
  }

  // At this point it should be safe to assume that we have a successful refresh
  return { status: 'success', data: state.result! };
}
