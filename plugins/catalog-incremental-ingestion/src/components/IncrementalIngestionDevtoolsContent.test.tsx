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

import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import {
  alertApiRef,
  discoveryApiRef,
  fetchApiRef,
} from '@backstage/core-plugin-api';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { IncrementalIngestionDevtoolsContent } from './IncrementalIngestionDevtoolsContent';

const createJsonResponse = (payload: unknown, status = 200) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const setupApis = (fetchImpl: jest.Mock) => {
  const discoveryApi = {
    getBaseUrl: jest.fn().mockResolvedValue('http://example.test/api/catalog'),
  };
  const alertApi = {
    post: jest.fn(),
  };
  return {
    apis: [
      [discoveryApiRef, discoveryApi],
      [fetchApiRef, { fetch: fetchImpl }],
      [alertApiRef, alertApi],
    ] as const,
  };
};

describe('IncrementalIngestionDevtoolsContent', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows loading state while data is being fetched', () => {
    const pending = new Promise<Response>(() => {});
    const fetchMock = jest.fn().mockReturnValue(pending);

    const { apis } = setupApis(fetchMock);
    render(
      <TestApiProvider apis={apis}>
        <IncrementalIngestionDevtoolsContent />
      </TestApiProvider>,
    );

    expect(screen.getByTestId('progress')).toBeInTheDocument();
  });

  it('shows error state when loading fails', async () => {
    const fetchMock = jest.fn().mockRejectedValue(new Error('boom'));

    const { apis } = setupApis(fetchMock);
    await renderInTestApp(
      <TestApiProvider apis={apis}>
        <IncrementalIngestionDevtoolsContent />
      </TestApiProvider>,
    );

    expect((await screen.findAllByText(/boom/i)).length).toBeGreaterThan(0);
  });

  it('enables and disables actions based on provider status', async () => {
    const fetchMock = jest.fn((url: string) => {
      if (url.endsWith('/incremental/health')) {
        return Promise.resolve(createJsonResponse({ healthy: true }));
      }
      if (url.endsWith('/incremental/providers')) {
        return Promise.resolve(
          createJsonResponse({
            success: true,
            providers: ['interstitial-provider', 'processing-provider'],
          }),
        );
      }
      if (url.endsWith('/incremental/providers/interstitial-provider')) {
        return Promise.resolve(
          createJsonResponse({
            success: true,
            status: { current_action: 'interstitial' },
          }),
        );
      }
      if (url.endsWith('/incremental/providers/processing-provider')) {
        return Promise.resolve(
          createJsonResponse({
            success: true,
            status: { current_action: 'processing' },
          }),
        );
      }

      throw new Error(`Unhandled url in test: ${url}`);
    });

    const { apis } = setupApis(fetchMock);
    await renderInTestApp(
      <TestApiProvider apis={apis}>
        <IncrementalIngestionDevtoolsContent />
      </TestApiProvider>,
    );

    await screen.findByText('interstitial-provider');
    await screen.findByText('processing-provider');

    const triggerButtons = await screen.findAllByLabelText('Trigger');
    const cleanupButtons = await screen.findAllByLabelText('Cleanup History');

    expect(triggerButtons).toHaveLength(2);
    expect(cleanupButtons).toHaveLength(2);

    expect(triggerButtons[0]).toBeEnabled();
    expect(cleanupButtons[0]).toBeDisabled();
    expect(triggerButtons[1]).toBeDisabled();
    expect(cleanupButtons[1]).toBeDisabled();
  });

  it('disables all action buttons while a confirmation dialog is open', async () => {
    const fetchMock = jest.fn((url: string) => {
      if (url.endsWith('/incremental/health')) {
        return Promise.resolve(createJsonResponse({ healthy: true }));
      }
      if (url.endsWith('/incremental/providers')) {
        return Promise.resolve(
          createJsonResponse({
            success: true,
            providers: ['resting-provider', 'interstitial-provider'],
          }),
        );
      }
      if (url.endsWith('/incremental/providers/resting-provider')) {
        return Promise.resolve(
          createJsonResponse({
            success: true,
            status: { current_action: 'resting' },
          }),
        );
      }
      if (url.endsWith('/incremental/providers/interstitial-provider')) {
        return Promise.resolve(
          createJsonResponse({
            success: true,
            status: { current_action: 'interstitial' },
          }),
        );
      }

      throw new Error(`Unhandled url in test: ${url}`);
    });

    const { apis } = setupApis(fetchMock);
    await renderInTestApp(
      <TestApiProvider apis={apis}>
        <IncrementalIngestionDevtoolsContent />
      </TestApiProvider>,
    );

    await screen.findByText('resting-provider');
    await screen.findByText('interstitial-provider');

    const cleanupButtons = await screen.findAllByLabelText('Cleanup History');
    fireEvent.click(cleanupButtons[0]);

    expect(
      await screen.findByText('Confirm Provider Action'),
    ).toBeInTheDocument();

    const triggerButtons = await screen.findAllByLabelText('Trigger');
    const statusRawButtons = await screen.findAllByLabelText('Status Raw');

    expect(triggerButtons[1]).toBeDisabled();
    expect(statusRawButtons[0]).toBeDisabled();
  });
});
