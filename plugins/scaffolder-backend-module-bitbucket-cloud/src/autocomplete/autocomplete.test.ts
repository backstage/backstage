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
import { BitbucketCloudClient } from '@backstage/plugin-bitbucket-cloud-common';
import { handleAutocompleteRequest } from './autocomplete';

describe('handleAutocompleteRequest', () => {
  const client: Partial<BitbucketCloudClient> = {
    listWorkspaces: jest.fn().mockReturnValue({
      iteratePages: jest.fn().mockReturnValue([
        {
          values: [
            {
              slug: 'workspace1',
              uuid: '486F4F29-9B88-4BE8-9092-24BEB8A5F3B3',
            },
          ],
        },
      ]),
    }),
    listProjectsByWorkspace: jest.fn().mockReturnValue({
      iteratePages: jest.fn().mockReturnValue([
        {
          values: [
            { key: 'project1', uuid: '70F065E3-CE7C-487A-99B6-D81EB84E5A21' },
          ],
        },
      ]),
    }),
    listRepositoriesByWorkspace: jest.fn().mockReturnValue({
      iteratePages: jest.fn().mockReturnValue([
        {
          values: [
            {
              slug: 'repository1',
              uuid: 'F2F0DAF7-B4D6-4694-A131-C2478A200AC5',
            },
          ],
        },
      ]),
    }),
    listBranchesByRepository: jest.fn().mockReturnValue({
      iteratePages: jest
        .fn()
        .mockReturnValue([{ values: [{ name: 'branch1' }] }]),
    }),
  };

  const fromConfig = jest
    .spyOn(BitbucketCloudClient, 'fromConfig')
    .mockReturnValue(client as BitbucketCloudClient);

  it('should pass the token to the client', async () => {
    const accessToken = 'foo';
    await handleAutocompleteRequest({
      token: accessToken,
      context: {},
      resource: 'workspaces',
    });

    expect(fromConfig).toHaveBeenCalledWith(
      expect.objectContaining({ token: accessToken }),
    );
  });

  it('should return workspaces', async () => {
    const result = await handleAutocompleteRequest({
      token: 'foo',
      context: {},
      resource: 'workspaces',
    });

    expect(result).toEqual({
      results: [
        { title: 'workspace1', id: '486F4F29-9B88-4BE8-9092-24BEB8A5F3B3' },
      ],
    });
  });

  it('should return projects', async () => {
    const result = await handleAutocompleteRequest({
      token: 'foo',
      context: {
        workspace: 'workspace1',
      },
      resource: 'projects',
    });

    expect(result).toEqual({
      results: [
        { title: 'project1', id: '70F065E3-CE7C-487A-99B6-D81EB84E5A21' },
      ],
    });
  });

  it('should return repositories', async () => {
    const result = await handleAutocompleteRequest({
      token: 'foo',
      resource: 'repositories',
      context: {
        workspace: 'workspace1',
        project: 'project1',
      },
    });

    expect(result).toEqual({
      results: [
        { title: 'repository1', id: 'F2F0DAF7-B4D6-4694-A131-C2478A200AC5' },
      ],
    });
  });

  it('should return branches', async () => {
    const result = await handleAutocompleteRequest({
      token: 'foo',
      resource: 'branches',
      context: {
        workspace: 'workspace1',
        repository: 'repository1',
      },
    });

    expect(result).toEqual({ results: [{ title: 'branch1', id: 'branch1' }] });
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
        resource: 'projects',
        context: {},
      }),
    ).rejects.toThrow(InputError);
  });
});
