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

import { renderInTestApp } from '@backstage/frontend-test-utils';
import { ConfigReader } from '@backstage/config';
import {
  scmAuthApiRef,
  ScmIntegrationsApi,
  scmIntegrationsApiRef,
} from '@backstage/integration-react';
import { aiGatewayApiRef } from '@backstage/plugin-ai-gateway-react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ReviewPage } from './ReviewPage';

describe('ReviewPage', () => {
  const originalFetch = global.fetch;
  afterEach(() => {
    global.fetch = originalFetch;
  });

  it('fetches the diff from GitHub with the user token and renders findings', async () => {
    const fetchMock = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => [
        { filename: 'a.ts', status: 'modified', patch: '@@ -1 +1 @@\n-a\n+b' },
      ],
    });
    global.fetch = fetchMock;
    const getCredentials = jest
      .fn()
      .mockResolvedValue({ token: 'user-token', headers: {} });
    const generateObject = jest.fn().mockResolvedValue({
      object: {
        summary: 'Changes a to b',
        findings: [
          { file: 'a.ts', line: 1, severity: 'warning', comment: 'Rename it' },
          { nonsense: true },
        ],
      },
      finishReason: 'stop',
      usage: { inputTokens: 1, outputTokens: 1 },
    });
    async function* textStream() {
      yield 'It ';
      yield 'changes a.';
    }
    const streamText = jest.fn().mockReturnValue({
      textStream: textStream(),
      response: Promise.resolve({}),
    });

    await renderInTestApp(<ReviewPage />, {
      apis: [
        [scmAuthApiRef, { getCredentials }],
        [
          scmIntegrationsApiRef,
          ScmIntegrationsApi.fromConfig(
            new ConfigReader({
              integrations: { github: [{ host: 'github.com' }] },
            }),
          ),
        ],
        [
          aiGatewayApiRef,
          { generateObject, streamText, generateText: jest.fn() },
        ],
      ],
    });

    await userEvent.type(
      screen.getByLabelText('Pull request URL'),
      'https://github.com/acme/widgets/pull/7',
    );
    await userEvent.type(
      screen.getByLabelText('Review instructions'),
      'Focus on naming',
    );
    await userEvent.click(screen.getByRole('button', { name: 'Review' }));

    expect(await screen.findByText('Changes a to b')).toBeInTheDocument();
    expect(await screen.findByText(/Rename it/)).toBeInTheDocument();
    expect(getCredentials).toHaveBeenCalledWith({
      url: 'https://github.com/acme/widgets',
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toContain(
      'https://api.github.com/repos/acme/widgets/pulls/7/files',
    );
    expect(fetchMock.mock.calls[0][1].headers.Authorization).toBe(
      'Bearer user-token',
    );
    const request = generateObject.mock.calls[0][0];
    expect(request.prompt).toContain('Focus on naming');
    expect(request.prompt).toContain('+b');
    expect(JSON.stringify(request)).not.toContain('user-token');

    await userEvent.click(
      screen.getByRole('button', { name: 'Explain this PR' }),
    );
    expect(await screen.findByText('It changes a.')).toBeInTheDocument();
  });

  it('pre-fills the pull request from the route and updates the route on submit', async () => {
    global.fetch = jest
      .fn()
      .mockResolvedValue({ ok: true, json: async () => [] });
    const generateObject = jest.fn().mockResolvedValue({
      object: { summary: 'Nothing here', findings: [] },
      finishReason: 'stop',
      usage: { inputTokens: 1, outputTokens: 1 },
    });
    await renderInTestApp(<ReviewPage />, {
      initialRouteEntries: ['/github/acme/widgets/7'],
      apis: [
        [
          scmAuthApiRef,
          { getCredentials: jest.fn().mockResolvedValue({ token: 't' }) },
        ],
        [
          scmIntegrationsApiRef,
          ScmIntegrationsApi.fromConfig(
            new ConfigReader({
              integrations: { github: [{ host: 'github.com' }] },
            }),
          ),
        ],
        [
          aiGatewayApiRef,
          { generateObject, streamText: jest.fn(), generateText: jest.fn() },
        ],
      ],
    });

    const input = screen.getByLabelText('Pull request URL');
    expect(input).toHaveValue('https://github.com/acme/widgets/pull/7');

    await userEvent.clear(input);
    await userEvent.type(input, 'https://github.com/acme/other/pull/9');
    await userEvent.click(screen.getByRole('button', { name: 'Review' }));
    expect(await screen.findByText('Nothing here')).toBeInTheDocument();
    expect(input).toHaveValue('https://github.com/acme/other/pull/9');
    expect((global.fetch as jest.Mock).mock.calls[0][0]).toContain(
      '/repos/acme/other/pulls/9/files',
    );
  });
});
