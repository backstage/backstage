/*
 * Copyright 2022 The Backstage Authors
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
import { getVoidLogger } from '@backstage/backend-common';
import { ConfigReader } from '@backstage/config';

import { GitLabOrgEntityProvider } from './GitLabOrgEntityProvider';
import { readUsers, getGroups } from './lib';

jest.mock('./lib', () => {
  const actualGitLab = jest.requireActual('./lib');
  return {
    ...actualGitLab,
    readUsers: jest.fn(),
    getInstanceUsers: jest.fn(),
    getGroups: jest.fn(),
  };
});

function mockConfig() {
  return new ConfigReader({
    integrations: {
      gitlab: [
        {
          host: 'gitlab.example.com',
          token: 'test-token',
          apiBaseUrl: 'https://gitlab.example.com/api/v4',
        },
        {
          host: 'gitlab.com',
          token: 'test-token',
        },
      ],
    },
    gitlabOrg: {
      providers: [
        {
          target: 'https://gitlab.example.com',
        },
        {
          target: 'https://gitlab.com/group',
        },
      ],
    },
  });
}

describe('GitLabOrgEntityProvider', () => {
  describe('getProviderName', () => {
    it('should provide its suffixed name', () => {
      const processor = GitLabOrgEntityProvider.fromConfig(mockConfig(), {
        id: 'test',
        logger: getVoidLogger(),
      });

      expect(processor.getProviderName()).toEqual('gitlab-org:test');
    });
  });

  describe('fromConfig', () => {
    it('should error if gitlab org provider config is missing', () => {
      expect(() => {
        GitLabOrgEntityProvider.fromConfig(new ConfigReader({}), {
          id: 'test',
          logger: getVoidLogger(),
        });
      }).toThrowError();
    });
  });

  describe('read', () => {
    it('missing connection should error', async () => {
      const provider = GitLabOrgEntityProvider.fromConfig(mockConfig(), {
        id: 'test',
        logger: getVoidLogger(),
      });
      await expect(provider.read()).rejects.toThrowError();
    });

    it('should handle targets with user ingestion enabled', async () => {
      const provider = GitLabOrgEntityProvider.fromConfig(mockConfig(), {
        id: 'test',
        logger: getVoidLogger(),
      });
      await provider.connect({
        applyMutation: jest.fn(),
      });

      await provider.read();
      expect(readUsers).toBeCalled();
    });

    it('should handle targets with group ingestion enabled', async () => {
      const provider = GitLabOrgEntityProvider.fromConfig(mockConfig(), {
        id: 'test',
        logger: getVoidLogger(),
      });
      const mockApplyMutation = jest.fn();
      await provider.connect({
        applyMutation: mockApplyMutation,
      });

      await provider.read();
      expect(getGroups).toBeCalled();
    });
  });
});
