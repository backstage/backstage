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

import { useEffect, useState, useCallback } from 'react';
import { ApiRef, useApi } from '@backstage/core-plugin-api';
import { useAsync, useMountEffect } from '@react-hookz/web';
import { AuthApi } from '../../types';

type CookieAuthRefreshMessage = MessageEvent<{
  action: string;
  payload: {
    expiresAt: string;
  };
}>;

export function useCookieAuthRefresh<T extends AuthApi>({
  apiRef,
}: {
  apiRef: ApiRef<T>;
}) {
  const api = useApi(apiRef);

  const [channel] = useState(
    () => new BroadcastChannel(`${apiRef.id}-auth-cookie-channel`),
  );

  const [state, actions] = useAsync(async () => await api.getCookie());

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

    channel.postMessage({
      action: 'COOKIE_REFRESHED',
      payload: state.result,
    });

    let cancel = refresh(state.result);

    const handleMessage = (event: CookieAuthRefreshMessage): void => {
      const { action, payload } = event.data;
      if (action === 'COOKIE_REFRESHED') {
        cancel();
        cancel = refresh(payload);
      }
    };

    channel.addEventListener('message', handleMessage);

    return () => {
      cancel();
      channel.removeEventListener('message', handleMessage);
    };
  }, [state, refresh, channel]);

  return { state, actions };
}
