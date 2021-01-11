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

jest.mock('@gitbeaker/node');
jest.mock('./helpers');

import { GitlabPublisher } from './gitlab';
import { Gitlab as GitlabAPI } from '@gitbeaker/core';
import { Gitlab } from '@gitbeaker/node';
import { initRepoAndPush } from './helpers';
import { getVoidLogger } from '@backstage/backend-common';

const { mockGitlabClient } = require('@gitbeaker/node') as {
  mockGitlabClient: {
    Namespaces: jest.Mocked<GitlabAPI['Namespaces']>;
    Projects: jest.Mocked<GitlabAPI['Projects']>;
    Users: jest.Mocked<GitlabAPI['Users']>;
  };
};

describe('GitLab Publisher', () => {
  const logger = getVoidLogger();
  const publisher = new GitlabPublisher(new Gitlab({}), 'fake-token');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('publish: createRemoteInGitLab', () => {
    it('should use gitbeaker to create a repo in a namespace if the namespace property is set', async () => {
      mockGitlabClient.Namespaces.show.mockResolvedValue({
        id: 42,
      } as { id: number });
      mockGitlabClient.Projects.create.mockResolvedValue({
        http_url_to_repo: 'mockclone',
      } as { http_url_to_repo: string });

      const result = await publisher.publish({
        values: {
          isOrg: true,
          storePath: 'bloum/blam/test',
          owner: 'bob',
        },
        directory: '/tmp/test',
        logger,
      });

      expect(result).toEqual({ remoteUrl: 'mockclone' });
      expect(mockGitlabClient.Projects.create).toHaveBeenCalledWith({
        namespace_id: 42,
        name: 'test',
      });
      expect(initRepoAndPush).toHaveBeenCalledWith({
        dir: '/tmp/test',
        remoteUrl: 'mockclone',
        auth: { username: 'oauth2', password: 'fake-token' },
        logger,
      });
    });

    it('should use gitbeaker to create a repo in the authed user if the namespace property is not set', async () => {
      mockGitlabClient.Namespaces.show.mockResolvedValue({});
      mockGitlabClient.Users.current.mockResolvedValue({
        id: 21,
      } as { id: number });
      mockGitlabClient.Projects.create.mockResolvedValue({
        http_url_to_repo: 'mockclone',
      } as { http_url_to_repo: string });

      const result = await publisher.publish({
        values: {
          storePath: 'bloum/blam/test',
          owner: 'bob',
        },
        directory: '/tmp/test',
        logger,
      });

      expect(result).toEqual({ remoteUrl: 'mockclone' });
      expect(mockGitlabClient.Users.current).toHaveBeenCalled();
      expect(mockGitlabClient.Projects.create).toHaveBeenCalledWith({
        namespace_id: 21,
        name: 'test',
      });
      expect(initRepoAndPush).toHaveBeenCalledWith({
        dir: '/tmp/test',
        remoteUrl: 'mockclone',
        auth: { username: 'oauth2', password: 'fake-token' },
        logger,
      });
    });
  });
});
