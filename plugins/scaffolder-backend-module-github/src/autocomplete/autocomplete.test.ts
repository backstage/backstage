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

import { InputError } from '@backstage/errors';
import { createHandleAutocompleteRequest } from './autocomplete';
import { ScmIntegrationRegistry } from '@backstage/integration';

jest.mock('../util', () => {
  return {
    getOctokitOptions: jest.fn(),
  };
});

const mockOctokit = {
  paginate: async (fn: any) => (await fn()).data,
  rest: {
    repos: {
      listForAuthenticatedUser: jest.fn(),
      listBranches: jest.fn(),
    },
  },
};
jest.mock('octokit', () => ({
  Octokit: class {
    constructor() {
      return mockOctokit;
    }
  },
}));

describe('handleAutocompleteRequest', () => {
  const mockIntegrations = {} as ScmIntegrationRegistry;

  it('should return repositories with owner', async () => {
    const handleAutocompleteRequest = createHandleAutocompleteRequest({
      integrations: mockIntegrations,
    });

    mockOctokit.rest.repos.listForAuthenticatedUser.mockResolvedValue({
      data: [
        {
          full_name: 'backstage/backstage',
        },
      ],
    });

    const result = await handleAutocompleteRequest({
      resource: 'repositoriesWithOwner',
      token: 'token',
      context: {},
    });

    expect(result).toEqual({
      results: [{ id: 'backstage/backstage' }],
    });
  });

  it('should return branches', async () => {
    const handleAutocompleteRequest = createHandleAutocompleteRequest({
      integrations: mockIntegrations,
    });

    mockOctokit.rest.repos.listBranches.mockResolvedValue({
      data: [
        {
          name: 'main',
        },
      ],
    });

    const result = await handleAutocompleteRequest({
      resource: 'branches',
      token: 'token',
      context: {
        owner: 'backstage',
        repository: 'backstage',
      },
    });

    expect(result).toEqual({
      results: [{ id: 'main' }],
    });
  });

  it('should throw an error for invalid resource', async () => {
    const handleAutocompleteRequest = createHandleAutocompleteRequest({
      integrations: mockIntegrations,
    });

    await expect(
      handleAutocompleteRequest({
        resource: 'invalid',
        token: 'token',
        context: {},
      }),
    ).rejects.toThrow(InputError);
  });

  it('should throw an error when there are missing parameters', async () => {
    const handleAutocompleteRequest = createHandleAutocompleteRequest({
      integrations: mockIntegrations,
    });

    await expect(
      handleAutocompleteRequest({
        token: 'token',
        resource: 'branches',
        context: {},
      }),
    ).rejects.toThrow(InputError);
  });
});
