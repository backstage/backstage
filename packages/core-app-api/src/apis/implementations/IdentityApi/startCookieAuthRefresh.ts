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

import { DiscoveryApi, ErrorApi, FetchApi } from '@backstage/core-plugin-api';

const PLUGIN_ID = 'app';
const CHANNEL_ID = `${PLUGIN_ID}-auth-cookie-expires-at`;

const MIN_BASE_DELAY_MS = 5 * 60_000;

const ERROR_BACKOFF_START = 5_000;
const ERROR_BACKOFF_FACTOR = 2;
const ERROR_BACKOFF_MAX = 5 * 60_000;

// Messaging implementation and IDs must match
//   plugins/auth-react/src/hooks/useCookieAuthRefresh/useCookieAuthRefresh.tsx
export function startCookieAuthRefresh({
  discoveryApi,
  fetchApi,
  errorApi,
}: {
  discoveryApi: DiscoveryApi;
  fetchApi: FetchApi;
  errorApi: ErrorApi;
}) {
  let stopped = false;
  let timeout: NodeJS.Timeout | undefined;
  let firstError = true;
  let errorBackoff = ERROR_BACKOFF_START;

  const channel =
    'BroadcastChannel' in window ? new BroadcastChannel(CHANNEL_ID) : undefined;

  // Randomize the refreshing margin with a margin of 1-4 minutes to avoid all tabs refreshing at the same time
  const getDelay = (expiresAt: number) => {
    const margin = (1 + 3 * Math.random()) * 60000;
    const delay = Math.max(expiresAt - Date.now(), MIN_BASE_DELAY_MS) - margin;
    return delay;
  };

  const refresh = async () => {
    try {
      const baseUrl = await discoveryApi.getBaseUrl(PLUGIN_ID);
      const requestUrl = `${baseUrl}/.backstage/auth/v1/cookie`;
      const res = await fetchApi.fetch(requestUrl, {
        credentials: 'include',
      });

      if (!res.ok) {
        throw new Error(
          `Request failed with status ${res.status} ${res.statusText}, see request towards ${requestUrl} for more details`,
        );
      }

      const data = await res.json();
      if (!data.expiresAt) {
        throw new Error('No expiration date in response');
      }

      const expiresAt = Date.parse(data.expiresAt);
      if (Number.isNaN(expiresAt)) {
        throw new Error('Invalid expiration date in response');
      }

      firstError = true;

      channel?.postMessage({
        action: 'COOKIE_REFRESH_SUCCESS',
        payload: { expiresAt: new Date(expiresAt).toISOString() },
      });

      scheduleRefresh(getDelay(expiresAt));
    } catch (error) {
      // Ignore the first error after successful requests
      if (firstError) {
        firstError = false;
        errorBackoff = ERROR_BACKOFF_START;
      } else {
        errorBackoff = Math.min(
          ERROR_BACKOFF_MAX,
          errorBackoff * ERROR_BACKOFF_FACTOR,
        );
        // eslint-disable-next-line no-console
        console.error('Session cookie refresh failed', error);
        errorApi.post(
          new Error(
            `Session refresh failed, see developer console for details`,
          ),
        );
      }

      scheduleRefresh(errorBackoff);
    }
  };

  const onMessage = (
    event: MessageEvent<
      | {
          action: 'COOKIE_REFRESH_SUCCESS';
          payload: { expiresAt: string };
        }
      | object
    >,
  ) => {
    const { data } = event;
    if (data === null || typeof data !== 'object') {
      return;
    }
    if ('action' in data && data.action === 'COOKIE_REFRESH_SUCCESS') {
      const expiresAt = Date.parse(data.payload.expiresAt);
      if (Number.isNaN(expiresAt)) {
        // eslint-disable-next-line no-console
        console.warn(
          'Received invalid expiration from session refresh channel',
        );
        return;
      }

      scheduleRefresh(getDelay(expiresAt));
    }
  };

  function scheduleRefresh(delayMs: number) {
    if (stopped) {
      return;
    }
    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(refresh, delayMs);
  }

  channel?.addEventListener('message', onMessage);
  refresh();

  return () => {
    stopped = true;
    if (timeout) {
      clearTimeout(timeout);
    }
    channel?.removeEventListener('message', onMessage);
    channel?.close();
  };
}
