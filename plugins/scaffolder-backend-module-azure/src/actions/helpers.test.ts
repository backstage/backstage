/*
 * Copyright 2025 The Backstage Authors
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

import { generateGitChanges, getAzureRemotePullRequestUrl } from './helpers';
import { VersionControlChangeType } from 'azure-devops-node-api/interfaces/GitInterfaces';

describe('Azure DevOps Utils', () => {
  describe('getAzureRemotePullRequestUrl', () => {
    it('should encode project and repo names correctly', () => {
      const url = getAzureRemotePullRequestUrl(
        'dev.azure.com',
        'my-org',
        'my-project',
        'my-repo',
        456,
      );
      expect(url).toBe(
        'https://dev.azure.com/my-org/my-project/my-repo/pullrequest/456',
      );
    });
  });

  describe('generateGitChanges', () => {
    const directoryContents = [
      { path: 'file1.txt', content: Buffer.from('content1') },
      { path: 'folder/file2.txt', content: Buffer.from('content2') },
    ];

    it('should generate git changes for adding files', () => {
      const changes = generateGitChanges(directoryContents, '/root');
      expect(changes).toHaveLength(2);
      expect(changes[0]!.changeType).toBe(VersionControlChangeType.Add);
      expect(changes[0]!.item).toBeDefined();
      expect(changes[0]!.item!.path).toBe('/file1.txt');
      expect(changes[1]!.item).toBeDefined();
      expect(changes[1]!.item!.path).toBe('/folder/file2.txt');
    });

    it('should generate git changes for deleting files', () => {
      const changes = generateGitChanges([], '/root', undefined, [
        'file-to-delete.txt',
      ]);
      expect(changes).toHaveLength(1);
      expect(changes[0]!.changeType).toBe(VersionControlChangeType.Delete);
      expect(changes[0]!.item).toBeDefined();
      expect(changes[0]!.item!.path).toBe('/file-to-delete.txt');
    });

    it('should handle targetPath correctly', () => {
      const changes = generateGitChanges(directoryContents, '/root', 'target');
      expect(changes[0]!.item).toBeDefined();
      expect(changes[0]!.item!.path).toBe('/target/file1.txt');
      expect(changes[1]!.item).toBeDefined();
      expect(changes[1]!.item!.path).toBe('/target/folder/file2.txt');
    });
  });
});
