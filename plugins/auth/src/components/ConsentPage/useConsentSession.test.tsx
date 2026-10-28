/*
 * Copyright 2026 The Backstage Authors
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
  discoveryApiRef,
  fetchApiRef,
  toastApiRef,
} from '@backstage/frontend-plugin-api';
import { TestApiProvider } from '@backstage/test-utils';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useConsentSession } from './useConsentSession';

function ConsentSession() {
  const { state, handleAction } = useConsentSession({
    sessionId: 'session-id',
  });
  return (
    <>
      <span>{state.status}</span>
      <button
        disabled={state.status !== 'loaded'}
        onClick={() => handleAction('approve')}
      >
        Approve
      </button>
      <button
        disabled={state.status !== 'loaded'}
        onClick={() => handleAction('reject')}
      >
        Reject
      </button>
    </>
  );
}

it('reports failed consent actions as danger toasts and allows retrying', async () => {
  const post = jest.fn();
  const fetch = jest
    .fn()
    .mockResolvedValueOnce(new Response(JSON.stringify({ id: 'session-id' })))
    .mockResolvedValueOnce(
      new Response(null, { status: 500, statusText: 'Server Error' }),
    )
    .mockRejectedValueOnce(new Error('Network unavailable'))
    .mockResolvedValueOnce(new Response(JSON.stringify({})));
  render(
    <TestApiProvider
      apis={[
        [
          discoveryApiRef,
          { getBaseUrl: async () => 'http://example.com/auth' },
        ],
        [fetchApiRef, { fetch }],
        [toastApiRef, { post }],
      ]}
    >
      <ConsentSession />
    </TestApiProvider>,
  );

  await screen.findByText('loaded');
  expect(post).not.toHaveBeenCalled();
  await userEvent.click(screen.getByRole('button', { name: 'Approve' }));
  await screen.findByText('loaded');
  expect(post).toHaveBeenNthCalledWith(1, {
    title: 'HTTP 500: Server Error',
    status: 'danger',
  });
  expect(fetch).toHaveBeenLastCalledWith(
    'http://example.com/auth/v1/sessions/session-id/approve',
    expect.objectContaining({ method: 'POST' }),
  );

  await userEvent.click(screen.getByRole('button', { name: 'Reject' }));
  await screen.findByText('loaded');
  expect(post).toHaveBeenNthCalledWith(2, {
    title: 'Network unavailable',
    status: 'danger',
  });
  expect(fetch).toHaveBeenLastCalledWith(
    'http://example.com/auth/v1/sessions/session-id/reject',
    expect.objectContaining({ method: 'POST' }),
  );

  await userEvent.click(screen.getByRole('button', { name: 'Approve' }));
  await screen.findByText('completed');
  expect(post).toHaveBeenCalledTimes(2);
});
