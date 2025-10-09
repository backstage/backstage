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

import {
  useApi,
  alertApiRef,
  fetchApiRef,
  discoveryApiRef,
} from '@backstage/frontend-plugin-api';
import { useCallback } from 'react';
import useAsync from 'react-use/esm/useAsync';
import useAsyncFn from 'react-use/esm/useAsyncFn';
import { isError } from '@backstage/errors';

interface Session {
  id: string;
  clientName?: string;
  clientId: string;
  redirectUri: string;
  scopes?: string[];
  responseType?: string;
  state?: string;
  nonce?: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
  expiresAt?: string;
}

type ConsentState =
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'loaded'; session: Session }
  | { status: 'submitting'; session: Session; action: 'approve' | 'reject' }
  | { status: 'completed'; action: 'approve' | 'reject' };

export const useConsentSession = (opts: { sessionId?: string }) => {
  const alertApi = useApi(alertApiRef);
  const fetchApi = useApi(fetchApiRef);
  const discoveryApi = useApi(discoveryApiRef);
  const { sessionId } = opts;

  const sessionState = useAsync(async () => {
    if (!sessionId) {
      throw new Error('Session ID is missing');
    }

    const baseUrl = await discoveryApi.getBaseUrl('auth');
    const response = await fetchApi.fetch(
      `${baseUrl}/v1/sessions/${sessionId}`,
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return (await response.json()) as Session;
  }, [sessionId]);

  const [actionState, handleActionInternal] = useAsyncFn(
    async (action: 'approve' | 'reject', session: Session) => {
      const baseUrl = await discoveryApi.getBaseUrl('auth');
      const response = await fetchApi.fetch(
        `${baseUrl}/v1/sessions/${session.id}/${action}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.redirectUrl) {
        window.location.href = result.redirectUrl;
      }

      return { action, redirectUrl: result.redirectUrl };
    },
    [discoveryApi, fetchApi],
  );

  const getConsentState = (): ConsentState => {
    if (actionState.value) {
      return { status: 'completed', action: actionState.value.action };
    }
    if (actionState.loading && sessionState.value) {
      return {
        status: 'submitting',
        session: sessionState.value,
        action: 'approve', // This will be set properly when called
      };
    }
    if (sessionState.error) {
      return {
        status: 'error',
        error: isError(sessionState.error)
          ? sessionState.error.message
          : 'Failed to load consent request',
      };
    }
    if (sessionState.value) {
      return { status: 'loaded', session: sessionState.value };
    }
    return { status: 'loading' };
  };

  const state = getConsentState();
  return {
    state,
    handleAction: useCallback(
      async (action: 'approve' | 'reject') => {
        if (state.status !== 'loaded') return;

        try {
          await handleActionInternal(action, state.session);
        } catch (err) {
          alertApi.post({
            message: isError(err) ? err.message : `Failed to ${action} consent`,
            severity: 'error',
          });
        }
      },
      [state, handleActionInternal, alertApi],
    ),
  };
};
