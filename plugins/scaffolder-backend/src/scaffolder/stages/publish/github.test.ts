/*
 * Copyright 2020 Spotify AB
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

jest.mock('@octokit/rest');
jest.mock('nodegit');

import { Octokit } from '@octokit/rest';
import { OctokitResponse, ReposCreateInOrgResponseData } from '@octokit/types';
import { GithubPublisher } from './github';

const { mockGithubClient } = require('@octokit/rest') as {
  mockGithubClient: { repos: jest.Mocked<Octokit['repos']> };
};

describe('Github Publisher', () => {
  const publisher = new GithubPublisher({ client: new Octokit() });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('publish: createRemoteInGithub', () => {
    it('should use octokit to create a repo in an organisation if the organisation property is set', async () => {
      mockGithubClient.repos.createInOrg.mockResolvedValue({
        data: {
          clone_url: 'mockclone',
        },
      } as OctokitResponse<ReposCreateInOrgResponseData>);

      await publisher.publish({
        values: {
          isOrg: true,
          storePath: 'blam/test',
          owner: 'bob',
        },
        directory: '/tmp/test',
      });

      expect(mockGithubClient.repos.createInOrg).toHaveBeenCalledWith({
        org: 'blam',
        name: 'test',
      });
    });

    it('should use octokit to create a repo in the authed user if the organisation property is not set', async () => {
      mockGithubClient.repos.createForAuthenticatedUser.mockResolvedValue({
        data: {
          clone_url: 'mockclone',
        },
      } as OctokitResponse<ReposCreateInOrgResponseData>);

      await publisher.publish({
        values: {
          storePath: 'blam/test',
          owner: 'bob',
        },
        directory: '/tmp/test',
      });

      expect(
        mockGithubClient.repos.createForAuthenticatedUser,
      ).toHaveBeenCalledWith({
        name: 'test',
      });
    });
  });

  describe('publish: createGitDirectory', () => {});
});
