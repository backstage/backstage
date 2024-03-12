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

import React, { ReactNode, useEffect, useState, useCallback } from 'react';
import { ErrorPanel } from '@backstage/core-components';
import { techdocsApiRef } from '@backstage/plugin-techdocs-react';
import { useApi, useApp } from '@backstage/core-plugin-api';
import useAsyncRetry from 'react-use/lib/useAsyncRetry';
import { Button } from '@material-ui/core';

type TechDocsRefreshCookieMessage = MessageEvent<{
  action: string;
  payload: {
    expiresAt: string;
  };
}>;

function useTechDocsCookie() {
  const techdocsApi = useApi(techdocsApiRef);

  const { retry, ...state } = useAsyncRetry(async () => {
    return await techdocsApi.getCookie();
  }, [techdocsApi]);

  const refresh = useCallback(
    (expiresAt: string) => {
      // Randomize the refreshing margin to avoid all tabs refreshing at the same time
      const refreshingMargin = (1 + 3 * Math.random()) * 60000;
      const delay = Date.parse(expiresAt) - Date.now() - refreshingMargin;
      const timeout = setTimeout(retry, delay);
      return () => clearTimeout(timeout);
    },
    [retry],
  );

  return { ...state, retry, refresh };
}

export function TechDocsAuthProvider({ children }: { children: ReactNode }) {
  const app = useApp();
  const { Progress } = app.getComponents();

  const [channel] = useState(new BroadcastChannel('techdocs-cookie-refresh'));

  const { loading, error, value, retry, refresh } = useTechDocsCookie();

  useEffect(() => {
    if (!value) return () => {};

    channel.postMessage({
      action: 'TECHDOCS_COOKIE_REFRESHED',
      payload: value,
    });

    let cancel = refresh(value.expiresAt);

    const handleMessage = (event: TechDocsRefreshCookieMessage): void => {
      const { action, payload } = event.data;
      if (action === 'TECHDOCS_COOKIE_REFRESHED') {
        cancel();
        cancel = refresh(payload.expiresAt);
      }
    };

    channel.addEventListener('message', handleMessage);

    return () => {
      cancel();
      channel.removeEventListener('message', handleMessage);
    };
  }, [value, refresh, channel]);

  if (error) {
    return (
      <ErrorPanel error={error}>
        <Button variant="outlined" onClick={retry}>
          Retry
        </Button>
      </ErrorPanel>
    );
  }

  if (loading) {
    return <Progress />;
  }

  return children;
}
