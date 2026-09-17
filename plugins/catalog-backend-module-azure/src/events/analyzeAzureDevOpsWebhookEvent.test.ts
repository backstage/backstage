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

import { analyzeAzureDevOpsWebhookEvent } from './analyzeAzureDevOpsWebhookEvent';

const isRelevantPath = (path: string): boolean => path.endsWith('.yaml');

const baseRepository = {
  id: 'repo-id',
  name: 'example-repo',
  defaultBranch: 'refs/heads/main',
  remoteUrl:
    'https://dev.azure.com/example-org/example-project/_git/example-repo',
};

const withPushEvent = (resource: Record<string, unknown>) => ({
  eventType: 'git.push',
  resource,
});

describe('analyzeAzureDevOpsWebhookEvent', () => {
  describe('git.push', () => {
    it('translates file add, edit, delete, and rename operations to catalog scm events', async () => {
      await expect(
        analyzeAzureDevOpsWebhookEvent(
          'git.push',
          withPushEvent({
            repository: baseRepository,
            refUpdates: [{ name: 'refs/heads/main' }],
            commits: [
              {
                commitId: '1111111111111111111111111111111111111111',
                url: `${baseRepository.remoteUrl}/commit/1111111111111111111111111111111111111111`,
                changes: [
                  {
                    changeType: 'add',
                    item: { path: '/catalog-info.yaml' },
                  },
                  {
                    changeType: 'edit',
                    item: { path: '/service.yaml' },
                  },
                  {
                    changeType: 'delete',
                    item: { path: '/obsolete.yaml' },
                  },
                  {
                    changeType: 'rename',
                    originalPath: '/old-name.yaml',
                    item: { path: '/new-name.yaml' },
                  },
                  {
                    changeType: 'rename',
                    originalPath: '/catalog-out.yaml',
                    item: { path: '/docs/readme.md' },
                  },
                  {
                    changeType: 'rename',
                    originalPath: '/docs/intro.md',
                    item: { path: '/catalog-in.yaml' },
                  },
                ],
              },
            ],
          }),
          { isRelevantPath },
        ),
      ).resolves.toEqual({
        result: 'ok',
        events: [
          {
            type: 'location.created',
            url: `${baseRepository.remoteUrl}?path=/catalog-info.yaml`,
            context: {
              commitUrl: `${baseRepository.remoteUrl}/commit/1111111111111111111111111111111111111111`,
            },
          },
          {
            type: 'location.updated',
            url: `${baseRepository.remoteUrl}?path=/service.yaml`,
            context: {
              commitUrl: `${baseRepository.remoteUrl}/commit/1111111111111111111111111111111111111111`,
            },
          },
          {
            type: 'location.deleted',
            url: `${baseRepository.remoteUrl}?path=/obsolete.yaml`,
            context: {
              commitUrl: `${baseRepository.remoteUrl}/commit/1111111111111111111111111111111111111111`,
            },
          },
          {
            type: 'location.moved',
            fromUrl: `${baseRepository.remoteUrl}?path=/old-name.yaml`,
            toUrl: `${baseRepository.remoteUrl}?path=/new-name.yaml`,
            context: {
              commitUrl: `${baseRepository.remoteUrl}/commit/1111111111111111111111111111111111111111`,
            },
          },
          {
            type: 'location.deleted',
            url: `${baseRepository.remoteUrl}?path=/catalog-out.yaml`,
            context: {
              commitUrl: `${baseRepository.remoteUrl}/commit/1111111111111111111111111111111111111111`,
            },
          },
          {
            type: 'location.created',
            url: `${baseRepository.remoteUrl}?path=/catalog-in.yaml`,
            context: {
              commitUrl: `${baseRepository.remoteUrl}/commit/1111111111111111111111111111111111111111`,
            },
          },
        ],
      });
    });

    it('omits version parameter to match default provider URL format', async () => {
      await expect(
        analyzeAzureDevOpsWebhookEvent(
          'git.push',
          withPushEvent({
            repository: baseRepository,
            refUpdates: [{ name: 'refs/heads/main' }],
            commits: [
              {
                commitId: 'abc',
                changes: [
                  { changeType: 'add', item: { path: '/catalog-info.yaml' } },
                ],
              },
            ],
          }),
          { isRelevantPath },
        ),
      ).resolves.toEqual({
        result: 'ok',
        events: [
          {
            type: 'location.created',
            url: `${baseRepository.remoteUrl}?path=/catalog-info.yaml`,
            context: { commitUrl: `${baseRepository.remoteUrl}/commit/abc` },
          },
        ],
      });
    });

    it('ignores non-default-branch pushes', async () => {
      await expect(
        analyzeAzureDevOpsWebhookEvent(
          'git.push',
          withPushEvent({
            repository: baseRepository,
            refUpdates: [{ name: 'refs/heads/feature-branch' }],
            commits: [{ commitId: 'a', changes: [] }],
          }),
          { isRelevantPath },
        ),
      ).resolves.toEqual({
        result: 'ignored',
        reason:
          'Azure DevOps push event did not target the default branch, expected "refs/heads/main": https://dev.azure.com/example-org/example-project/_git/example-repo',
      });
    });

    it('ignores pushes without file-level change data', async () => {
      await expect(
        analyzeAzureDevOpsWebhookEvent(
          'git.push',
          withPushEvent({
            repository: baseRepository,
            refUpdates: [{ name: 'refs/heads/main' }],
            commits: [{ commitId: 'a' }],
            url: 'https://dev.azure.com/example-org/example-project/_apis/repos/git/repositories/repo-id/pushes/10',
          }),
          { isRelevantPath },
        ),
      ).resolves.toEqual({
        result: 'ignored',
        reason:
          'Azure DevOps push event did not affect any relevant paths: https://dev.azure.com/example-org/example-project/_apis/repos/git/repositories/repo-id/pushes/10',
      });
    });
  });

  describe('git.repo.*', () => {
    it('translates repository created events', async () => {
      await expect(
        analyzeAzureDevOpsWebhookEvent(
          'git.repo.created',
          { resource: { repository: baseRepository } },
          { isRelevantPath },
        ),
      ).resolves.toEqual({
        result: 'ok',
        events: [{ type: 'repository.created', url: baseRepository.remoteUrl }],
      });
    });

    it('translates repository deleted events', async () => {
      await expect(
        analyzeAzureDevOpsWebhookEvent(
          'git.repo.deleted',
          { resource: { repository: baseRepository } },
          { isRelevantPath },
        ),
      ).resolves.toEqual({
        result: 'ok',
        events: [{ type: 'repository.deleted', url: baseRepository.remoteUrl }],
      });
    });

    it('translates repository status changed events', async () => {
      await expect(
        analyzeAzureDevOpsWebhookEvent(
          'git.repo.statuschanged',
          { resource: { repository: baseRepository } },
          { isRelevantPath },
        ),
      ).resolves.toEqual({
        result: 'ok',
        events: [{ type: 'repository.updated', url: baseRepository.remoteUrl }],
      });
    });

    it('translates repository renamed events', async () => {
      await expect(
        analyzeAzureDevOpsWebhookEvent(
          'git.repo.renamed',
          {
            resource: {
              oldName: 'legacy-repo',
              repository: baseRepository,
            },
          },
          { isRelevantPath },
        ),
      ).resolves.toEqual({
        result: 'ok',
        events: [
          {
            type: 'repository.moved',
            fromUrl:
              'https://dev.azure.com/example-org/example-project/_git/legacy-repo',
            toUrl: baseRepository.remoteUrl,
          },
        ],
      });
    });
  });

  describe('general behavior', () => {
    it('throws on non-object payloads', async () => {
      await expect(
        analyzeAzureDevOpsWebhookEvent('git.push', undefined, {
          isRelevantPath,
        }),
      ).rejects.toThrow('Azure DevOps webhook event payload is not an object');
    });

    it('returns unsupported events', async () => {
      await expect(
        analyzeAzureDevOpsWebhookEvent(
          'git.pullrequest.created',
          { resource: {} },
          { isRelevantPath },
        ),
      ).resolves.toEqual({
        result: 'unsupported-event',
        event: 'git.pullrequest.created',
      });
    });
  });
});
