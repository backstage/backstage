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

import { configApiRef } from '@backstage/frontend-plugin-api';
import { renderInTestApp, TestApiProvider } from '@backstage/test-utils';
import { screen } from '@testing-library/react';
import { Route, Routes } from 'react-router-dom';
import { ConsentPage } from './ConsentPage';
import { useConsentSession } from './useConsentSession';

jest.mock('./useConsentSession');

const mockUseConsentSession = useConsentSession as jest.MockedFunction<
  typeof useConsentSession
>;

function mockLoadedSession(
  session: Partial<
    Extract<
      ReturnType<typeof useConsentSession>['state'],
      { status: 'loaded' }
    >['session']
  >,
) {
  mockUseConsentSession.mockReturnValue({
    state: {
      status: 'loaded',
      session: {
        id: 'session-id',
        clientId: 'client-id',
        redirectUri: 'http://127.0.0.1:8055/callback',
        ...session,
      },
    },
    handleAction: async () => {},
  });
}

async function renderConsentPage() {
  await renderInTestApp(
    <TestApiProvider
      apis={[
        [
          configApiRef,
          {
            getOptionalString: () => 'Backstage Example App',
          },
        ],
      ]}
    >
      <Routes>
        <Route path="/authorize/:sessionId" element={<ConsentPage />} />
      </Routes>
    </TestApiProvider>,
    {
      routeEntries: ['/authorize/session-id'],
    },
  );
}

describe('ConsentPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows CIMD client metadata details', async () => {
    mockLoadedSession({
      clientId: 'https://claude.ai/.well-known/oauth-client/cli.json',
      clientName: 'Claude Code',
      redirectUri: 'http://127.0.0.1:54136/callback',
      scope: 'openid offline_access',
    });

    await renderConsentPage();

    expect(await screen.findByText('Claude Code')).toBeInTheDocument();
    expect(screen.getByText('Client metadata host')).toBeInTheDocument();
    expect(screen.getByText('claude.ai')).toBeInTheDocument();
    expect(screen.getByText('Client metadata URL')).toBeInTheDocument();
    expect(
      screen.getByText('https://claude.ai/.well-known/oauth-client/cli.json'),
    ).toBeInTheDocument();
    expect(screen.getByText('Callback URL')).toBeInTheDocument();
    expect(
      screen.getByText('http://127.0.0.1:54136/callback'),
    ).toBeInTheDocument();
    expect(screen.getByText('Requested scopes')).toBeInTheDocument();
    expect(screen.getByText('openid offline_access')).toBeInTheDocument();
  });

  it('does not show metadata host details for non-URL client IDs', async () => {
    mockLoadedSession({
      clientId: 'dcr-client-id',
      clientName: 'Registered Client',
      redirectUri: 'cursor://callback',
    });

    await renderConsentPage();

    expect(await screen.findByText('Registered Client')).toBeInTheDocument();
    expect(screen.queryByText('Client metadata host')).not.toBeInTheDocument();
    expect(screen.queryByText('Client metadata URL')).not.toBeInTheDocument();
    expect(screen.getByText('Callback URL')).toBeInTheDocument();
    expect(screen.getByText('cursor://callback')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Make sure you trust this application and recognize the callback URL above. Only authorize applications you trust.',
      ),
    ).toBeInTheDocument();
  });
});
