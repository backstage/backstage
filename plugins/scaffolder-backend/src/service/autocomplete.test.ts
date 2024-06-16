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

import { BitbucketCloudClient } from '@backstage/plugin-bitbucket-cloud-common';
import { handleBitbucketCloudRequest } from './autocomplete';
import { InputError } from '@backstage/errors';

describe('handleBitbucketCloudRequest', () => {
  const client: Partial<BitbucketCloudClient> = {
    listWorkspaces: jest.fn().mockReturnValue({
      iteratePages: jest
        .fn()
        .mockReturnValue([{ values: [{ slug: 'workspace1' }] }]),
    }),
    listProjectsByWorkspace: jest.fn().mockReturnValue({
      iteratePages: jest
        .fn()
        .mockReturnValue([{ values: [{ key: 'project1' }] }]),
    }),
    listRepositoriesByWorkspace: jest.fn().mockReturnValue({
      iteratePages: jest
        .fn()
        .mockReturnValue([{ values: [{ slug: 'repository1' }] }]),
    }),
  };

  const fromConfig = jest
    .spyOn(BitbucketCloudClient, 'fromConfig')
    .mockReturnValue(client as BitbucketCloudClient);

  it('should pass the token to the client', async () => {
    const accessToken = 'foo';
    await handleBitbucketCloudRequest(accessToken, 'workspaces', {});

    expect(fromConfig).toHaveBeenCalledWith(
      expect.objectContaining({ accessToken }),
    );
  });

  it('should return workspaces', async () => {
    const result = await handleBitbucketCloudRequest('foo', 'workspaces', {});

    expect(result).toEqual(['workspace1']);
  });

  it('should return projects', async () => {
    const result = await handleBitbucketCloudRequest('foo', 'projects', {
      workspace: 'workspace1',
    });

    expect(result).toEqual(['project1']);
  });

  it('should return repositories', async () => {
    const result = await handleBitbucketCloudRequest('foo', 'repositories', {
      workspace: 'workspace1',
      project: 'project1',
    });

    expect(result).toEqual(['repository1']);
  });

  it('should throw an error when passing an invalid resource', async () => {
    await expect(
      handleBitbucketCloudRequest('token', 'invalid', {}),
    ).rejects.toThrow(InputError);
  });

  it('should throw an error when there are missing parameters', async () => {
    await expect(
      handleBitbucketCloudRequest('token', 'projects', {}),
    ).rejects.toThrow(InputError);
  });
});
