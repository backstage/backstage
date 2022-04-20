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
import { GitLabOrgEntityProvider } from './GitLabOrgEntityProvider';
import { GitLabClient, readGroups, readUsers } from './lib';

describe('GitLabOrgEntityProvider', () => {
  const logger = getVoidLogger();
  const mockClient = {
    listProjects: jest.fn(),
    listGroups: jest.fn(),
    listUsers: jest.fn(),
  };
  const client = mockClient as unknown as GitLabClient;

  describe('getProviderName', () => {
    it('should provide its suffixed name', () => {
      const processor = new GitLabOrgEntityProvider({
        id: 'test',
        targets: [],
        client,
        logger,
      });
      expect(processor.getProviderName()).toEqual(
        'GitLabOrgEntityProvider:test',
      );
    });
  });

  describe('read', () => {
    it('should pass along client errors', async () => {
      const provider = new GitLabOrgEntityProvider({
        id: 'test',
        targets: [],
        client,
        logger,
      });
      await provider.connect({
        applyMutation: jest.fn(),
      } as any);
      mockClient.listGroups.mockRejectedValue('BOO');
      await expect(provider.read()).rejects.toThrowError('BOO');
    });

    it('should handle targets with user ingestion enabled', async () => {
      const provider = new GitLabOrgEntityProvider({
        id: 'test',
        targets: [],
        client,
        logger,
      });
      await provider.connect({
        applyMutation: jest.fn(),
      });
      await provider.read();
      expect(readUsers).toBeCalled();
    });

    it('should handle targets with group ingestion enabled', async () => {
      const provider = new GitLabOrgEntityProvider({
        id: 'test',
        targets: [],
        client,
        logger,
      });
      const mockApplyMutation = jest.fn();
      await provider.connect({
        applyMutation: mockApplyMutation,
      });

      await provider.read();
      expect(readGroups).toBeCalled();
    });
  });
});
