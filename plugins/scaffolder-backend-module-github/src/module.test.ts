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

import { mockServices, startTestBackend } from '@backstage/backend-test-utils';
import {
  TemplateAction,
  scaffolderActionsExtensionPoint,
} from '@backstage/plugin-scaffolder-node';
import { scaffolderAutocompleteExtensionPoint } from '@backstage/plugin-scaffolder-node/alpha';
import { catalogServiceMock } from '@backstage/plugin-catalog-node/testUtils';
import { createMockActionContext } from '@backstage/plugin-scaffolder-node-test-utils';
import { SingleInstanceGithubCredentialsProvider } from '@backstage/integration';
import { Octokit } from 'octokit';
import { githubModule } from './module';

const octokitMock = Octokit as unknown as jest.Mock;
const mockOctokit = {
  rest: {
    actions: {
      getRepoPublicKey: jest.fn(),
      createOrUpdateRepoSecret: jest.fn(),
    },
    repos: {
      get: jest.fn(),
      createDeployKey: jest.fn(),
    },
  },
};

jest.mock('octokit', () => ({
  Octokit: jest.fn(),
}));

describe('githubModule', () => {
  const publicKey = '2Sg8iYjAxxmI2LvUXpJjkYrMxURPc8r+dB7TJyvvcCU=';

  beforeEach(() => {
    jest.resetAllMocks();
    octokitMock.mockImplementation(() => mockOctokit);
    mockOctokit.rest.actions.getRepoPublicKey.mockResolvedValue({
      data: {
        key: publicKey,
        key_id: 'keyid',
      },
    });
    mockOctokit.rest.actions.createOrUpdateRepoSecret.mockResolvedValue({});
    mockOctokit.rest.repos.createDeployKey.mockResolvedValue({});
    mockOctokit.rest.repos.get.mockResolvedValue({
      data: {
        default_branch: 'main',
        id: 1,
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  async function initModuleWithConfig(configData: Record<string, any>) {
    const registeredActions: TemplateAction<any, any, any>[] = [];
    const scaffolderActionsMock = {
      addActions: jest.fn((...actions: TemplateAction<any, any, any>[]) => {
        registeredActions.push(...actions);
      }),
    };
    const autocompleteMock = {
      addAutocompleteProvider: jest.fn(),
    };

    await startTestBackend({
      extensionPoints: [
        [scaffolderActionsExtensionPoint, scaffolderActionsMock],
        [scaffolderAutocompleteExtensionPoint, autocompleteMock],
      ],
      features: [
        githubModule,
        catalogServiceMock.factory(),
        mockServices.rootConfig.factory({ data: configData }),
      ],
    });

    return { registeredActions, scaffolderActionsMock, autocompleteMock };
  }

  it('registers all 14 actions and the autocomplete provider', async () => {
    const { registeredActions, autocompleteMock } = await initModuleWithConfig({
      integrations: {
        github: [{ host: 'github.com', token: 'test-token' }],
      },
    });

    expect(autocompleteMock.addAutocompleteProvider).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'github' }),
    );

    const actionIds = registeredActions.map(a => a.id).sort();
    expect(actionIds).toEqual([
      'github:actions:dispatch',
      'github:autolinks:create',
      'github:branch-protection:create',
      'github:deployKey:create',
      'github:environment:create',
      'github:issues:create',
      'github:issues:label',
      'github:pages:enable',
      'github:repo:create',
      'github:repo:push',
      'github:repo:rulesets:create',
      'github:webhook',
      'publish:github',
      'publish:github:pull-request',
    ]);
  });

  it('selects dedicated scaffolder credentials matching plugins match rule', async () => {
    const { registeredActions } = await initModuleWithConfig({
      integrations: {
        github: [{ host: 'github.com' }],
      },
      connections: [
        {
          type: 'github',
          host: 'github.com',
          auth: [
            {
              method: 'token',
              token: 'catalog-token',
              match: { plugins: ['catalog'] },
            },
            {
              method: 'token',
              token: 'scaffolder-dedicated-token',
              match: { plugins: ['scaffolder'] },
            },
          ],
        },
      ],
    });

    const deployKeyAction = registeredActions.find(
      a => a.id === 'github:deployKey:create',
    )!;
    expect(deployKeyAction).toBeDefined();

    const ctx = createMockActionContext({
      input: {
        repoUrl: 'github.com?repo=repository&owner=owner',
        publicKey,
        privateKey: 'privatekey',
        deployKeyName: 'test-key',
      },
    });

    await deployKeyAction.handler(ctx);

    expect(octokitMock).toHaveBeenCalledWith(
      expect.objectContaining({ auth: 'scaffolder-dedicated-token' }),
    );
  });

  it('resolves multiple GitHub apps for different organizations on the same host', async () => {
    jest
      .spyOn(SingleInstanceGithubCredentialsProvider, 'create')
      .mockImplementation(config => {
        const appId = config.apps?.[0]?.appId;
        return {
          getCredentials: jest.fn(async () => ({
            token: appId === 1 ? 'org-alpha-app-token' : 'org-beta-app-token',
            headers: {},
            type: 'token' as const,
          })),
        };
      });

    const { registeredActions } = await initModuleWithConfig({
      integrations: {
        github: [{ host: 'github.com' }],
      },
      connections: [
        {
          type: 'github',
          host: 'github.com',
          auth: [
            {
              method: 'app',
              appId: 1,
              privateKey: 'pk-alpha',
              clientId: 'client-alpha',
              clientSecret: 'secret-alpha',
              orgs: ['org-alpha'],
              match: { plugins: ['scaffolder'] },
            },
            {
              method: 'app',
              appId: 2,
              privateKey: 'pk-beta',
              clientId: 'client-beta',
              clientSecret: 'secret-beta',
              orgs: ['org-beta'],
              match: { plugins: ['scaffolder'] },
            },
          ],
        },
      ],
    });

    const deployKeyAction = registeredActions.find(
      a => a.id === 'github:deployKey:create',
    )!;

    const ctxAlpha = createMockActionContext({
      input: {
        repoUrl: 'github.com?repo=repository&owner=org-alpha',
        publicKey,
        privateKey: 'privatekey',
        deployKeyName: 'alpha-key',
      },
    });

    await deployKeyAction.handler(ctxAlpha);
    expect(octokitMock).toHaveBeenCalledWith(
      expect.objectContaining({ auth: 'org-alpha-app-token' }),
    );

    octokitMock.mockClear();

    const ctxBeta = createMockActionContext({
      input: {
        repoUrl: 'github.com?repo=repository&owner=org-beta',
        publicKey,
        privateKey: 'privatekey',
        deployKeyName: 'beta-key',
      },
    });

    await deployKeyAction.handler(ctxBeta);
    expect(octokitMock).toHaveBeenCalledWith(
      expect.objectContaining({ auth: 'org-beta-app-token' }),
    );
  });

  it('falls back to legacy integration config when no connections are defined', async () => {
    const { registeredActions } = await initModuleWithConfig({
      integrations: {
        github: [{ host: 'github.com', token: 'legacy-integration-token' }],
      },
    });

    const deployKeyAction = registeredActions.find(
      a => a.id === 'github:deployKey:create',
    )!;

    const ctx = createMockActionContext({
      input: {
        repoUrl: 'github.com?repo=repository&owner=owner',
        publicKey,
        privateKey: 'privatekey',
        deployKeyName: 'legacy-key',
      },
    });

    await deployKeyAction.handler(ctx);

    expect(octokitMock).toHaveBeenCalledWith(
      expect.objectContaining({ auth: 'legacy-integration-token' }),
    );
  });

  it('fails with meaningful error when no connection matches and no legacy token exists', async () => {
    const { registeredActions } = await initModuleWithConfig({
      integrations: {
        github: [{ host: 'github.com' }],
      },
      connections: [
        {
          type: 'github',
          host: 'github.com',
          auth: [
            {
              method: 'token',
              token: 'other-token',
              match: { plugins: ['catalog'] },
            },
          ],
        },
      ],
    });

    const deployKeyAction = registeredActions.find(
      a => a.id === 'github:deployKey:create',
    )!;

    const ctx = createMockActionContext({
      input: {
        repoUrl: 'github.com?repo=repository&owner=owner',
        publicKey,
        privateKey: 'privatekey',
        deployKeyName: 'unmatched-key',
      },
    });

    await expect(deployKeyAction.handler(ctx)).rejects.toThrow(
      /has no auth method available to this plugin/,
    );
  });

  it('allows step-level token to override connection credentials', async () => {
    const { registeredActions } = await initModuleWithConfig({
      integrations: {
        github: [{ host: 'github.com' }],
      },
      connections: [
        {
          type: 'github',
          host: 'github.com',
          auth: [
            {
              method: 'token',
              token: 'connection-token',
              match: { plugins: ['scaffolder'] },
            },
          ],
        },
      ],
    });

    const deployKeyAction = registeredActions.find(
      a => a.id === 'github:deployKey:create',
    )!;

    const ctx = createMockActionContext({
      input: {
        repoUrl: 'github.com?repo=repository&owner=owner',
        publicKey,
        privateKey: 'privatekey',
        deployKeyName: 'step-token-key',
        token: 'step-explicit-token',
      },
    });

    await deployKeyAction.handler(ctx);

    expect(octokitMock).toHaveBeenCalledWith(
      expect.objectContaining({ auth: 'step-explicit-token' }),
    );
  });
});
