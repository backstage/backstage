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
import { createServiceFactory } from '@backstage/backend-plugin-api';
import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import { actionsRegistryServiceRef } from '@backstage/backend-plugin-api/alpha';
import { atlassianActionsPlugin } from './plugin';
import { providerTokenServiceRef } from '@devhub/plugin-provider-token-node';

// Mock fetch globally
const mockFetch = jest.fn();
global.fetch = mockFetch as any;

describe('atlassianActionsPlugin — jira:getIssue action', () => {
  let registeredActions: Map<string, Function>;
  let mockTokenService: {
    getToken: jest.Mock;
    upsertToken: jest.Mock;
    deleteToken: jest.Mock;
    deleteTokens: jest.Mock;
  };

  beforeEach(async () => {
    registeredActions = new Map();
    mockFetch.mockReset();

    const mockActionsService = {
      register: jest.fn((opts: any) => {
        registeredActions.set(opts.name, opts.action);
      }),
    };

    mockTokenService = {
      getToken: jest.fn().mockResolvedValue(undefined),
      upsertToken: jest.fn(),
      deleteToken: jest.fn(),
      deleteTokens: jest.fn(),
    };

    await startTestBackend({
      features: [
        atlassianActionsPlugin,
        mockServices.rootConfig.factory({
          data: {
            atlassian: { cloudId: 'test-cloud-id' },
          },
        }),
        createServiceFactory({
          service: actionsRegistryServiceRef,
          deps: {},
          factory: () => mockActionsService,
        }),
        createServiceFactory({
          service: providerTokenServiceRef,
          deps: {},
          factory: () => mockTokenService,
        }),
      ],
    });
  });

  it('registers atlassian:jira:getIssue action', () => {
    expect(registeredActions.has('atlassian:jira:getIssue')).toBe(true);
  });

  it('throws when credentials are not a user principal', async () => {
    const action = registeredActions.get('atlassian:jira:getIssue')!;
    const serviceCredentials = {
      principal: { type: 'service', subject: 'bot' },
    };
    await expect(
      action({
        input: { issueKey: 'PROJ-1' },
        credentials: serviceCredentials,
        logger: mockServices.logger.mock(),
      }),
    ).rejects.toThrow('user principal');
  });

  it('throws with generic message when no Atlassian token stored', async () => {
    const action = registeredActions.get('atlassian:jira:getIssue')!;
    const userCredentials = {
      principal: { type: 'user', userEntityRef: 'user:default/alice' },
    };
    await expect(
      action({
        input: { issueKey: 'PROJ-1' },
        credentials: userCredentials,
        logger: mockServices.logger.mock(),
      }),
    ).rejects.toThrow(/sign in with Atlassian/i);
  });

  it('throws and does NOT delete the token on 401 from Jira API', async () => {
    // todo #020: handleUnauthorized no longer deletes tokens unconditionally —
    // a 401 can be transient (rate-limit, brief outage). Deleting a valid token
    // on a transient 401 would force the user to re-authenticate unnecessarily.
    const action = registeredActions.get('atlassian:jira:getIssue')!;
    const userCredentials = {
      principal: { type: 'user', userEntityRef: 'user:default/alice' },
    };

    mockTokenService.getToken.mockResolvedValue({
      userEntityRef: 'user:default/alice',
      providerId: 'atlassian',
      accessToken: 'stale-token',
      expiresAt: undefined,
      scope: undefined,
    });

    mockFetch.mockResolvedValue({
      status: 401,
      ok: false,
    } as Response);

    await expect(
      action({
        input: { issueKey: 'PROJ-1' },
        credentials: userCredentials,
        logger: mockServices.logger.mock(),
      }),
    ).rejects.toThrow(/re-authenticate/i);

    // Token must NOT be deleted — caller should re-authenticate only if they
    // determine the failure is permanent (e.g. via atlassian:auth:checkSession).
    expect(mockTokenService.deleteToken).not.toHaveBeenCalled();
  });
});
