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
import { ScmIntegrations } from '@backstage/integration';
import { ConfigReader } from '@backstage/config';

const mockGitlabClient = {
  Users: {
    showCurrentUser: jest
      .fn()
      .mockResolvedValue({ id: 'id-test', username: 'username-test' }),
    allProjects: jest.fn().mockResolvedValue([]),
  },
  Groups: {
    all: jest.fn().mockResolvedValue([{ full_path: 'workspace1', id: '123' }]),
    allProjects: jest.fn().mockResolvedValue([{ name: 'repo-test' }]),
  },
};
jest.mock('@gitbeaker/rest', () => ({
  Gitlab: class {
    constructor() {
      return mockGitlabClient;
    }
  },
}));

describe('handleAutocompleteRequest', () => {
  const config = new ConfigReader({
    integrations: {
      gitlab: [
        {
          host: 'gitlab.com',
          token: 'glpat-abcdef',
          apiBaseUrl: 'https://gitlab.com/api/v4',
        },
      ],
    },
  });
  const integrations = ScmIntegrations.fromConfig(config);
  const handleAutocompleteRequest = createHandleAutocompleteRequest({
    integrations,
  });
  it('should return groups', async () => {
    const result = await handleAutocompleteRequest({
      token: 'foo',
      context: {},
      resource: 'groups',
    });

    expect(result).toEqual({
      results: [
        { title: 'workspace1', context: { groupId: '123' } },
        { title: 'username-test', context: { userId: 'id-test' } },
      ],
    });
  });

  it('should return repositories', async () => {
    const result = await handleAutocompleteRequest({
      token: 'foo',
      resource: 'repositories',
      context: {
        groupId: 'group1',
      },
    });

    expect(result).toEqual({ results: [{ title: 'repo-test' }] });
  });

  it('should throw an error when passing an invalid resource', async () => {
    await expect(
      handleAutocompleteRequest({
        token: 'token',
        resource: 'invalid',
        context: {},
      }),
    ).rejects.toThrow(InputError);
  });

  it('should throw an error when there are missing parameters', async () => {
    await expect(
      handleAutocompleteRequest({
        token: 'token',
        resource: 'repositories',
        context: {},
      }),
    ).rejects.toThrow(InputError);
  });
});
